import React, { useEffect, useState, useContext } from "react";
import ModalBlank from "./templates/ModalBlank";
import {
  strictValidString,
  validObjectWithKeys,
} from "../../utils/commonUtils";
import { stateContext, dispatchContext } from "../../container/app";

const InfoModal = () => {
  const state = useContext(stateContext);
  const { info_modal = {} } = state;
  const dispatch = useContext(dispatchContext);

  const setInfoModal = (data) => {
    dispatch({ type: "info_modal", data });
  };
  return (
    <ModalBlank
      id="info-modal"
      modalOpen={info_modal.isOpen}
      setModalOpen={setInfoModal}
    >
      <div className="p-5 flex space-x-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-100">
          <svg
            className="w-4 h-4 shrink-0 fill-current text-indigo-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
          </svg>
        </div>
        {/* Content */}
        <div>
          {/* Modal header */}
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800">
              {validObjectWithKeys(info_modal, ["message"]) &&
              strictValidString(info_modal.message)
                ? info_modal.message
                : ""}
            </div>
          </div>
          {/* Modal content */}
          {/* Modal footer */}
          <div className="flex justify-center space-x-2">
            <button
              className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                setInfoModal({ isOpen: false, message: "" });
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default InfoModal;
