const pool = require("../config/db");


async function createOrder(req, res) {
  let customer = req.body.customerId;
  let items = req.body.items;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  let client = await pool.connect();
  await client.query("BEGIN");

  let total = 0;
  let prices = [];

  for (let i = 0; i < items.length; i++) {
    let r = await client.query("SELECT * FROM products WHERE id = $1", [items[i].productId]);
    let p = r.rows[0];

    if (!p) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (p.stock_qty < items[i].quantity) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(409).json({ success: false, message: "Stock not enough" });
    }

    total = total + (p.unit_price * items[i].quantity);
    prices.push(p.unit_price);
  }

  let orderNo = "ORD-" + Math.floor(1000 + Math.random() * 9000);
  let or = await client.query(
    "INSERT INTO orders (order_no, customer_id, total) VALUES ($1, $2, $3) RETURNING id",
    [orderNo, customer, total]
  );
  let orderId = or.rows[0].id;

  for (let i = 0; i < items.length; i++) {
    let lineTotal = prices[i] * items[i].quantity;

    await client.query(
      "INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES ($1, $2, $3, $4, $5)",
      [orderId, items[i].productId, items[i].quantity, prices[i], lineTotal]
    );

    await client.query(
      "UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2",
      [items[i].quantity, items[i].productId]
    );
  }

  await client.query("COMMIT");
  client.release();
  return res.status(201).json({ success: true, orderNo: orderNo });
}


async function getAllOrders(req, res) {
  let result = await pool.query(
    "SELECT o.*, c.name AS customer_name FROM orders o LEFT JOIN customers c ON o.customer_id = c.id ORDER BY o.id DESC"
  );
  return res.json({ success: true, data: result.rows });
}


async function getOrderById(req, res) {
  let id = req.params.id;

  let oRes = await pool.query(
    "SELECT o.*, c.name AS customer_name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = $1",
    [id]
  );

  if (oRes.rows.length === 0) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  let iRes = await pool.query(
    "SELECT oi.*, p.name AS product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1",
    [id]
  );

  return res.json({ success: true, data: { ...oRes.rows[0], items: iRes.rows } });
}


async function updateOrderStatus(req, res) {
  let id = req.params.id;
  let status = req.body.status;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status required" });
  }

  let client = await pool.connect();
  await client.query("BEGIN");

  if (status === "Cancelled") {
    let items = await client.query(
      "SELECT product_id, quantity FROM order_items WHERE order_id = $1", [id]
    );
    for (let i = 0; i < items.rows.length; i++) {
      await client.query(
        "UPDATE products SET stock_qty = stock_qty + $1 WHERE id = $2",
        [items.rows[i].quantity, items.rows[i].product_id]
      );
    }
  }

  await client.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
  await client.query("COMMIT");
  client.release();

  return res.json({ success: true, message: "Status updated" });
}


module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
