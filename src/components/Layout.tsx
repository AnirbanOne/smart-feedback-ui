import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css'; // Import the CSS.

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="layout-main">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
