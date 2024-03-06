import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { stateContext } from "../../container/app";
import {
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
  strictValidStringWithLength,
} from "../../utils/commonUtils";

const Progressbar = ({ editorID, tabID }) => {
  const [progressBar, setProgressBar] = useState(0);
  const state = useContext(stateContext)[editorID];
  const {
    selected_Functions,
    selected_function_rules,
    selected_undesired_substructure,
  } = state;
  const [searchParams] = useSearchParams();
  const active_tab = searchParams.get(tabID) | 0;

  const updateProgressBar = (tab) => {
    let progress = 0;

    switch (tab) {
      case 1:
        progress = 0;
        break;

      case 2:
        progress = 1;

        if (strictValidObjectWIthKey(selected_Functions))
          progress = 2;
        if (strictValidArrayWithLength(selected_function_rules))
          progress = 3;
        break;

      case 3:
        progress = 4;
        break;

      case 4:
        progress = 5;
        break;

      case 5:
        progress = 6;
        break;

      case 6:
        progress = 7;
        break;

      case 7:
      default:
        progress = 8;
        break;
    }

    const bar = ((progress / 8) * 100) | 0;
    setProgressBar(bar);
  };

  useEffect(() => {
    updateProgressBar(active_tab);
  }, [
    active_tab,
    selected_Functions,
    selected_function_rules,
  ]);

  return (
    <div
      className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full h-3.5 print:hidden"
      style={{ width: `${progressBar}%` }}
    >
      {progressBar}%
    </div>
  );
};

export default Progressbar;
