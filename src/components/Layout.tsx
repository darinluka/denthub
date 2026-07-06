'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingOrAuthPage = pathname === '/' || pathname === '/login';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    checkMobile();
  }, [pathname]);

  if (isLandingOrAuthPage) {
    return <main className={styles.mainContentFull}>{children}</main>;
  }

  return (
    <div className={styles.layout}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {!isSidebarCollapsed && (
        <div className={styles.sidebarOverlay} onClick={() => setIsSidebarCollapsed(true)} />
      )}
      <div className={`${styles.mainWrapper} ${isSidebarCollapsed ? styles.mainWrapperCollapsed : ''}`}>
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
