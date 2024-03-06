import React, { useContext, useEffect, useRef, useState } from "react";
import { stateContext, dispatchContext } from "../../app";
import { validFunction } from "../../../utils/commonUtils";
import DropdownFull from "../../../components/dropdown";
import api from "../../../utils/api";

const options = [ {
    label: "Molport (default)",
    value: ["MolPort"],
  }, {
    label: "Enamine",
    value: ["Enamine"],
  }, {
    label: "Enamine + Molport",
    value: ["Enamine", "MolPort"],
  },
];

const Summary = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];
  const {
    growing_mol,
    growing_smiles,
    selected_Functions,
    selected_function_rules,
  } = state;
  const dispatch = useContext(dispatchContext);
  let fragmentImgRef = useRef(null);
  let [ descState, setDescState ] = useState([]);

  const getReactionRules = (arr) => {
    return (
      <ul className="list-inside">
        {arr.map(({ Name }) => (
          <li key={Name}>{Name}</li>
        ))}
      </ul>
    );
  };

  const fetchMolInfo = async () => {
    if (!fragmentImgRef.current)
      return;

    const data = {
      mode: "mol_info",
      mol: growing_mol,
    };
    const ans = await api.post("/Callscript_toolkit", data);

    const res = ans.data.data;
    fragmentImgRef.current.innerHTML = res.frag_svg;

    const descs_hdr = [
      { id: "mw", name: "Molecular weight" },
      { id: "hba", name: "H-bond acceptors" },
      { id: "hbd", name: "H-bond donors" },
      { id: "rot", name: "Rotatable bonds" },
      { id: "logp", name: "LogP" },
      { id: "tpsa", name: "TPSA" },
      { id: "chiral", name: "Chiral centers" },
    ];

    let descs = [];
    for (let d of descs_hdr) {
      let val = res.descs[d.id];
      if ((val ?? null) === null)
        continue;

      if (!Number.isInteger(val))
        val = val.toFixed(2);

      descs.push({
        id: d.id,
        name: d.name,
        val: val,
      });
    }

    setDescState(descs);
  };

  useEffect(() => {
    fetchMolInfo();
  }, [fragmentImgRef]);

  const handleFragmentImg = () => {
    return (<div ref={fragmentImgRef}></div>);
  };

  const handleDescriptors = () => {
    return (
      <ul className="list-inside">
        {descState.map(({ id, name, val }) => (
          <li key={id}>{`${name}: ${val}`}</li>
        ))}
      </ul>
    );
  };

  const handleBuildingBlockDatabasesChange = option => {
    dispatch({
      type: "set_building_block_databases",
      instance: editorID,
      data: option.value,
    });
  };

  const result = [
    { title: "Fragment", value: handleFragmentImg },
    { title: "Descriptors", value: handleDescriptors },
    { title: "Smiles", value: growing_smiles },
    { title: "Targeted Function", value: selected_Functions.Name },
    {
      title: "Reaction rules",
      value: getReactionRules(selected_function_rules),
    },
  ];

  return (
    <div className="flex flex-col bg-white rounded-sm border border-slate-200 mx-auto overflow-y-auto h-[calc(100vh-17rem)] w-2/4">
      <div className="flex text-lg text-slate-800 font-semibold relative p-4">
        Summary
      </div>

      <table className="table-auto  divide-y divide-slate-200 border-slate-200">
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
          Building Block databases
        </label>
        <DropdownFull options={options} default_index={0} onChange={handleBuildingBlockDatabasesChange} />
      </div>
    </div>
  );
};

export default Summary;
