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
import GroupedReactionRules from "../components/groupedOptions";

const SubStructure = ({ editorID, tabID }) => {
  const state = useContext(stateContext)[editorID];
  const [details, setDetails] = useState(null);
  const { grouped_undesired_substructure, selected_undesired_substructure } =
    state;

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

  const isAllSelectedCallBack = useCallback(isAllSelectChecked, [
    selected_undesired_substructure,
  ]);

  const onSelectAllOptions = (e) => {
    const isChecked = e.target.checked;
    dispatch({
      type: "on_select_undesired_substructure",
      instance: editorID,
      data: UndesiredSubstructures_DATABASE,
      bulkAdd: true,
      isChecked,
    });
  };

  return (
    <div className="flex">
      <div className="w-1/2 bg-white shadow-lg rounded-sm border border-slate-200 m-3">
        {strictValidArray(grouped_undesired_substructure) && (
          <div>
            <label
              className="block text-slate-800 font-semibold  m-3"
              htmlFor="mandatory"
            >
              Undesired substructures
            </label>
            {strictValidArrayWithLength(grouped_undesired_substructure) && (
              <div className="m-3 flex items-center" key="All Select">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox cursor-pointer"
                    checked={isAllSelectedCallBack(
                      UndesiredSubstructures_DATABASE
                    )}
                    onChange={onSelectAllOptions}
                  />
                  <span className="text-sm ml-2 cursor-pointer">
                    Select all
                  </span>
                </label>
              </div>
            )}
            {grouped_undesired_substructure.map(
              ({ title, substructures, tooltip }) => {
                return (
                  <GroupedReactionRules
                    editorID={editorID}
                    title={title}
                    options={substructures}
                    selectedOptions={selected_undesired_substructure}
                    keyValue="Name"
                    action_type="on_select_undesired_substructure"
                    header_tooltip={tooltip}
                    setDetails={setDetails}
                  />
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
