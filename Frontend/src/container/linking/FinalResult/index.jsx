import React, { useContext, useRef } from "react";
import FinalResultInstance from "../../instance/FinalResult";

const FinalResult = () => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-19.5rem)]">
      <FinalResultInstance editorID="secondInstance" />
      <FinalResultInstance editorID="thirdInstance" />
    </div>
  );
};

export default FinalResult;
