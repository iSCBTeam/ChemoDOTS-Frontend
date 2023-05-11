import React, { useState, useContext, useEffect, useCallback } from "react";
import { stateContext, dispatchContext } from "../../app";
import AccordionBasic from "../../../components/accordion/AccordionBasic";
import SearchForm from "../../../components/searchField/SearchForm";
import {
  strictValidArray,
  strictValidArrayWithLength,
} from "../../../utils/commonUtils";
import Tooltip from "../../../components/tooltip/Tooltip";
const reactionRules = {
  key: "Id",
  action_type: "on_select_reaction_rules",
};

const GroupedReactionRules = ({
  editorID,
  title,
  options,
  selectedOptions,
  keyValue,
  action_type,
  header_tooltip,
  setDetails = () => {},
}) => {
  const dispatch = useContext(dispatchContext);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const filterOptions = (val) => {
    try {
      const { Id = "", Name } = val;
      const searchString = `${Id}${Name}`.toLocaleLowerCase();
      const searchTerm = searchValue && searchValue.toLocaleLowerCase();
      return searchString.includes(searchTerm);
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const updatedOptions = options.filter(filterOptions);
    setFilteredOptions(updatedOptions);
  }, [searchValue]);

  const isAllSelectChecked = () => {
    return (
      strictValidArray(filteredOptions) &&
      filteredOptions.every(
        (v) =>
          strictValidArray(selectedOptions) &&
          selectedOptions.some((selected) => selected[keyValue] === v[keyValue])
      )
    );
  };

  const isAllSelectedCallBack = useCallback(isAllSelectChecked, [
    selectedOptions,
    filteredOptions,
  ]);

  const onSelectAllOptions = (e) => {
    const isChecked = e.target.checked;
    dispatch({
      type: action_type,
      instance: editorID,
      data: filteredOptions,
      bulkAdd: true,
      isChecked,
    });
  };

  const onSelectOption = (selected) => {
    dispatch({
      type: action_type,
      instance: editorID,
      data: selected,
    });
  };

  return (
    <AccordionBasic
      title={
        !header_tooltip
          ? title
          : () => {
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
                        {header_tooltip}
                      </div>
                    </Tooltip>
                  </span>
                </div>
              );
            }
      }
      key={title}
    >
      <div className="flex flex-col flex-wrap">
        <SearchForm
          value={searchValue}
          onChange={setSearchValue}
          searchIcon={true}
        />
        {strictValidArrayWithLength(filteredOptions) && (
          <div className="m-3 flex items-center" key="All Select">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox cursor-pointer"
                checked={isAllSelectedCallBack()}
                onChange={onSelectAllOptions}
              />
              <span className="text-sm ml-2 cursor-pointer">Select all</span>
            </label>
          </div>
        )}
        {strictValidArray(filteredOptions) &&
          filteredOptions.map((option) => {
            const { Id, Name, Image } = option;
            const Image2 = `assets/undesired_sub_structure/byname/small/${Name}_small.png`;
            const isChecked =
              strictValidArray(selectedOptions) &&
              selectedOptions.some((selectedOption) => {
                return selectedOption[keyValue] === option[keyValue];
              });
            return (
              <div className="m-3" key={Name}>
                {/* Start */}
                <label
                  className="flex items-center"
                  onMouseEnter={() => setDetails(option)}
                  onMouseLeave={() => setDetails(null)}
                >
                  <Tooltip
                    size="lg"
                    position={`right-top${Id ? "" : "-low"}`}
                    transition_classname={Id ? "w-96" : "w-52"}
                    className="mr-3"
                  >
                    <img src={Image || Image2} alt="image" />
                  </Tooltip>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={() => onSelectOption(option)}
                    checked={isChecked}
                  />
                  <span
                    className="text-sm ml-2"
                    onClick={() => onSelectOption(option)}
                  >
                    {`${Id ? `Rule-${Id} ${Name}` : ` ${Name}`}`}
                  </span>
                </label>
                {/* End */}
              </div>
            );
          })}
      </div>
    </AccordionBasic>
  );
};

export default GroupedReactionRules;
