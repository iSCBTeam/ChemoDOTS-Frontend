import React, { useEffect, useState, useContext } from "react";
import ModalBlank from "./templates/ModalBlank";
import {
  strictValidString,
  validObjectWithKeys,
} from "../../utils/commonUtils";
import { stateContext, dispatchContext } from "../../container/app";

const DangerModal = () => {
  const state = useContext(stateContext);
  const { error_modal = {} } = state;
  const dispatch = useContext(dispatchContext);

  const setErrorModal = (data) => {
    dispatch({ type: "error_modal", data });
  };
  return (
    <ModalBlank
      id="danger-modal"
      modalOpen={error_modal.isOpen}
      setModalOpen={(val) => setErrorModal({ isOpen: false, message: null })}
    >
      <div className="p-5 flex space-x-4 flex-col items-center justify-center">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100">
          <svg
            className="w-4 h-4 shrink-0 fill-current text-rose-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
          </svg>
        </div>
        {/* Content */}
        <div>
          <div className="text-lg font-semibold text-slate-800 mb-10 space-y-2">
            <p>
              {validObjectWithKeys(error_modal, ["message"]) &&
              strictValidString(error_modal.message)
                ? error_modal.message
                : "Something went wrong!"}
            </p>
          </div>
          <div className="flex flex-wrap  space-x-2 items-center justify-center">
            <button
              className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
              onClick={() => {
                setErrorModal({ isOpen: false, message: "" });
              }}
            >
              close
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default DangerModal;
