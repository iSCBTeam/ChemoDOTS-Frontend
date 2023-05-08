import React, { useContext, useRef } from "react";
import { stateContext } from "../../app";
import html2pdf from "html2pdf.js";
import downloadIcon from "../../../assets/svg/download.svg";
import printIcon from "../../../assets/svg/print.svg";
import { getPercentage } from "../../../utils/commonUtils";

const FinalResult = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];

  const { growing_smiles, structureImage } = state;
  const componentRef = useRef(null);

  const result = [
    { title: "Input", value: growing_smiles },
    { title: "Name", value: growing_smiles },
    { title: "Formula ", value: "C16H15N5" },
    { title: "Molar mass", value: "277.1 g/mol", uplimit: 1000, lwlimit: 0 },
    { title: "LogP", value: "3.2", uplimit: 10, lwlimit: -5 },
    { title: "TPSA", value: "76.7", uplimit: 300, lwlimit: 0 },
    { title: "Acceptors ", value: "5", uplimit: 20, lwlimit: 0 },
    { title: "Donors", value: "2", uplimit: 20, lwlimit: 0 },
    { title: "Rotatable Bonds", value: "3", uplimit: 20, lwlimit: 0 },
    { title: "Fsp", value: "0.1", uplimit: 5, lwlimit: 0 },
  ];
  const extraParams = [
    { title: "Urea", value: "" },
    { title: "Urea", value: "" },
  ];

  const handleDownload = () => {
    const element = componentRef.current;

    const options = {
      margin: 1,
      filename: "chemicaldetails.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex mx-auto w-full print:hidden justify-end">
        <div onClick={handleDownload} className="cursor-pointer">
          <img src={downloadIcon} className="h-6" />
        </div>
        <div onClick={handlePrint} className="mx-6 cursor-pointer">
          <img src={printIcon} className="h-6" />
        </div>
      </div>

      <div
        className="flex flex-col bg-white shadow-lg rounded-sm border border-slate-200 mx-auto overflow-y-auto h-[calc(100vh-19.5rem)]"
        ref={componentRef}
      >
        <div className="flex">
          {structureImage.image && (
            <div className="w-1/2 self-center ">
              <img src={structureImage.image} />{" "}
            </div>
          )}
          <table className="table-auto w-1/2 divide-y divide-slate-200 border-l-2 border-slate-200">
            {result.map(({ title, value, uplimit, lwlimit }) => {
              return (
                <tbody className="text-sm" key={title}>
                  <tr>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{title}</div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div>{value}</div>
                      {uplimit && (
                        <div className="relative w-full h-2 bg-slate-600">
                          <div
                            className="absolute inset-0 bg-emerald-500"
                            aria-hidden="true"
                            style={{
                              width: `${getPercentage(
                                uplimit,
                                lwlimit,
                                value
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        {/* <table className="table-auto w-1/2 divide-y divide-slate-200 border-l-2 border-slate-200">
          {extraParams.map(({ title, value }) => {
            return (
              <tbody className="text-sm" key={title}>
                <tr>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{title}</div>
                  </td>
                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <img src={value} />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table> */}
      </div>
    </>
  );
};

export default FinalResult;
