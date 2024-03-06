import { useEffect, useState, useContext } from "react";
import { stateContext, dispatchContext } from "../../container/app";
import API from "../../utils/api";
import { showError } from "../../utils/commonUtils";

const sampleMolecules = {
  caffeine: {
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
  },
  testmolecule1: {
    smiles: "CCN1C=NC2=C1C(=O)NC(=O)N2CC1=CC=C(CN)C=C1",
  },
  testmolecule2: {
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
  const {
    sketcher_instance
  } = state;
  const dispatch = useContext(dispatchContext);
  const [ sketcherInstance, setSketcherInstance ] = useState(null);

  useEffect(() => {
    setSketcherInstance(sketcher_instance);
  }, [sketcher_instance]);

  const clearEditor = async () => {
    await sketcherInstance.clear();
  };

  const highlightMolecule = (pos, bonds) => {
    sketcherInstance.setSelection({
      atoms: pos,
      bonds: bonds,
    });

    /*sketcherInstance.setHighlight([{
      indexes: {
        atoms: pos.split(","),
        bonds: bonds.split(",")
      },
      style: {
        color: "blue",
        opacity: 0.5,
        size: 0.8
      }
    }]);*/
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

    try {
      await sketcherInstance.importStructure(codeType, sample);
    } catch (error) {
      showError(dispatch, "Bad request");
    }
  };

  return {
    sketcherInstance,
    addMoleculeToSketcher,
    highlightMolecule,
    clearEditor,
  };
};

export default useEditor;
