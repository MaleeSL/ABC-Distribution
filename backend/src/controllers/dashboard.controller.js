// db connect krgnn file ek 
const pool = require('../config/db');

// dashboard summery ek gnnv
const getDashboardSummary = async (req, res) => {
  try {
    const productsCount = await pool.query('SELECT COUNT(*) FROM products');
    const customersCount = await pool.query('SELECT COUNT(*) FROM customers');
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
    const pendingCount = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'Pending'");
    const lowStock = await pool.query('SELECT COUNT(*) FROM products WHERE stock_qty <= reorder_level'); 
    
    const sales = await pool.query(`
      SELECT SUM(total) as total_sales 
      FROM orders 
      WHERE created_at::date = CURRENT_DATE 
      AND status != 'Cancelled'
    `); 

    res.json({
      success: true,
      data: {
        totalProducts: parseInt(productsCount.rows[0].count),
        totalCustomers: parseInt(customersCount.rows[0].count),
        totalOrders: parseInt(ordersCount.rows[0].count),
        pendingOrders: parseInt(pendingCount.rows[0].count),
        lowStockCount: parseInt(lowStock.rows[0].count),
        todaySales: sales.rows[0].total_sales || 0 
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", code: "DASHBOARD_ERROR" }); 
  }
};

// meken vena filevlt gnn export krnv
module.exports = {
  getDashboardSummary
};