import React, { useState } from "react";
import Transition from "../../utils/Transition";

function Tooltip({
  children,
  className,
  bg,
  size,
  position,
  img,
  transition_classname,
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const positionOuterClasses = (position) => {
    switch (position) {
      case "right":
        return "left-full top-1/2 -translate-y-1/2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2";
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2";
      case "right-top":
        return "left-full top-1/2 -translate-y-44";
      case "right-top-low":
        return "left-full top-1/2 -translate-y-32";
      default:
        return "bottom-full left-1/2 -translate-x-1/2";
    }
  };

  const sizeClasses = (size) => {
    switch (size) {
      case "lg":
        return "min-w-72  p-3";
      case "md":
        return "min-w-56 p-3";
      case "sm":
        return "min-w-44 p-2";
      default:
        return "p-2";
    }
  };

  const positionInnerClasses = (position) => {
    switch (position) {
      case "right":
        return "ml-2";
      case "left":
        return "mr-2";
      case "top":
        return "mb-2";
      default:
        return "mb-2";
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
      onBlur={() => setTooltipOpen(false)}
    >
      <button
        className="block"
        aria-haspopup="true"
        aria-expanded={tooltipOpen}
        onClick={(e) => e.preventDefault()}
      >
        <svg className="w-4 h-4 fill-current text-slate-400" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="m8 16c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0-12c0.6 0 1 0.4 1 1s-0.4 1-1 1-1-0.4-1-1 0.4-1 1-1zm-1 3h2v5h-2z"/>
        </svg>
      </button>
      <div className={`z-10 absolute ${positionOuterClasses(position)}`}>
        <Transition
          show={tooltipOpen}
          tag="div"
          className={`rounded overflow-hidden  ${
            bg === "dark"
              ? "bg-slate-800"
              : "bg-white border border-slate-200 shadow-lg"
          } ${sizeClasses(size)} ${positionInnerClasses(position)} ${
            transition_classname ? transition_classname : ""
          }`}
          enter="transition ease-out duration-200 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        >
          {children}
        </Transition>
      </div>
    </div>
  );
}

export default Tooltip;
