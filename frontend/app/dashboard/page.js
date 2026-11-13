"use client"; 

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    dashboardService.getSummary()
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
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h1>Dashboard</h1>
        <p>Overview of your wholesale business</p>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card rounded-lg border bg-white">
          <h2 className="dashboard-card-label">Total Orders</h2>
          <p className="dashboard-card-value">{dashboardData.totalOrders}</p>
        </article>

        <article className="dashboard-card rounded-lg border bg-white">
          <h2 className="dashboard-card-label">Today&apos;s Sales</h2>
          <p className="dashboard-card-value">
            LKR {Number(dashboardData.todaySales).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </article>

        <article className="dashboard-card dashboard-card-warning rounded-lg border bg-white">
          <h2 className="dashboard-card-label">Low Stock Items</h2>
          <p className="dashboard-card-value">{dashboardData.lowStockCount}</p>
        </article>
      </div>
    </section>
  );
}