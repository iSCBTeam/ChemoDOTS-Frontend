import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { stateContext } from "../../app";
import html2pdf from "html2pdf.js";
import plusIcon from "../../../assets/img/plus.png";
import downloadIcon from "../../../assets/svg/download.svg";
import printIcon from "../../../assets/svg/print.svg";
import { getPercentage } from "../../../utils/commonUtils";
import SearchForm from "../../../components/searchField/SearchForm";
import Tooltip from "../../../components/tooltip/Tooltip";

const FinalResult = ({ editorID, experimentID }) => {
  const state = useContext(stateContext)[editorID];
  const [resultInfo, setResultInfo] = useState({
    fetched: false,
    contents: [],
  });

  const api_base = import.meta.env.VITE_BASE_API_URL;
  const out_base = import.meta.env.VITE_BASE_OUTPUT_URL;

  const { growing_smiles } = state;
  const [searchParams] = useSearchParams();
  const exp_id = searchParams.get(experimentID);
  const componentRef = useRef(null);

  const getPlaceholder = () => {
    let placeholder = "";
    switch (editorID) {
      case "firstInstance":
        placeholder = "imatinib-frag";
        break;
      case "secondInstance":
        placeholder = "piperidine";
        break;
      case "thirdInstance":
        placeholder = "thiophene";
        break;

      default:
        break;
    }
    return placeholder;
  };

  const genDownloadLink = (text, href) => <>
    <a href={href} className="group cursor-pointer">
      <img src={downloadIcon} className="inline-block align-middle h-6" />
      <span className="inline align-middle font-medium text-slate-800 group-hover:underline">
        {text}
      </span>
    </a>
  </>;

  const result_downloads = [
    { title: "Building blocks/products (SDF/SMILES)", value: `${out_base}/${exp_id}/raw/overall.zip` },
  ];

  useEffect(() => {
    if (resultInfo.fetched)
      return;

    (async () => {
      let rq = await fetch(`${out_base}/${exp_id}/info.json`);
      let res = await rq.json();

      const toPct = n => {
        if (n !== n)
          n = 0;

        n *= 100;

        if (n > 0 && n < 0.1)
          return '<0.1';

        return n.toFixed(1);
      };

      const overall_entry = res.reactions.find(e => e.id === null);

      const duration = res.duration;
      const contents = res.reactions.sort((a, b) => b.final_prod_cnt - a.final_prod_cnt).map(value => ({
        reaction_id: value.id,
        title: value.name,
        entry: [
          { title: "Total building blocks", value: `${value.total_bb_cnt}` },
          { title: "Reacted building blocks", value: `${toPct(value.reacted_bb_cnt / value.total_bb_cnt)}% (${value.reacted_bb_cnt}/${value.total_bb_cnt})` },
          { title: "Generated products", value: `${value.generated_prod_cnt}` },
          { title: "Duplicate products", value: `${toPct(value.duplicate_prod_cnt / value.generated_prod_cnt)}% (${value.duplicate_prod_cnt}/${value.generated_prod_cnt})` },
          //{ title: "Undesired products", value: `${toPct(value.undesired_prod_cnt / value.generated_prod_cnt)}% (${value.undesired_prod_cnt}/${value.generated_prod_cnt})` },
          { title: "Final products", value: `${toPct(value.final_prod_cnt / value.generated_prod_cnt)}% (${value.final_prod_cnt}/${value.generated_prod_cnt})` },
          { title: "Overall contribution to chemical space", value: `${toPct(value.final_prod_cnt / overall_entry.final_prod_cnt)}% (${value.final_prod_cnt}/${overall_entry.final_prod_cnt})` },
        ],
      }));

      setResultInfo(() => ({
        fetched: true,
        duration: duration,
        contents: contents,
      }));
    }) ();
  });

  const exp_bookmark_link = `https://chemodots.marseille.inserm.fr/growing?tab=4&experiment=${exp_id}`;

  return <>
    <div
      className={`flex flex-col bg-white shadow-lg w-3/4 rounded-sm border border-l-2 border-slate-200 mx-auto print:h-full ${
        editorID === "firstInstance"
          ? "overflow-y-auto h-[calc(100vh-17rem)]"
          : ""
      }`}
      ref={componentRef}
    >
      <div className="flex text-lg text-slate-800 font-semibold relative p-4">
        Raw library download
      </div>

      <div className="px-4 text-sm">
        Here you can find some statistics about the raw library generation. The downloads are available <a className="cursor-pointer font-semibold text-sky-700 hover:underline" href="#FinalResult_Downloads">below</a>.
      </div>

      <div className="px-4 text-sm">
        Duration of library generation: <span className="font-semibold">{resultInfo.duration}</span>
      </div>

      <div className="px-4 py-2 text-base">
        <div>You can <span className="font-semibold">bookmark</span> the following link to reload and <span className="font-semibold">access the saved data</span>, which will be stored for <span className="font-semibold">two weeks</span>:</div>
        <div><a className="cursor-pointer font-semibold text-sky-700 hover:underline" href={exp_bookmark_link} target="_blank" rel="noopener noreferrer">{exp_bookmark_link}</a></div>
      </div>

      {resultInfo.contents.map(({ reaction_id, title, entry }) => <>
        <div className="flex text-slate-800 font-semibold relative p-4">
          {title}
        </div>

        {reaction_id !== null ? <>
          <div className="flex relative p-4">
            <a className="relative p-2 group rounded-sm border border-slate-200 cursor-pointer opacity-50 hover:opacity-70 transition-opacity" href={`${out_base}/${exp_id}/raw/reaction${reaction_id}-subset100.svg`} target="_blank" rel="noopener noreferrer">
              <div className="text-sm text-center text-slate-800 font-semibold group-hover:underline">
                Generated products overview
              </div>

              <img className="mx-auto max-w-[12rem]" src={`${out_base}/${exp_id}/raw/reaction${reaction_id}-subset4.svg`}></img>
              <img className="absolute w-8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" src={plusIcon}></img>
            </a>
          </div>
        </> : <></>}

        <table className="table-fixed divide-y divide-slate-200">
          {entry.map(({ title, value }) => <>
            <tbody className="text-sm" key={title}>
              <tr>
                <td className="w-1/2 px-2 first:pl-5 last:pr-5 py-2 whitespace-nowrap">
                  <div className="font-medium text-slate-800">{title}</div>
                </td>

                <td className="w-1/2 px-2 first:pl-5 last:pr-5 py-2 whitespace-nowrap ml-3">
                  <div>{value}</div>
                </td>
              </tr>
            </tbody>
          </>)}
        </table>
      </>)}

      <div className="flex text-slate-800 font-semibold relative p-4">
        Downloads
      </div>

      <div className="px-4 text-sm">
        The raw library can be downloaded below.
      </div>

      <div id="FinalResult_Downloads" className="mx-auto w-full">
        {result_downloads.map(({ title, value }) => <>
          <div className="px-2 py-3">{genDownloadLink(title, value)}</div>
        </>)}
      </div>

      <div className="flex text-slate-800 font-semibold relative p-4">
        Post processing
      </div>

      <div className="px-4 pb-2 text-sm">
        You can then perform an optional post processing step.
      </div>

    </div>
  </>;
};

export default FinalResult;
