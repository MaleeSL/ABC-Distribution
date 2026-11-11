const pool = require("../config/db");

async function createOrder(req, res) {
  let customer = req.body.customerId;
  let items = req.body.items;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ message: "No data" });
  }
  let client = await pool.connect();
  await client.query("BEGIN");
  let total = 0;



  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let pRes = await client.query("SELECT * FROM products WHERE id = $1", [
      item.productId,
    ]);
    let product = pRes.rows[0];

    if (product.stock_qty < item.quantity) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(409).json({ message: "Stock not enough" });
    }

    let itemTotal = product.unit_price * item.quantity;
    total = total + itemTotal;
  }


  let orderNo = "ORD-" + Math.floor(1000 + Math.random() * 9000);
  let oRes = await client.query(
    "INSERT INTO orders (order_no, customer_id, total) VALUES ($1, $2, $3) RETURNING id",
    [orderNo, customer, total],
  );
  let orderId = oRes.rows[0].id;


  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let pRes = await client.query(
      "SELECT unit_price FROM products WHERE id = $1",
      [item.productId],
    );
    let price = pRes.rows[0].unit_price;
    let lineTotal = price * item.quantity;

    await client.query(
      "INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES ($1, $2, $3, $4, $5)",
      [orderId, item.productId, item.quantity, price, lineTotal],
    );

    await client.query(
      "UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2",
      [item.quantity, item.productId],
    );
  }
  await client.query("COMMIT");
  client.release();

  return res
    .status(201)
    .json({ success: true, orderId: orderId, orderNo: orderNo });
}

module.exports = { createOrder };
