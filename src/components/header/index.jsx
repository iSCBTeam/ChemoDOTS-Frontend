import React from "react";
import { useNavigate } from "react-router-dom";
import chemodotsImg from "../../assets/img/chemodots.png";
import wipImg from "../../assets/img/wip.png";

function Header() {
  const navigate = useNavigate();

  const wip = false;

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="truncate px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <h1 className="text-xl md:text-2xl text-slate-800 font-bold">
            {wip && (<img className="h-14 inline" src={wipImg} />)}
            <a className="mx-4" href="/" target="_blank" rel="noopener noreferrer"><img className="h-14 inline cursor-pointer" src={chemodotsImg}></img></a>
            <a className="mx-4 text-[#4472c4] hover:underline inline cursor-pointer" href="/tutorial.html" target="_blank" rel="noopener noreferrer">Step-by-step Tutorial</a>
            <a className="mx-4 text-[#4472c4] hover:underline inline cursor-pointer" href="/growing?tab=1" target="_blank" rel="noopener noreferrer">Start a new Project</a>
          </h1>
        </div>
        <div className="h-6 text-base">
          The web server facility is <span className="font-semibold">freely</span> accessible to <span className="font-semibold">all users</span>, including commercial users.
        </div>
      </div>
    </header>
  );
}

export default Header;
