const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { createOrder } = require("../controllers/order.controller");

router.post("/", createOrder);

router.get("/", async (req, res) => {
  let result = await pool.query(
    "SELECT o.*, c.name AS customer_name FROM orders o LEFT JOIN customers c ON o.customer_id = c.id ORDER BY o.id DESC",
  );
  return res.json({ success: true, data: result.rows });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;

  let oRes = await pool.query(
    "SELECT o.*, c.name AS customer_name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = $1",
    [id],
  );
  if (oRes.rows.length === 0) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  let iRes = await pool.query(
    "SELECT oi.*, p.name AS product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1",
    [id],
  );

  return res.json({
    success: true,
    data: {
      ...oRes.rows[0],
      items: iRes.rows,
    },
  });
});

router.patch("/:id/status", async (req, res) => {
  let id = req.params.id;
  let status = req.body.status;

  let client = await pool.connect();
  await client.query("BEGIN");

  if (status === "Cancelled") {
    let items = await client.query(
      "SELECT product_id, quantity FROM order_items WHERE order_id = $1",
      [id],
    );
    for (let i = 0; i < items.rows.length; i++) {
      let row = items.rows[i];
      await client.query(
        "UPDATE products SET stock_qty = stock_qty + $1 WHERE id = $2",
        [row.quantity, row.product_id],
      );
    }
  }

  await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
    status,
    id,
  ]);
  await client.query("COMMIT");
  client.release();

  return res.json({ success: true, message: "Done" });
});

module.exports = router;
