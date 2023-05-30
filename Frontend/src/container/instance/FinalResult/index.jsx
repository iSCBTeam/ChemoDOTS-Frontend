import React, { useContext, useRef } from "react";
import { stateContext } from "../../app";
import html2pdf from "html2pdf.js";
import downloadIcon from "../../../assets/svg/download.svg";
import printIcon from "../../../assets/svg/print.svg";
import { getPercentage } from "../../../utils/commonUtils";
import SearchForm from "../../../components/searchField/SearchForm";
import Tooltip from "../../../components/tooltip/Tooltip";

const FinalResult = ({ editorID }) => {
  const state = useContext(stateContext)[editorID];

  const { growing_smiles, structureImage } = state;
  const componentRef = useRef(null);

  const result = [
    {
      title: "Smile",
      value: growing_smiles,
      title_tooltip: "Smile code of the input molecule",
    },
    {
      title: "Name",
      value: growing_smiles,
      title_tooltip:
        "You can supply a short name for the input molecule (only alphanumeric characters)",
    },
    {
      title: "Formula ",
      value: "C16H15N5",
      title_tooltip: "Molecular Formula of the input molecule",
    },
    {
      title: "Molar mass",
      value: "277.1 g/mol",
      uplimit: 1000,
      lwlimit: 0,
      title_tooltip: "Molar mass of input molecule (in g/mol)",
    },
    {
      title: "LogP",
      value: "3.2",
      uplimit: 10,
      lwlimit: -5,
      title_tooltip: "Predicted LogP value",
    },
    {
      title: "TPSA",
      value: "76.7",
      uplimit: 300,
      lwlimit: 0,
      title_tooltip: "Topological Polar Surface Area of input molecule",
    },
    {
      title: "Acceptors ",
      value: "5",
      uplimit: 20,
      lwlimit: 0,
      title_tooltip: "Number of Hydrogen bond acceptors",
    },
    {
      title: "Donors",
      value: "2",
      uplimit: 20,
      lwlimit: 0,
      title_tooltip: "Number of Hydrogen bond donors",
    },
    {
      title: "Rotatable Bonds",
      value: "3",
      uplimit: 20,
      lwlimit: 0,
      title_tooltip: "Number of rotatable bonds",
    },
    {
      title: "Fsp3",
      value: "0.1",
      uplimit: 5,
      lwlimit: 0,
      title_tooltip: "Fraction of sp3 carbon atoms",
    },
  ];
  const extraParams = [
    {
      title: "Urea",
      value: "assets/undesired_sub_structure/byname/Acyl_cyanide.png",
    },
    {
      title: "Nitro",
      value: "assets/undesired_sub_structure/byname/Nitro.png",
    },
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
        className={`flex flex-col bg-white shadow-lg w-3/4 rounded-sm border border-slate-200 mx-auto print:h-full ${
          editorID === "firstInstance"
            ? "overflow-y-auto h-[calc(100vh-19.5rem)]"
            : ""
        }`}
        ref={componentRef}
      >
        <div className="flex text-slate-800 font-semibold relative p-4">
          <div className="w-1/2 text-center">Reference Molecule</div>
          <div className="w-1/2 text-center">Chemical Properties</div>
          <div
            class="absolute bottom-0  h-px bg-slate-200"
            aria-hidden="true"
          ></div>
        </div>
        <div className="flex">
          <div className="w-1/2 self-center ">
            <img src={structureImage.image} />{" "}
          </div>
          <table className="table-auto  divide-y divide-slate-200 ">
            {result.map(({ title, value, uplimit, lwlimit, title_tooltip }) => {
              return (
                <tbody className="text-sm" key={title}>
                  <tr>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex">
                        {title}
                        {title === "Fsp" && <span>&sup3;</span>}
                        {title_tooltip && (
                          <span className="ml-3">
                            <Tooltip
                              bg="dark"
                              position="right"
                              className="mx-auto"
                            >
                              <div className="text-xs font-medium text-slate-200">
                                {title_tooltip}
                              </div>
                            </Tooltip>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div>
                        {title === "Name" ? (
                          <SearchForm placeholder={getPlaceholder()} />
                        ) : (
                          value
                        )}
                      </div>
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
        <div className="flex flex-col border border-slate-200 mt-12">
          <div className="flex text-slate-800 font-semibold self-center p-4">
            Compatible Chemical Reactions
          </div>
          {extraParams.map(({ value, title }) => {
            return (
              <div className="flex border border-slate-200">
                <div className="grow  self-center font-medium text-slate-800 text-center">
                  {title}
                </div>
                <img
                  src={value}
                  className="h-32 grow border border-slate-200"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FinalResult;
