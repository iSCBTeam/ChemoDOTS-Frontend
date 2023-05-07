import React, { useContext } from "react";
import { dispatchContext } from "../../container/app";

const MarvinJsWrapper = ({ editorID }) => {
  const dispatch = useContext(dispatchContext);

  const onload = () => {
    dispatch({ type: "iframe_script", instance: editorID, data: true });
  };
  return (
    <iframe
      onLoad={onload}
      className="h-full"
      src="editor.html"
      id={editorID}
    ></iframe>
  );
};
export default MarvinJsWrapper;
