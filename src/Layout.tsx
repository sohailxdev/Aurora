import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/shared/jewellary/Footer";
import Navbar from "./components/shared/jewellary/Navbar";

const Layout = ({ children }: any) => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <main className="w-full bg-[#191f2a]">
      <Navbar />
      {isHomePage ? children : <Outlet />}
      <Footer />
    </main>
  );
};

export default Layout;
