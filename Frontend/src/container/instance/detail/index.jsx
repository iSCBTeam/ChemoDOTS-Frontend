import React, { useState, useContext } from "react";
import useEditor from "../../../components/customHooks/useEditor";
import { stateContext, dispatchContext } from "../../app";

const Details = ({ editorID, tabID }) => {
  const state = useContext(stateContext)[editorID];
  const dispatch = useContext(dispatchContext);
  const { growing_smiles } = state;

  const [timeID, setTimeID] = useState(null);

  const { addMoleculeToSketcher, editorInstance, clearEditor } =
    useEditor(editorID);

  const changeValue = (val) => {
    if (timeID) clearTimeout(timeID);
    const id = setTimeout(() => {
      if (val) {
        addMoleculeToSketcher(val);
      } else {
        clearEditor();
      }
    }, 1000);
    setTimeID(id);
  };

  const getLaunchValue = () => {
    let sample = "testmolecule";
    switch (editorID) {
      case "secondInstance":
        sample = "piperidine";
        break;
      case "thirdInstance":
        sample = "thiophene";
        break;

      default:
        break;
    }
    return sample;
  };

  return (
    <div className="flex flex-col col-span-full  bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <div className="flex flex-wrap items-center -m-1.5">
          <div className="m-1.5">
            {/* Start */}
            <button
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={() => {
                addMoleculeToSketcher(getLaunchValue(), "smiles", true);
              }}
            >
              Launch Demo
            </button>
            {/* End */}
          </div>
          <div className="m-1.5">
            {/* Start */}
            <button
              className="btn border-slate-200 hover:border-slate-300 text-rose-500"
              onClick={() => {
                clearEditor();
                dispatch({ type: "save_smiles", instance: editorID, data: "" });
              }}
            >
              Reset
            </button>
            {/* End */}
          </div>
        </div>
      </header>
      <div className="grow px-5 py-4">
        <textarea
          className="form-textarea w-full focus:border-slate-300"
          placeholder="SMILES code"
          value={growing_smiles}
          onChange={(e) => {
            dispatch({
              type: "save_smiles",
              instance: editorID,
              data: e.target.value,
            });
            changeValue(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Details;
