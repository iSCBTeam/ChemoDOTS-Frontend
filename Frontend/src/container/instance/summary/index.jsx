import React, { useContext } from "react";
import { stateContext } from "../../app";
import { validFunction } from "../../../utils/commonUtils";

const Summary = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];
  const {
    growing_smiles,
    selected_Functions,
    selected_function_rules,
    required_substructure,
    selected_undesired_substructure,
  } = state;

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
    { title: "Smiles", value: growing_smiles },
    { title: "Targated Function ", value: selected_Functions.Name },
    {
      title: "Function Rules",
      value: getFunctionRules(selected_function_rules),
    },
    { title: "Required Substructure", value: required_substructure },
    {
      title: "Undesired Substructure",
      value: getFunctionRules(selected_undesired_substructure),
    },
  ];

  return (
    <div className="flex bg-white  rounded-sm border border-slate-200 mx-auto overflow-y-auto h-[calc(100vh-18rem)]">
      <table className="table-auto w-1/2 divide-y divide-slate-200 border-l-2 border-slate-200">
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
    </div>
  );
};

export default Summary;
