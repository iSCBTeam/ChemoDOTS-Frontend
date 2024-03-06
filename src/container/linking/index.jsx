import React, { useContext, useEffect, useState } from "react";
import Drawing from "../instance/drawing";
import Details from "../instance/detail";
import { useSearchParams } from "react-router-dom";
import { stateContext, dispatchContext } from "../app";
import NavLink from "./navlink";
import ReactionRules from "../instance/reactionRules";
import Api from "../../utils/api";
import { ConvertResultFunction } from "../../utils/helper";
import SubStructure from "../instance/subStructures";
import Button from "../../components/button";
import FinalResult from "./FinalResult";
import useEditor from "../../components/customHooks/useEditor";
import {
  showError,
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
  strictValidStringWithLength,
  validFunction,
} from "../../utils/commonUtils";
import Summary from "./summary";

const Linking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active_tab = searchParams.get("tab");
  const [isLoading, setLoading] = useState(false);
  const state = useContext(stateContext).secondInstance;

  const dispatch = useContext(dispatchContext);
  const {
    growing_smiles,
    selected_Functions,
    grouped_reaction_rules,
    selected_function_rules,
  } = state;
  const state1 = useContext(stateContext).thirdInstance;
  const {
    growing_smiles: growing_smiles1,
    selected_Functions: selected_Functions1,
    grouped_reaction_rules: grouped_reaction_rules1,
    selected_function_rules: selected_function_rules1,
  } = state1;

  const goToTab = (val) => {
    searchParams.set("tab", val);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!strictValidStringWithLength(growing_smiles)) {
      goToTab(1);
    }
  }, []);

  const onClickFirst = async (inst) => {
    const smile = inst === "secondInstance" ? growing_smiles : growing_smiles1;
    if (!strictValidStringWithLength(smile)) {
      const message = "Please enter Smiles.";
      showError(dispatch, message);
      return;
    }
    const data = {
      smiles: smile,
    };
    setLoading(true);
    try {
      const res = await Api.post("/Callscript_Func", data);
      if (strictValidArrayWithLength(res.data.data)) {
        const value = ConvertResultFunction(res.data.data, smile);
        dispatch({
          type: "save_detected_function",
          instance: inst,
          data: value,
        });
        goNextTab();
      } else {
        const message = "Could not find any function.";
        showError(dispatch, message);
      }
    } catch (error) {
      showError(dispatch, error);
    }
    setLoading(false);
  };

  const onClickSecond = async (inst) => {
    const selected_Function =
      inst === "secondInstance" ? selected_Functions : selected_Functions1;
    const grouped_reaction_rule =
      inst === "secondInstance"
        ? grouped_reaction_rules
        : grouped_reaction_rules1;
    const selected_function_rule =
      inst === "secondInstance"
        ? selected_function_rules
        : selected_function_rules1;
    let message = "";
    if (!strictValidObjectWIthKey(selected_Function)) {
      message = "Please select one function.";
    } else if (!strictValidArrayWithLength(grouped_reaction_rule)) {
      message = "Please generate reaction rules.";
    } else if (!strictValidArrayWithLength(selected_function_rule)) {
      message = "Please select reaction rule.";
    }
    if (message) {
      showError(dispatch, message);
      return;
    }
    setLoading(true);
    goNextTab();
    setLoading(false);
  };

  const onClickFifth = async () => {
    goNextTab();
  };

  const onClickNext = () => {
    switch (active_tab) {
      case "1":
        onClickFirst("secondInstance");
        break;
      case "2":
        onClickSecond("secondInstance");
        break;
      case "3":
        onClickFirst("thirdInstance");
        break;
      case "4":
        onClickSecond("thirdInstance");
        break;
      case "5":
        onClickFifth();
        break;
      case "6":
        goToTab(7);
        break;

      default:
        break;
    }
  };

  const onClickPrevious = () => {
    let calTab = parseInt(active_tab) - 1;
    if (calTab < 1) {
      calTab = 1;
    }
    goToTab(calTab);
  };
  const goNextTab = () => {
    let calTab = parseInt(active_tab) + 1;
    if (calTab < 1) {
      calTab = 1;
    }
    goToTab(calTab);
  };

  return (
    <div className="flex  flex-col  shadow-lg h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 grow flex flex-col">
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <NavLink />
        <div
          className={`flex flex-row mb-10 w-full grow ${
            active_tab == 6 || active_tab == 7 ? "flex-col " : ""
          } `}
        >
          {[1, 2].some((v) => v == active_tab) && (
            <div className="w-1/2">
              <Drawing editorID="secondInstance" />
            </div>
          )}
          {[3, 4].some((v) => v == active_tab) && (
            <div className="w-1/2">
              <Drawing editorID="thirdInstance" />
            </div>
          )}
          {[1, 2, 3, 4, 5].some((v) => v == active_tab) && (
            <div
              className={`w-1/2 pl-4 ${
                [5, 6, 7].some((v) => v == active_tab) ? "w-full" : ""
              } overflow-y-auto h-[calc(100vh-18rem)]`}
            >
              {[1, 3].some((v) => v == active_tab) && (
                <Details
                  editorID={
                    active_tab == 1 ? "secondInstance" : "thirdInstance"
                  }
                  tabID="tab"
                />
              )}
              {[2, 4].some((v) => v == active_tab) && (
                <ReactionRules
                  editorID={
                    active_tab == 2 ? "secondInstance" : "thirdInstance"
                  }
                  tabID="tab"
                />
              )}
              {active_tab == 5 && <SubStructure editorID="secondInstance" />}
            </div>
          )}
          {active_tab == 6 && <Summary />}
          {active_tab == 7 && <FinalResult />}
        </div>
        <div className={`w-full bg-slate-100 flex flex-col print:hidden`}>
          <nav className="my-4" role="navigation" aria-label="Navigation">
            <ul className="flex justify-center">
              <li className="ml-3 first:ml-0">
                <Button disabled={active_tab == 1} onClick={onClickPrevious}>
                  &lt;- Previous
                </Button>
              </li>
              <li className="ml-3 first:ml-0">
                <Button
                  onClick={onClickNext}
                  isLoading={isLoading}
                  disabled={active_tab == 7}
                >
                  Next -&gt;
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Linking;
