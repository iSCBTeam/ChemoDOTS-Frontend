import React, { useState, useContext } from "react";
import useEditor from "../../../components/customHooks/useEditor";
import { stateContext, dispatchContext } from "../../app";
import howToImg from "../../../assets/img/how-to.png";

const Details = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];
  const dispatch = useContext(dispatchContext);
  const { growing_smiles } = state;

  const [timeID, setTimeID] = useState(null);

  const { addMoleculeToSketcher, clearEditor } =
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

  return (
    <div className="flex flex-col col-span-full">
      <div className="grow px-5 py-4">
        <textarea
          className="form-textarea w-full focus:border-slate-300"
          placeholder="SMILES code"
          value={growing_smiles}
          onChange={(e) => {
            addMoleculeToSketcher(e.target.value, "smiles");
            changeValue(e.target.value);
          }}
        />
        <img className="mx-auto py-4 max-w-lg" src={howToImg}></img>
      </div>
    </div>
  );
};

export default Details;
