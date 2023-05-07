import React, { useContext, useEffect, useState } from "react";
import Drawing from "./drawing";
import Details from "./detail";
import { useSearchParams, useLocation } from "react-router-dom";
import { stateContext, dispatchContext } from "../app";
import NavLink from "./navlink";
import ReactionRules from "./reactionRules";
import Api from "../../utils/api";
import { ConvertRestultFunction } from "../../utils/helper";
import SubStructure from "./subStructures";
import Button from "../../components/button";
import FinalResult from "./FinalResult";
import useEditor from "../../components/customHooks/useEditor";
import {
  showError,
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
  strictValidStringWithLength,
} from "../../utils/commonUtils";
import Summary from "./summary";
import Progressbar from "../../components/progressbar";

const Instance = ({ editorID, tabID }) => {
  const [isLoading, setLoading] = useState(false);
  const state = useContext(stateContext)[editorID];
  const location = useLocation();
  const isOnGrowing = location && location.pathname === "/growing";

  const dispatch = useContext(dispatchContext);
  const { editorInstance, createImageExport } = useEditor(editorID);
  const {
    growing_smiles,
    selected_Functions,
    grouped_reaction_rules,
    selected_function_rules,
    required_substructure,
    structureImage,
  } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const active_tab = searchParams.get(tabID);

  const goToTab = (val) => {
    searchParams.set(tabID, val);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!strictValidStringWithLength(growing_smiles)) {
      goToTab(1);
    }
  }, []);

  const onClickFirst = async () => {
    if (!strictValidStringWithLength(growing_smiles)) {
      const message = "Please enter Smiles.";
      showError(dispatch, message);
      return;
    }
    const data = {
      smiles: growing_smiles,
    };
    setLoading(true);
    try {
      if (growing_smiles && structureImage.smiles_code !== growing_smiles) {
        await createImageExport();
      }

      const res = await Api.post("/Callscript_Func", data);
      console.log("res bibek", res);
      if (strictValidArrayWithLength(res.data.data)) {
        const value = ConvertRestultFunction(res.data.data, growing_smiles);
        console.log("value bibek", res);
        dispatch({
          type: "save_detected_function",
          instance: editorID,
          data: value,
        });
        goToTab(2);
      } else {
        console.log("Could not find any function bibek", res);
        const message = "Could not find any function.";
        showError(dispatch, message);
      }
    } catch (error) {
      console.log("error bibek", error);
      showError(dispatch, error);
    }
    setLoading(false);
  };

  const onClickSecond = async () => {
    let message = "";
    if (!strictValidObjectWIthKey(selected_Functions)) {
      message = "Please select one function.";
    } else if (!strictValidArrayWithLength(grouped_reaction_rules)) {
      message = "Please generate reaction rules.";
    } else if (!strictValidArrayWithLength(selected_function_rules)) {
      message = "Please select reaction rule.";
    }
    if (message) {
      showError(dispatch, message);
      return;
    }
    setLoading(true);
    await GenerateSub();
    goToTab(3);
    setLoading(false);
  };

  const onClickThird = async () => {
    let message = "";
    if (!strictValidStringWithLength(required_substructure)) {
      message = "Please fill Required Substructure.";
    }
    if (message) {
      showError(dispatch, message);
      return;
    }
    setLoading(true);
    goToTab(4);
    setLoading(false);
  };

  const onClickNext = () => {
    switch (active_tab) {
      case "1":
        onClickFirst();
        break;
      case "2":
        onClickSecond();
        break;
      case "3":
        onClickThird();
        break;
      case "4":
        goToTab(5);
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

  const GenerateSub = async () => {
    let send_data = {
      smiles: growing_smiles,
      funcname: selected_Functions.Name_Func,
    };
    try {
      const res = await Api.post("/Callscript_Sub", send_data);
      dispatch({
        type: "substructure_data",
        instance: editorID,
        data: res.data.data,
      });
      const { data: { data } = {} } = res;
      const val = strictValidArrayWithLength(data) ? data[0] : "";
      dispatch({
        type: "required_substructure",
        instance: editorID,
        data: val,
      });
    } catch (error) {
      showError(dispatch, error.message);
    }
  };
  return (
    <div
      className={`flex  flex-col  shadow-lg ${
        isOnGrowing ? "h-full" : "h-3/6"
      } `}
    >
      <Progressbar editorID={editorID} />
      <div className="px-4 sm:px-6 lg:px-8 py-8 grow flex flex-col">
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <NavLink editorID={editorID} tabID={tabID} />
        <div
          className={`flex flex-row mb-10 w-full grow ${
            active_tab == 4 || active_tab == 5 ? "flex-col " : ""
          } `}
        >
          {[1, 2].some((v) => v == active_tab) && (
            <div className="w-1/2">
              <Drawing editorID={editorID} tabID={tabID} />
            </div>
          )}
          {[1, 2, 3].some((v) => v == active_tab) && (
            <div
              className={`w-1/2 pl-4 ${
                [3, 4, 5].some((v) => v == active_tab) ? "w-full" : ""
              } overflow-y-auto h-[calc(100vh-18rem)]`}
            >
              {active_tab == 1 && <Details editorID={editorID} tabID={tabID} />}
              {active_tab == 2 && (
                <ReactionRules editorID={editorID} tabID={tabID} />
              )}
              {active_tab == 3 && (
                <SubStructure editorID={editorID} tabID={tabID} />
              )}
            </div>
          )}
          {active_tab == 4 && <Summary editorID={editorID} tabID={tabID} />}
          {active_tab == 5 && <FinalResult editorID={editorID} tabID={tabID} />}
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
                  disabled={
                    active_tab == 5 || (active_tab == 5 && !editorInstance)
                  }
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

export default Instance;
