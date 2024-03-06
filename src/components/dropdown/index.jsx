import React, { useState, useRef, useEffect } from "react";
import Transition from "../../utils/Transition";

function DropdownFull({ options, default_index, onChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState({});

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const change = sel => {
    setSelected(sel);

    if (onChange)
      onChange(sel);
  };

  useEffect(() => {
    // Set default

    if ((default_index ?? null) !== null &&
        default_index < options.length)
      change(options[default_index]);

    // Close on click outside

    const clickHandler = ({ target }) => {
      if (!dropdown.current ||
          !dropdownOpen ||
          dropdown.current.contains(target) ||
          trigger.current.contains(target))
        return;

      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);

    // Close if the esc key is pressed

    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, []);

  return (
    <div className="relative inline-flex w-full">
      <button
        ref={trigger}
        className="btn w-full justify-between min-w-44 bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        aria-label="Select date range"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="flex items-center">
          <span>{selected.label}</span>
        </span>
        <svg
          className="shrink-0 ml-1 fill-current text-slate-400"
          width="11"
          height="7"
          viewBox="0 0 11 7"
        >
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="z-10 absolute top-full left-0 w-full bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden my-1"
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        onEntered={() => {
          if (dropdown.current)
            dropdown.current.scrollIntoView()
        }}
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-slate-600 divide-y divide-slate-200"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {options.map((option) => {
            return (
              <button
                key={option.value}
                tabIndex="0"
                className={`flex items-center justify-between w-full hover:bg-slate-50 py-2 px-3 cursor-pointer ${
                  option.value === selected.value && "text-indigo-500"
                }`}
                onClick={() => {
                  change(option);
                  setDropdownOpen(false);
                }}
              >
                <span>{option.label}</span>
                <svg
                  className={`shrink-0 mr-2 fill-current text-indigo-500 ${
                    option.value !== selected.value && "invisible"
                  }`}
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                >
                  <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                </svg>
              </button>
            );
          })}
        </div>
      </Transition>
    </div>
  );
}

export default DropdownFull;
