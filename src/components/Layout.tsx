import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
