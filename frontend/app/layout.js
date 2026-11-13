import './globals.css';
import Sidebar from '@/Components/Sidebar';

export const metadata = {
  title: 'ABC Wholesale Management System',
  description: 'Wholesale Order & Inventory Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="min-h-screen md:flex">
          <Sidebar />
          <main className="app-workspace min-w-0 flex-1 max-w-7xl w-full mx-auto p-6 pt-20 md:pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
