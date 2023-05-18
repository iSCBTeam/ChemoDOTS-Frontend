import React, { useEffect, useContext } from "react";
import MarvinJsWrapper from "../../../components/marvin";
import useEditor from "../../../components/customHooks/useEditor";
import { stateContext } from "../../app";

const Drawing = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];
  const { growing_smiles } = state;

  const { editorInstance, addMoleculeToSketcher } = useEditor(editorID);
  useEffect(() => {
    if (editorInstance && editorInstance.isEmpty() && growing_smiles) {
      addMoleculeToSketcher(growing_smiles, "smiles");
    }
  }, [editorInstance]);

  const getFragmentNumber = () => {
    switch (editorID) {
      case "secondInstance":
        return "1";
      case "thirdInstance":
        return "2";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 h-full">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">
          Draw Fragment {getFragmentNumber()}
        </h2>
      </header>
      <MarvinJsWrapper editorID={editorID} />
    </div>
  );
};

export default Drawing;
