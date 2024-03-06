import React, { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { stateContext } from "../../app";
import downloadIcon from "../../../assets/svg/download.svg";
import printIcon from "../../../assets/svg/print.svg";
import { getPercentage } from "../../../utils/commonUtils";
import SearchForm from "../../../components/searchField/SearchForm";
import Tooltip from "../../../components/tooltip/Tooltip";

const Download = ({ editorID, experimentID }) => {
  const state = useContext(stateContext)[editorID];

  const api_base = import.meta.env.VITE_BASE_API_URL;
  const out_base = import.meta.env.VITE_BASE_OUTPUT_URL;

  const [searchParams] = useSearchParams();
  const exp_id = searchParams.get(experimentID);
  const componentRef = useRef(null);

  const genDownloadLink = (text, href) => (<>
    <a href={href} className="group cursor-pointer">
      <img src={downloadIcon} className="inline-block align-middle h-6" />
      <span className="inline align-middle font-medium text-slate-800 group-hover:underline">
        {text}
      </span>
    </a>
  </>);

  const result_downloads = [
    { title: "Filtered building blocks/products (SDF/SMILES)", value: `${out_base}/${exp_id}/filtered/overall_filtered.zip` },
  ];

  return (<>
    <div
      className={`flex flex-col bg-white shadow-lg w-3/4 rounded-sm border border-l-2 border-slate-200 mx-auto print:h-full ${
        editorID === "firstInstance"
          ? "overflow-y-auto h-[calc(100vh-17rem)]"
          : ""
      }`}
      ref={componentRef}
    >
      <div className="flex text-lg text-slate-800 font-semibold relative p-4">
        Filtered library download
      </div>

      <div id="Download_Downloads" className="mx-auto w-full">
        {result_downloads.map(({ title, value }) => (<>
          <div className="px-2 py-3">{genDownloadLink(title, value)}</div>
        </>))}
      </div>

    </div>
  </>);
};

export default Download;
