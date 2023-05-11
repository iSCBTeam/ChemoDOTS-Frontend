import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../../container/app";
import {
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
  strictValidStringWithLength,
} from "../../utils/commonUtils";

const Progressbar = ({ editorID = "firstInstance" }) => {
  const [progressBar, setProgressBar] = useState(0);
  const state = useContext(stateContext)[editorID];
  const {
    growing_smiles,
    selected_Functions,
    selected_function_rules,
    selected_undesired_substructure,
  } = state;

  const getProgressBar = () => {
    let progress = 0;
    if (strictValidStringWithLength(growing_smiles)) {
      progress += 1;
    }
    if (strictValidObjectWIthKey(selected_Functions)) {
      progress += 1;
    }
    if (strictValidArrayWithLength(selected_function_rules)) {
      progress += 1;
    }
    if (strictValidArrayWithLength(selected_undesired_substructure)) {
      progress += 1;
    }

    const bar = (progress / 4) * 100;
    setProgressBar(bar);
  };

  useEffect(() => {
    getProgressBar();
  }, [
    growing_smiles,
    selected_Functions,
    selected_function_rules,
    selected_undesired_substructure,
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
