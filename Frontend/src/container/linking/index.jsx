import React from "react";
import Instance from "../instance";

const Linking = () => {
  return (
    <>
      <Instance editorID="secondInstance" tabID="first_tab" />
      <div
        className="flex justify-center text-slate-800 w-full h-16 bg-white"
        aria-hidden="true"
      >
        Fragment 2
      </div>
      <Instance editorID="thirdInstance" tabID="second_tab" />
    </>
  );
};

export default Linking;
