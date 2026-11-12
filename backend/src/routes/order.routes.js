const express = require("express");
const router = express.Router();
const {createOrder,getAllOrders,getOrderById,updateOrderStatus,} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
