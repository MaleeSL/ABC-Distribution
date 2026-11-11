import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-black text-white border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/orders" className="flex items-center gap-3 hover:opacity-80 transition">
          <span className="font-mono text-xs border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">
            ABC
          </span>
          <span className="font-bold text-sm tracking-widest uppercase">
            Wholesale Management
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
          <Link href="/products" className="text-zinc-400 hover:text-white transition">Products</Link>
          <Link href="/inventory" className="text-zinc-400 hover:text-white transition">Inventory</Link>
          <Link href="/orders" className="bg-white text-black px-3 py-1 rounded font-bold shadow-xs">Orders</Link>
          <Link href="/customers" className="text-zinc-400 hover:text-white transition">Customers</Link>
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
