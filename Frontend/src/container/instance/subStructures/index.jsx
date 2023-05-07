import React, { useContext, useEffect, useState, useCallback } from "react";
import { stateContext, dispatchContext } from "../../app";
import AccordionBasic from "../../../components/accordion/AccordionBasic";
import Tooltip from "../../../components/tooltip/Tooltip";
import {
  strictValidArray,
  strictValidArrayWithLength,
  validObjectWithKeys,
} from "../../../utils/commonUtils";
import { groupingSubReactionRules } from "../../../utils/helper";
import UndesiredSubstructures_DATABASE from "../../../utils/undesiredSubstructures";

const SubStructure = ({ editorID, tabID }) => {
  const state = useContext(stateContext)[editorID];
  const [details, setDetails] = useState(null);
  const {
    grouped_undesired_substructure,
    selected_undesired_substructure,
    required_substructure,
  } = state;

  const dispatch = useContext(dispatchContext);

  const filterRules = (accumulator, currentValue) => {
    const val = UndesiredSubstructures_DATABASE.filter(
      ({ Name }) => Name == currentValue
    );
    return [...val, ...accumulator];
  };

  const groupingUndesiredSubReactionRules = () => {
    const groupedSubStructure = groupingSubReactionRules
      .map(({ substructures, title, tooltip }) => {
        const subStructuresWithDetail = substructures.reduce(filterRules, []);
        return { title, substructures: subStructuresWithDetail, tooltip };
      })
      .filter(({ substructures }) => {
        return strictValidArrayWithLength(substructures);
      });
    return groupedSubStructure;
  };

  useEffect(() => {
    let groupedSubStructure = groupingUndesiredSubReactionRules();
    dispatch({
      type: "grouped_undesired_sub_reaction",
      instance: editorID,
      data: groupedSubStructure,
    });
  }, []);

  const onSelectSubStructure = (selected) => {
    dispatch({
      type: "on_select_undesired_substructure",
      instance: editorID,
      data: selected,
    });
  };
  const onAllSelectSubStructure = (selected, isChecked = false) => {
    dispatch({
      type: "on_select_undesired_substructure",
      instance: editorID,
      data: selected,
      bulkAdd: true,
      isChecked,
    });
  };

  const isAllSelectChecked = (substructures) => {
    return (
      strictValidArray(substructures) &&
      substructures.every(
        ({ Name }) =>
          strictValidArray(selected_undesired_substructure) &&
          selected_undesired_substructure.some(
            ({ Name: selectedName }) => Name === selectedName
          )
      )
    );
  };

  const isAllSelectedCallBcck = useCallback(isAllSelectChecked, [
    selected_undesired_substructure,
  ]);

  return (
    <div className="flex">
      <div className="w-1/2 bg-white shadow-lg rounded-sm border border-slate-200 m-3">
        <div className=" flex flex-col flex-wrap">
          <div className="m-3">
            <label
              className="block text-slate-800 font-semibold mb-1"
              htmlFor="mandatory"
            >
              Required substructure
            </label>

            <input
              name="required_substructure"
              className="form-input w-full"
              type="text"
              value={required_substructure}
              onChange={(e) => {
                const data = e.target.value;
                dispatch({
                  type: "required_substructure",
                  instance: editorID,
                  data,
                });
              }}
            />
          </div>
        </div>
        {strictValidArray(grouped_undesired_substructure) && (
          <div>
            <label
              className="block text-slate-800 font-semibold  m-3"
              htmlFor="mandatory"
            >
              Undesired substructures
            </label>
            {grouped_undesired_substructure.map(
              ({ title, substructures, tooltip }) => {
                return (
                  <AccordionBasic
                    key={title}
                    title={() => {
                      return (
                        <div className="flex">
                          {title}
                          <span className="ml-3">
                            <Tooltip
                              bg="dark"
                              size="lg"
                              position="right"
                              className="mx-auto"
                              transition_classname="w-64"
                            >
                              <div className="text-xs font-medium text-slate-200">
                                {tooltip}
                              </div>
                            </Tooltip>
                          </span>
                        </div>
                      );
                    }}
                  >
                    <div className="flex flex-col flex-wrap">
                      <div className="m-3 flex items-center" key="All Select">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox cursor-pointer"
                            checked={isAllSelectedCallBcck(substructures)}
                            onChange={(e) => {
                              onAllSelectSubStructure(
                                substructures,
                                e.target.checked
                              );
                            }}
                          />
                          <span className="text-sm ml-2 cursor-pointer">
                            Select all
                          </span>
                        </label>
                      </div>
                      {substructures.map((rule) => {
                        const { Name } = rule;
                        const isChecked =
                          strictValidArray(selected_undesired_substructure) &&
                          selected_undesired_substructure.some(
                            ({ Name: selectedName }) => Name === selectedName
                          );
                        return (
                          <div className="m-3 flex items-center" key={Name}>
                            {/* Start */}
                            <Tooltip
                              size="lg"
                              position="right-top-low"
                              transition_classname="w-52"
                              className="mr-3"
                            >
                              <img
                                src={`assets/undesired_sub_structure/byname/small/${Name}_small.png`}
                              />
                            </Tooltip>
                            <label
                              className="flex items-center"
                              onMouseEnter={() => setDetails(rule)}
                              onMouseLeave={() => setDetails(null)}
                            >
                              <input
                                type="checkbox"
                                className="form-checkbox cursor-pointer"
                                onChange={() => onSelectSubStructure(rule)}
                                checked={isChecked}
                              />
                              <span className="text-sm ml-2 cursor-pointer">
                                {Name}
                              </span>
                            </label>
                            {/* End */}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionBasic>
                );
              }
            )}
          </div>
        )}
      </div>
      {validObjectWithKeys(details, ["Name", "helperText"]) && (
        <div className="flex-1 bg-white shadow-lg rounded-sm border border-slate-200 m-3 h-fit sticky top-24">
          <div className=" flex flex-col flex-wrap">
            <div className="m-3">
              <label
                className="block text-slate-800 font-semibold mb-1"
                htmlFor="mandatory"
              >
                {`About ${details.Name}`}
              </label>

              <div>{details.helperText}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubStructure;
