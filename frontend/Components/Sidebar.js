'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
  { href: '/products', label: 'Products', icon: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.3 7 12 12l8.7-5 M12 22V12' },
  { href: '/inventory', label: 'Inventory', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
  { href: '/orders', label: 'Orders', icon: 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5' },
  { href: '/customers', label: 'Customers', icon: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className={styles.mobileHeader}>
        <Link href="/dashboard" className={styles.mobileBrand} onClick={() => setIsOpen(false)}>
          <span className={styles.mobileLogo}>A</span>
          <span className={styles.mobileTitle}>ABC Wholesale</span>
        </Link>
        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={styles.menuButton}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className={styles.overlay}
        />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <Link href="/dashboard" className={styles.brand} onClick={() => setIsOpen(false)}>
          <span className={styles.logo}>A</span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>ABC Wholesale</span>
            <span className={styles.brandDescription}>Distribution system</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className={styles.navigation}>
          <p className={styles.sectionTitle}>Workspace</p>
          {navigation.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={icon} />
                </svg>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          Inventory &amp; order management
        </div>
      </aside>
    </>
  );
}
