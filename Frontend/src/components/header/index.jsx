import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <h1
            className="text-2xl md:text-3xl text-slate-800 font-bold"
            onClick={() => navigate("/")}
          >
            ChemoDOTS
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
