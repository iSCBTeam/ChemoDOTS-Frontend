import React, { useState, useContext, useEffect, useCallback } from "react";
import useEditor from "../../../components/customHooks/useEditor";
import { stateContext, dispatchContext } from "../../app";
import Banner from "../../../components/banner/Banner";
import AccordionBasic from "../../../components/accordion/AccordionBasic";
import Tooltip from "../../../components/tooltip/Tooltip";
import {
  showError,
  strictValidArray,
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
} from "../../../utils/commonUtils";
import { ConvertRestultRules } from "../../../utils/helper";
import api from "../../../utils/api";
import { groupingReactionRules } from "../../../utils/helper";
import Button from "../../../components/button";
import GroupedReactionRules from "../components/groupedOptions";

const ReactionRules = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];
  const {
    growing_mol,
    Detected_Functions,
    selected_Functions,
    reaction_rules,
    grouped_reaction_rules,
    selected_function_rules,
  } = state;
  const dispatch = useContext(dispatchContext);
  const { highlightMolecule } = useEditor(editorID);

  const probeRules = async () => {
    if (!strictValidObjectWIthKey(selected_Functions))
      return;

    const data = {
      mode: "probe_reactions",
      mol: growing_mol,
      atoms: selected_Functions.Position.split(',').map(x => (x | 0) - 1),
    };
    const ans = await api.post("/Callscript_toolkit", data);

    const res = ConvertRestultRules(ans.data.data);
    if (!strictValidArrayWithLength(res)) {
      showError(dispatch, "No reaction rules found.");
      return;
    }

    dispatch({
      type: "save_reactionRules",
      instance: editorID,
      data: res,
    });
  };

  useEffect(() => {
    probeRules();
  }, [selected_Functions]);

  const filterRules = (accumulator, currentValue) => {
    const val = reaction_rules.filter(({ Id }) => Id == currentValue);
    return [...accumulator, ...val];
  };

  const groupingRules = () => {
    const groupedRules = groupingReactionRules
      .map(({ rules, title }) => {
        const rulesWithDetail = rules.reduce(filterRules, []);
        return { title, rules: rulesWithDetail };
      })
      .filter(({ rules }) => {
        return strictValidArrayWithLength(rules);
      });
    return groupedRules;
  };

  useEffect(() => {
    let groupedRules = [];
    if (strictValidArray(reaction_rules)) {
      groupedRules = groupingRules();
    }
    dispatch({
      type: "grouping_reactionRules",
      instance: editorID,
      data: groupedRules,
    });
  }, [reaction_rules]);

  const onClickFunction = (selected) => {
    const { Name, Position, Bonds } = selected;
    highlightMolecule(Position, Bonds);
    if (selected_Functions.Name !== Name)
    {
      dispatch({
        type: "save_reactionRules",
        instance: editorID,
        data: [],
      });
      dispatch({
        type: "empty_select_reaction_rules",
        instance: editorID,
      });
      dispatch({
        type: "selected_detected_function",
        instance: editorID,
        data: selected,
      });
    }
  };

  const isAllSelectChecked = (substructures) => {
    return (
      strictValidArray(substructures) &&
      substructures.every(
        ({ Id }) =>
          strictValidArray(selected_function_rules) &&
          selected_function_rules.some(
            ({ Id: selectedID }) => selectedID === Id
          )
      )
    );
  };

  const isAllSelectedCallBack = useCallback(isAllSelectChecked, [
    selected_function_rules,
  ]);

  const onAllSelectSubStructure = (selected, isChecked = false) => {
    dispatch({
      type: "on_select_reaction_rules",
      instance: editorID,
      data: selected,
      bulkAdd: true,
      isChecked,
    });
  };

  const onSelectAllOptions = (e) => {
    const isChecked = e.target.checked;
    dispatch({
      type: "on_select_reaction_rules",
      instance: editorID,
      data: reaction_rules,
      bulkAdd: true,
      isChecked,
    });
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6">
      <div>
        <Banner open={true} setOpen={() => {}} showIcon={false}>
          Choose the targeted function.
        </Banner>
        <div className="flex flex-col flex-wrap">
          {strictValidArray(Detected_Functions) &&
            Detected_Functions.map((functionOption) => {
              const { Name, Position, Bonds } = functionOption;
              return (
                <div className="m-3" key={Name}>
                  <label className="flex items-center w-fit cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio cursor-pointer"
                      checked={selected_Functions.Name === Name}
                      onChange={() => onClickFunction(functionOption)}
                    />
                    <span
                      className="text-sm ml-2"
                      onClick={() => onClickFunction(functionOption)}
                    >
                      {Name}
                    </span>
                  </label>
                  {/* End */}
                </div>
              );
            })}
        </div>
        <div className="m-3">
          {strictValidArrayWithLength(grouped_reaction_rules) && (
            <div className="m-3 flex items-center" key="All Select">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox cursor-pointer"
                  checked={isAllSelectedCallBack(reaction_rules)}
                  onChange={onSelectAllOptions}
                />
                <span className="text-sm ml-2 cursor-pointer">Select all</span>
              </label>
            </div>
          )}
          {strictValidArray(grouped_reaction_rules) &&
            grouped_reaction_rules.map(({ title, rules }) => {
              return (
                <GroupedReactionRules
                  editorID={editorID}
                  title={title}
                  options={rules}
                  selectedOptions={selected_function_rules}
                  keyValue="Id"
                  action_type="on_select_reaction_rules"
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ReactionRules;
