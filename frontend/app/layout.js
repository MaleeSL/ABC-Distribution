import './globals.css';
import Navbar from '@/Components/Navbar';

export const metadata = {
  title: 'ABC Wholesale Management System',
  description: 'Wholesale Order & Inventory Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50/50 text-black min-h-screen">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
