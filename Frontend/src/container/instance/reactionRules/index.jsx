import React, { useState, useContext, useEffect } from "react";
import useEditor from "../../../components/customHooks/useEditor";
import { stateContext, dispatchContext } from "../../app";
import Banner from "../../../components/banner/Banner";
import AccordionBasic from "../../../components/accordion/AccordionBasic";
import Tooltip from "../../../components/tooltip/Tooltip";
import {
  strictValidArray,
  strictValidArrayWithLength,
  strictValidObjectWIthKey,
} from "../../../utils/commonUtils";
import { ConvertRestultRules } from "../../../utils/helper";
import api from "../../../utils/api";
import { groupingReactionRules } from "../../../utils/helper";
import Button from "../../../components/button";

const ReactionRules = ({ editorID, tabID }) => {
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
  const { highlightMolecule } = useEditor(editorID);

  const generateReactionRules = async () => {
    const data = { funcname: selected_Functions.Name_Func };
    const res = await api.post("/Callscript_rules", data);

    const ress = ConvertRestultRules(res.data.data);
    dispatch({
      type: "save_reactionRules",
      instance: editorID,
      data: ress,
    });
  };

  const filterRules = (accumulator, currentValue) => {
    const val = reaction_rules.filter(({ Id }) => Id == currentValue);
    return [...val, ...accumulator];
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

  const onSelectReactionRule = (selected) => {
    dispatch({
      type: "on_select_reaction_rules",
      instance: editorID,
      data: selected,
    });
  };

  const onClickFunction = (selected) => {
    const { Name, Position, Bonds } = selected;
    highlightMolecule(Position, Bonds);
    if (selected_Functions.Name !== Name) {
      dispatch({
        type: "save_reactionRules",
        instance: editorID,
        data: [],
      });
      dispatch({
        type: "empty_select_reaction_rules",
        instance: editorID,
      });
    }
    dispatch({
      type: "selected_detected_function",
      instance: editorID,
      data: selected,
    });
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <div>
        <Banner open={true} setOpen={() => {}} showIcon={false}>
          Choose the targeted function, if you have changed your molecule,
          please click again on the Validate button.
        </Banner>
        <div className=" flex flex-col flex-wrap">
          {strictValidArray(Detected_Functions) &&
            Detected_Functions.map((functionOption) => {
              const { Name, Position, Bonds } = functionOption;
              return (
                <div className="m-3" key={Name}>
                  <label
                    onMouseOver={() => highlightMolecule(Position, Bonds)}
                    onMouseOut={() => highlightMolecule("", "")}
                    onMouseLeave={() => highlightMolecule("", "")}
                    className="flex items-center w-fit cursor-pointer"
                  >
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
          {strictValidArrayWithLength(Detected_Functions) && (
            <div className="flex  m-3">
              <Button
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white  disabled:opacity-90 disabled:cursor-not-allowed"
                onClick={generateReactionRules}
                disabled={!strictValidObjectWIthKey(selected_Functions)}
              >
                Generate Reaction Rules
              </Button>
            </div>
          )}
        </div>
        <div className="m-3">
          {strictValidArray(grouped_reaction_rules) &&
            grouped_reaction_rules.map(({ title, rules }) => {
              return (
                <AccordionBasic title={title} key={title}>
                  <div className="flex flex-col flex-wrap">
                    {rules.map((rule) => {
                      const { Id, Name, Image } = rule;
                      const isChecked =
                        strictValidArray(selected_function_rules) &&
                        selected_function_rules.some(
                          ({ Id: selectedID }) => selectedID === Id
                        );
                      return (
                        <div className="m-3" key={Id}>
                          {/* Start */}
                          <label className="flex items-center">
                            <Tooltip
                              size="lg"
                              position="right-top"
                              transition_classname="w-96"
                              className="mr-3"
                            >
                              {/* <DynamicImage image={Image} /> */}
                              <img src={Image} alt="image" />
                            </Tooltip>
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              onChange={() => onSelectReactionRule(rule)}
                              checked={isChecked}
                            />
                            <span
                              className="text-sm ml-2"
                              onClick={() => onSelectReactionRule(rule)}
                            >
                              {`Rule-${Id} ${Name}`}
                            </span>
                          </label>
                          {/* End */}
                        </div>
                      );
                    })}
                  </div>
                </AccordionBasic>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ReactionRules;
