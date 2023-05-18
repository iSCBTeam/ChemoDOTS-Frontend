import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { stateContext, dispatchContext } from "../../app";
import {
  strictValidStringWithLength,
  strictValidObjectWIthKey,
  strictValidArrayWithLength,
  showError,
} from "../../../utils/commonUtils";

const TabLink = () => {
  const state = useContext(stateContext).secondInstance;
  const {
    growing_smiles,
    Detected_Functions,
    selected_Functions,
    grouped_reaction_rules,
    selected_function_rules,
  } = state;
  const state1 = useContext(stateContext).thirdInstance;
  const {
    Detected_Functions: Detected_Functions1,
    grouped_reaction_rules: grouped_reaction_rules1,
    growing_smiles: growing_smiles1,
    selected_Functions: selected_Functions1,
    selected_function_rules: selected_function_rules1,
  } = state1;
  const dispatch = useContext(dispatchContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const active_tab = searchParams.get("tab");

  const checkValidation = (tab) => {
    let isValid = true;
    let message = "Something went Wrong!";
    if (parseInt(active_tab) >= parseInt(tab)) {
      return isValid;
    }
    switch (active_tab) {
      case "1":
        if (!strictValidStringWithLength(growing_smiles)) {
          isValid = false;
          message = "Please enter Smiles.";
        } else if (!strictValidArrayWithLength(Detected_Functions)) {
          isValid = false;
          message = "Could not find any function.";
        }
        break;
      case "2":
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
      case "3":
        if (!strictValidStringWithLength(growing_smiles1)) {
          isValid = false;
          message = "Please enter Smiles.";
        } else if (!strictValidArrayWithLength(Detected_Functions1)) {
          isValid = false;
          message = "Could not find any function.";
        }
        break;
      case "4":
        if (!strictValidObjectWIthKey(selected_Functions1)) {
          isValid = false;
          message = "Please select one function.";
        } else if (!strictValidArrayWithLength(grouped_reaction_rules1)) {
          isValid = false;
          message = "Please generate reaction rules.";
        } else if (!strictValidArrayWithLength(selected_function_rules1)) {
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
    searchParams.set("tab", val);
    setSearchParams(searchParams);
  };

  const goToPosts = (tab) => {
    const isValid = checkValidation(tab);

    if (isValid) {
      goToTab(tab);
    }
  };

  const tabs = [
    { title: "Structure 1", id: 1 },
    { title: "Reaction Rules 1", id: 2 },
    { title: "Structure 2", id: 3 },
    { title: "Reaction Rules 2", id: 4 },
    { title: "Sub-Structures", id: 5 },
    { title: "Summary", id: 6 },
    { title: "Final Result", id: 7 },
  ];

  return (
    <div className="relative mb-8 print:hidden">
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
