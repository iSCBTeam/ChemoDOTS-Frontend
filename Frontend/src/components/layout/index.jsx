import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../header";

const Layout = () => {
  const location = useLocation();
  const isOnGrowing = location && location.pathname === "/growing";
  return (
    <div className="relative flex flex-col">
      <Header />
      <main
        className={`flex flex-col  ${
          isOnGrowing ? "h-[calc(100vh_-_4rem)]" : "h-[calc(200vh_-_4rem)]"
        } overflow-hidden`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
