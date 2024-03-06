import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { stateContext, dispatchContext } from "../../app";
import {
  strictValidStringWithLength,
  strictValidObjectWIthKey,
  strictValidArrayWithLength,
  showError,
} from "../../../utils/commonUtils";

const TabLink = ({ editorID, tabID }) => {
  const state = useContext(stateContext)[editorID];
  const {
    growing_smiles,
    Detected_Functions,
    selected_Functions,
    reaction_rules,
    grouped_reaction_rules,
    selected_function_rules,
  } = state;
  const dispatch = useContext(dispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const active_tab = searchParams.get(tabID) | 0;

  const checkValidation = (tab) => {
    tab = tab | 0;
    let isValid = true;
    let message = "Something went Wrong!";

    // Before the library is generated, we cannot go to the end
    if (active_tab <= 3 && tab > 3)
      return false;

    // Once the library is generated, we cannot go back to the beginning
    if (active_tab >= 4 && tab < 4)
      return false;

    // Allow to go backward
    if (active_tab >= tab)
      return true;

    // We cannot reach the last steps directly
    if (tab >= 6)
      return false;

    switch (active_tab) {
      case 1:
        if (!strictValidStringWithLength(growing_smiles)) {
          isValid = false;
          message = "Please draw or import a molecule.";
        } else if (!strictValidArrayWithLength(Detected_Functions)) {
          isValid = false;
          message = "Could not find any function.";
        }
        break;
      case 2:
        if (!strictValidObjectWIthKey(selected_Functions)) {
          isValid = false;
          message = "Please select one function.";
        } else if (!strictValidArrayWithLength(grouped_reaction_rules)) {
          isValid = false;
          message = "Please generate reaction rules.";
        } else if (!strictValidArrayWithLength(selected_function_rules)) {
          isValid = false;
          message = "Please choose at least one reaction rule.";
        }
        break;

      default:
        break;
    }
    if (!isValid) {
      showError(dispatch, message);
    }

    return isValid;
  };

  const goToTab = (val) => {
    searchParams.set(tabID, val);
    setSearchParams(searchParams);
  };

  const goToPosts = (tab) => {
    const isValid = checkValidation(tab);

    if (isValid) {
      goToTab(tab);
    }
  };

  const tabs = [
    { id: 1, title: "Structure" },
    { id: 2, title: "Reaction rules" },
    { id: 3, title: "Summary" },
    { id: 4, title: "Raw library" },
    { id: 5, title: "Post processing" },
    { id: 6, title: "Download 2D" },
    { id: 7, title: "Download 3D" },
  ];

  return (
    <div className="relative print:hidden">
      <div
        className="absolute bottom-0 w-full h-px bg-slate-200"
        aria-hidden="true"
      ></div>
      <ul className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8  no-scrollbar">
        {tabs.map(({ title, id }) => {
          return (
            <li
              key={id}
              className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
            >
              <div
                className={`block pb-3  whitespace-nowrap  ${
                  active_tab == id
                    ? "text-indigo-500 border-b-2 border-indigo-500 cursor-default"
                    : "text-slate-500 cursor-pointer"
                }`}
                onClick={() => goToPosts(id)}
              >
                {title}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TabLink;
