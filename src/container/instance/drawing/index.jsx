import React, { useEffect, useContext, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MarvinJsWrapper from "../../../components/marvin";
import useEditor from "../../../components/customHooks/useEditor";
import { stateContext, dispatchContext } from "../../app";

const Drawing = ({ editorID, tabID }) => {
  const state = useContext(stateContext)[editorID];
  const { growing_mol } = state;
  const dispatch = useContext(dispatchContext);
  const [searchParams] = useSearchParams();
  const active_tab = searchParams.get(tabID) | 0;
  const editorDivRef = useRef(null);
  const editorOverlayRef = useRef(null);
  const btnExample1Ref = useRef(null);
  const btnExample2Ref = useRef(null);
  const btnResetRef = useRef(null);
  const { sketcherInstance, addMoleculeToSketcher, clearEditor } = useEditor(editorID);
  const [ sketcherInitialized, setSketcherInitialized ] = useState(false);

  const isEditable = () => {
    return active_tab <= 1;
  };

  // Initialize the sketcher on instance creation
  useEffect(() => {
    (async () => {
      if (sketcherInitialized)
        return;

      if (!sketcherInstance)
        return;

      if (sketcherInstance.isEmpty() && growing_mol) {
        await addMoleculeToSketcher(growing_mol, "mol");
      }

      setSketcherInitialized(true);
    })();
  }, [sketcherInitialized, sketcherInstance]);

  useEffect(() => {
    (async () => {
      if (!sketcherInitialized)
        return;

      const molchange_cb = () => {
        saveFragment();
      };
      sketcherInstance.off("molchange", molchange_cb);
      sketcherInstance.on("molchange", molchange_cb);
    })();
  }, [sketcherInitialized, sketcherInstance, active_tab]);

  const saveFragment = async () => {
    if (!isEditable())
      return;

    try {
      let mol = await sketcherInstance.exportStructure("mol");
      let smiles = await sketcherInstance.exportStructure("smiles");

      dispatch({ type: "save_fragment", instance: editorID, data: { "mol": mol, "smiles": smiles } });
    } catch (e) {
      console.error(e);
    }
  };

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

  const updateEditable = () => {
    const css_classes = [
      // Prevent (almost) any interaction (older browsers)
      'select-none', 'pointer-events-none',
      'grayscale-[10%]', 'opacity-[50%]',
    ];

    if (!isEditable()) {
      // Show overlay div
      editorOverlayRef.current.removeAttribute('hidden');
      editorOverlayRef.current.classList.remove('hidden');

      // Remove current focus
      if (editorDivRef.current.contains(document.activeElement))
        document.activeElement.blur();

      // Prevent keyboard focus
      editorDivRef.current.setAttribute('tabindex', '-1');

      // Prevent any interaction (recent browsers)
      editorDivRef.current.setAttribute('inert', '');

      editorDivRef.current.classList.add(...css_classes);

      btnExample1Ref.current.setAttribute('disabled', '');
      btnExample2Ref.current.setAttribute('disabled', '');
      btnResetRef.current.setAttribute('disabled', '');
    } else {
      // Reactivate interactions
      editorDivRef.current.removeAttribute('tabindex');
      editorDivRef.current.removeAttribute('inert');
      editorDivRef.current.classList.remove(...css_classes);

      // Hide overlay div
      editorOverlayRef.current.setAttribute('hidden', '');
      editorOverlayRef.current.classList.add('hidden');

      btnExample1Ref.current.removeAttribute('disabled', '');
      btnExample2Ref.current.removeAttribute('disabled', '');
      btnResetRef.current.removeAttribute('disabled', '');
    }
  };

  useEffect(() => {
    updateEditable();
  }, [active_tab]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 h-full overflow-hidden">
      <header className="flex justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="py-2 align-middle font-semibold text-slate-800">
          Draw Fragment {getFragmentNumber()}
        </h2>

        <div className="flex items-center -m-1.5">
          <div className="m-1.5">
            <button
              ref={btnExample1Ref}
              className="btn border-slate-200 hover:border-slate-300 text-indigo-500 disabled:text-slate-400 disabled:cursor-not-allowed"
              onClick={() => {
                addMoleculeToSketcher("testmolecule1", "smiles", true);
              }}
            >
              Example 1
            </button>
          </div>

          <div className="m-1.5">
            <button
              ref={btnExample2Ref}
              className="btn border-slate-200 hover:border-slate-300 text-indigo-500 disabled:text-slate-400 disabled:cursor-not-allowed"
              onClick={() => {
                addMoleculeToSketcher("testmolecule2", "smiles", true);
              }}
            >
              Example 2
            </button>
          </div>

          <div className="m-1.5">
            <button
              ref={btnResetRef}
              className="btn border-slate-200 hover:border-slate-300 text-rose-500 disabled:text-slate-400 disabled:cursor-not-allowed"
              onClick={() => {
                clearEditor();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </header>
      <div className="relative w-full h-full">
        <div ref={editorOverlayRef} className="absolute z-10 w-full h-full cursor-not-allowed"></div>
        <div ref={editorDivRef} className="z-0 w-full h-full transition-[grayscale,opacity] duration-500">
          <MarvinJsWrapper editorID={editorID} />
        </div>
      </div>
    </div>
  );
};

export default Drawing;
