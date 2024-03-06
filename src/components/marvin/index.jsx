import React, { useEffect, useContext, useRef } from "react";
import { dispatchContext } from "../../container/app";

const MarvinJsWrapper = ({ editorID }) => {
  const dispatch = useContext(dispatchContext);
  const editorRef = useRef(null);

  const onload = () => {
    (async () => {
      let instance = await editorRef.current.contentWindow.marvin;
      if (!instance)
        return;

      dispatch({ type: "sketcher_instance", instance: editorID, data: instance });
    })();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      console.log("Sketcher instance cleanup.");
      dispatch({ type: "sketcher_instance", instance: editorID, data: null });
    };
  }, []);

  return (
    <iframe
      onLoad={onload}
      id={editorID}
      ref={editorRef}
      className="w-full h-full"
      src="editor.html"
    ></iframe>
  );
};
export default MarvinJsWrapper;
