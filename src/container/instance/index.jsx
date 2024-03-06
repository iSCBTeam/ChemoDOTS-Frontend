import React, { useContext, useEffect, useState } from "react";
import Drawing from "./drawing";
import Details from "./detail";
import { useSearchParams } from "react-router-dom";
import { stateContext, dispatchContext } from "../app";
import NavLink from "./navlink";
import ReactionRules from "./reactionRules";
import Api from "../../utils/api";
import { ConvertResultFunction } from "../../utils/helper";
import Button from "../../components/button";
import FinalResult from "./FinalResult";
import PostProcessing from "./PostProcessing";
import Download from "./Download";
import Download3D from "./Download3D";
import useEditor from "../../components/customHooks/useEditor";
import {
  showError,
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
  strictValidStringWithLength,
} from "../../utils/commonUtils";
import Summary from "./summary";
import Progressbar from "../../components/progressbar";

const Instance = ({ editorID, tabID, experimentID }) => {
  const [isLoading, setLoading] = useState(false);
  const state = useContext(stateContext)[editorID];

  const dispatch = useContext(dispatchContext);
  const {
    growing_smiles,
    growing_mol,
    selected_Functions,
    grouped_reaction_rules,
    selected_function_rules,
    building_block_databases,
    filters,
  } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const active_tab = searchParams.get(tabID) | 0;
  const exp_id = searchParams.get(experimentID);

  const goToTab = (val) => {
    searchParams.set(tabID, val);
    setSearchParams(searchParams);
  };
  const defineExperimentID = (val) => {
    searchParams.set(experimentID, val);
  };

  useEffect(() => {
    if (active_tab >= 4 && (exp_id ?? null) !== null)
      return;

    if (!strictValidStringWithLength(growing_smiles)) {
      goToTab(1);
    }
  }, []);

  const onClickFirst = async () => {
    if (!strictValidStringWithLength(growing_smiles)) {
      const message = "Please draw or import a molecule.";
      showError(dispatch, message);
      return;
    }
    const data = {
      mol: growing_mol,
      smiles: growing_smiles,
    };
    setLoading(true);
    try {
      const res = await Api.post("/Callscript_Func", data);
      if (strictValidArrayWithLength(res.data.data)) {
        const value = ConvertResultFunction(res.data.data, growing_smiles);
        dispatch({
          type: "save_detected_function",
          instance: editorID,
          data: value,
        });
        goToTab(2);
      } else {
        const message = "Could not find any function.";
        showError(dispatch, message);
      }
    } catch (error) {
      showError(dispatch, error);
    }
    setLoading(false);
  };

  const onClickSecond = async () => {
    let message = "";
    if (!strictValidObjectWIthKey(selected_Functions)) {
      message = "Please select one function.";
    } else if (!strictValidArrayWithLength(grouped_reaction_rules)) {
      message = "No reaction rules are available.";
    } else if (!strictValidArrayWithLength(selected_function_rules)) {
      message = "Please select at least one reaction rule.";
    }
    if (message) {
      showError(dispatch, message);
      return;
    }
    setLoading(true);
    goToTab(3);
    setLoading(false);
  };

  const onClickThird = async () => {
    setLoading(true);
    const data = {
      name: 'Fragment',
      smiles: growing_smiles,
      mol: growing_mol,
      atoms: selected_Functions.Position.split(',').map(x => (x | 0) - 1),
      rules: selected_function_rules.map(e => e.Id | 0),
      bb_dbs: building_block_databases,
    };
    const res = await Api.post("/Callscript_Growing", data);
    const uuid = res.data.data.uuid;
    setLoading(false);
    defineExperimentID(uuid);
    goToTab(4);
  };

  const onClickFourth = async () => {
    goToTab(5);
  };

  const onClickFifth = async () => {
    setLoading(true);
    const data = {
      uuid: exp_id,
      filters: filters,
    };
    const res = await Api.post("/Callscript_pp_gen2d", data);
    setLoading(false);
    goToTab(6);
  };

  const onClickSixth = async () => {
    setLoading(true);
    const data = {
      uuid: exp_id,
    };
    const res = await Api.post("/Callscript_pp_gen3d", data);
    setLoading(false);
    goToTab(7);
  };

  const onClickNext = () => {
    switch (active_tab) {
      case 1:
        onClickFirst();
        break;
      case 2:
        onClickSecond();
        break;
      case 3:
        onClickThird();
        break;
      case 4:
        onClickFourth();
        break;
      case 5:
        onClickFifth();
        break;
      case 6:
        onClickSixth();
        break;

      default:
        break;
    }
  };

  const onClickPrevious = () => {
    let calTab = active_tab - 1;
    if (calTab < 1) {
      calTab = 1;
    }
    goToTab(calTab);
  };

  return (
    <div className="flex flex-col  shadow-lg h-full">
      <Progressbar editorID={editorID} tabID={tabID} />
      <div className="sm:px-4 px-6 lg:px-8 py-4 grow flex flex-col">
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <NavLink editorID={editorID} tabID={tabID} />
        <div
          className={`flex flex-row w-full mx-0 my-6 grow${
            active_tab == 3 || active_tab == 4 ? " flex-col" : ""
          }`}
        >
          {[1, 2].some(v => v == active_tab) && (<>
            <div className="w-full mx-0 h-[calc(100vh-17rem)]">
              <div className="bg-white shadow-lg rounded-sm border border-slate-200 h-full">
                <Drawing editorID={editorID} tabID={tabID} />
              </div>
            </div>
            <div className="w-full mx-0 pl-4 h-[calc(100vh-17rem)]">
              <div className="bg-white shadow-lg rounded-sm border border-slate-200 h-full overflow-y-auto">
                {active_tab == 1 && <Details editorID={editorID} tabID={tabID} />}
                {active_tab == 2 && <ReactionRules editorID={editorID} tabID={tabID} />}
              </div>
            </div>
          </>)}
          {active_tab == 3 && <Summary editorID={editorID} tabID={tabID} />}
          {active_tab == 4 && <FinalResult editorID={editorID} tabID={tabID} experimentID={experimentID} />}
          {active_tab == 5 && <PostProcessing editorID={editorID} tabID={tabID} experimentID={experimentID} />}
          {active_tab == 6 && <Download editorID={editorID} tabID={tabID} experimentID={experimentID} />}
          {active_tab == 7 && <Download3D editorID={editorID} tabID={tabID} experimentID={experimentID} />}
        </div>
        <div className={`w-full bg-slate-100 flex flex-col print:hidden`}>
          <nav className="my-2" role="navigation" aria-label="Navigation">
            <ul className="flex justify-center">
              <li className="ml-3 first:ml-0">
                <Button
                  highlight={false}
                  hidden={active_tab == 1}
                  forceDisabled={isLoading || active_tab == 1 || active_tab == 4}
                  onClick={onClickPrevious}
                >
                  &lt;- Previous
                </Button>
              </li>
              <li className="ml-3 first:ml-0">
                <Button
                  highlight={true}
                  forceDisabled={active_tab == 7}
                  hidden={active_tab == 7}
                  onClick={onClickNext}
                  isLoading={isLoading}
                >
                  {(active_tab == 1 || active_tab == 2 || active_tab == 4) && (<>Next -&gt;</>)}
                  {(active_tab == 3) && (<>Generate -&gt;</>)}
                  {(active_tab == 5) && (<>Filter -&gt;</>)}
                  {(active_tab == 6) && (<>Generate 3D -&gt;</>)}
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
