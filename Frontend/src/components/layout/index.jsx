import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header";

const Layout = () => {
  return (
    <div className="relative flex flex-col">
      <Header />
      <main className={`flex flex-col  h-[calc(100vh_-_4rem)] overflow-hidden`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
