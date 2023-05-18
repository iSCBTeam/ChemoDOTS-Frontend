import { useEffect, useState, useContext } from "react";
import MarvinJSUtil from "./marvinlauncher";
import { stateContext, dispatchContext } from "../../container/app";
import API from "../../utils/api";
import { showError } from "../../utils/commonUtils";

const sampleMolecules = {
  caffeine: {
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
  },
  testmolecule: {
    smiles: "Cc1ccc(N)cc1Nc1nccc(n1)-c1cccnc1",
  },
  piperidine: {
    smiles: "CC(C)N1CCC(N)CC1",
  },
  thiophene: {
    smiles: "OC(=O)c1ccc(Cl)s1",
  },
};

const useEditor = (editorID) => {
  const state = useContext(stateContext)[editorID];
  const { growing_smiles, iframe_script_loaded } = state;
  const dispatch = useContext(dispatchContext);
  const [editorInstance, setIntance] = useState(null);

  const getEditor = async () => {
    const res = await MarvinJSUtil.getEditor(editorID);
    setIntance(res);
  };

  const doSearch = (smile) => {
    dispatch({ type: "save_smiles", instance: editorID, data: smile });
  };

  const searchWithSketcherContent = () => {
    editorInstance.exportStructure("smiles").then(
      (response) => doSearch(response),
      (error) => console.error(error)
    );
  };

  useEffect(() => {
    if (editorInstance)
      editorInstance.on("molchange", () => searchWithSketcherContent());
  }, [editorInstance]);

  const clearEditor = async () => {
    await editorInstance.clear();
  };

  useEffect(() => {
    if (iframe_script_loaded) getEditor();
  }, [iframe_script_loaded]);

  // function to export the structure in the given format from the sketcher
  const exportMolAction = (format = "smiles") => {
    const exportPromise = editorInstance.exportStructure(format, null);
    exportPromise.then(
      function (source) {
        dispatch({ type: "save_smiles", instance: editorID, data: source });
        const data = JSON.stringify({
          smiles: source,
        });
        API.post("/Callscript_Func", data);
      },
      function (error) {
        showError(dispatch, error);
      }
    );
  };

  const highlightMolecule = (pos, bonds) => {
    editorInstance.setSelection({
      atoms: pos,
      bonds: bonds,
    });
  };

  const addMoleculeToSketcher = async (molecule, codeType, example = false) => {
    let sample = molecule;
    if (example) {
      if (!codeType) {
        codeType = "smiles";
      }
      if (!molecule || !sampleMolecules[molecule]) {
        molecule = "caffeine";
      }
      if (sampleMolecules[molecule][codeType]) {
        sample = sampleMolecules[molecule][codeType];
      } else {
        codeType = "smiles";
        sample = sampleMolecules.caffeine[codeType];
      }
      const data = {
        isOpen: true,
        message: "Importing " + molecule + " as " + codeType + "...",
      };
      dispatch({ type: "info_modal", instance: editorID, data });
    }

    // add caffeine molecule
    try {
      await editorInstance.importStructure(codeType, sample);
      if (example) {
        dispatch({ type: "save_smiles", instance: editorID, data: sample });
      }
    } catch (error) {
      showError(dispatch, "Bad request");
    }
  };

  const createImageExport = async () => {
    try {
      const settings = await editorInstance.getDisplaySettings();
      settings.width = 420;
      settings.height = 420;
      settings.backgroundColor = "white";
      const source = await editorInstance.exportStructure("jpeg", settings);
      dispatch({
        type: "save_structure_image",
        instance: editorID,
        data: { smiles_code: growing_smiles, image: source },
      });
    } catch (error) {
      console.log("error image", error);
      const message = "Error in fetching structure Image";
      showError(dispatch, message);
    }
  };
  return {
    addMoleculeToSketcher,
    exportMolAction,
    editorInstance,
    highlightMolecule,
    createImageExport,
    clearEditor,
  };
};

export default useEditor;
