"use client"; 

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/summary')
      .then(response => response.json())
      .then(result => {
        if (result.success === true) {
          setDashboardData(result.data);
        } else {
          setErrorMessage("Data ganna bari una");
        }
        setIsLoading(false);
      })
      .catch(error => {
        setErrorMessage("Network awlak");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Data load wenawa...</div>;
  if (errorMessage) return <div>Error: {errorMessage}</div>; 

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Eka</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid gray', padding: '15px' }}>
          <h3>Total Orders</h3>
          <p>{dashboardData.totalOrders}</p>
        </div>
        
        <div style={{ border: '1px solid gray', padding: '15px' }}>
          <h3>Today's Sales</h3>
          <p>Rs. {dashboardData.todaySales}</p>
        </div>
        
        <div style={{ border: '1px solid red', padding: '15px' }}>
          <h3 style={{ color: 'red' }}>Low Stock</h3>
          <p style={{ color: 'red', fontWeight: 'bold' }}>{dashboardData.lowStockCount}</p> {/*[cite: 7] */}
        </div>
      </div>
    </div>
  );
}