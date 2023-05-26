import React, { useContext } from "react";
import { stateContext } from "../../app";
import { validFunction } from "../../../utils/commonUtils";
import DropdownFull from "../../../components/dropdown";

const options = [
  {
    value: 0,
    label: "Standard",
  },
  {
    value: 1,
    label: "Large",
  },
  {
    value: 2,
    label: "Test",
  },
];

const Summary = () => {
  const state = useContext(stateContext).secondInstance;
  const {
    growing_smiles,
    selected_Functions,
    selected_function_rules,
    selected_undesired_substructure,
  } = state;
  const state1 = useContext(stateContext).thirdInstance;
  const {
    growing_smiles: growing_smiles1,
    selected_Functions: selected_Functions1,
    selected_function_rules: selected_function_rules1,
    selected_undesired_substructure: selected_undesired_substructure1,
  } = state1;

  const getFunctionRules = (arr) => {
    return (
      <ul className="list-inside list-decimal">
        {arr.map(({ Name }) => (
          <li key={Name}>{Name}</li>
        ))}
      </ul>
    );
  };

  const result = [
    { title: "Smiles 1", value: growing_smiles },
    { title: "Targated Function 1", value: selected_Functions.Name },
    {
      title: "Function Rules 1",
      value: getFunctionRules(selected_function_rules),
    },
    { title: "Smiles 2", value: growing_smiles1 },
    { title: "Targated Function 2", value: selected_Functions1.Name },
    {
      title: "Function Rules 2",
      value: getFunctionRules(selected_function_rules1),
    },
    {
      title: "Undesired Substructure",
      value: getFunctionRules(selected_undesired_substructure),
    },
  ];

  return (
    <div className="flex  flex-col bg-white  rounded-sm border border-slate-200 mx-auto overflow-y-auto h-[calc(100vh-18rem)] w-2/4">
      <table className="table-auto  divide-y divide-slate-200 border-l-2 border-slate-200">
        {result.map(({ title, value }) => {
          return (
            <tbody className="text-sm" key={title}>
              <tr>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-medium text-slate-800">{title}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ml-3">
                  <div>{validFunction(value) ? value() : value}</div>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <div className="w-80 m-3">
        <label
          className="block text-slate-800 font-semibold  m-3"
          htmlFor="mandatory"
        >
          Building Block database
        </label>
        <DropdownFull options={options} />
      </div>
    </div>
  );
};

export default Summary;
