import { strictValidArray } from "./commonUtils";

// a function to check if a string is a alphanumeric
function isAlpha(str) {
  let code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)
    ) {
      // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

//Convert the result from the python script for function
export const ConvertRestultFunction = (output, currentSmilesCode) => {
  let name;
  let pos = [];
  let tmp = "";
  let numb_tmp = 0;
  let bond = [];
  let limit = 0;
  let cpt_Halide_alkyl = 0;
  let cpt_Halide_aryl = 0;
  let cpt_Halo_pyrimidine = 0;
  const Detected_Functions = [];
  for (let i = 0; i < output.length; i++) {
    name = output[i];
    i += 1;
    let j = 0;
    let cpt = 0;
    while (j < output[i].length) {
      tmp = "";
      pos = [];
      bond = [];
      let nametemp = name;
      if (
        nametemp == "Halide alkyl Cl" ||
        nametemp == "Halide alkyl Br" ||
        nametemp == "Halide alkyl I"
      ) {
        nametemp = "Halide alkyl";
        //In case we detect one function more than on time
        if (cpt_Halide_alkyl != 0) {
          nametemp += "_" + cpt_Halide_alkyl;
        }
      } else if (
        nametemp == "Halide aryl Cl" ||
        nametemp == "Halide aryl Br" ||
        nametemp == "Halide aryl I"
      ) {
        nametemp = "Halide aryl";
        //In case we detect one function more than on time
        if (cpt_Halide_aryl != 0) {
          nametemp += "_" + cpt_Halide_aryl;
        }
      } else if (
        nametemp == "Halo pyrimidine Cl" ||
        nametemp == "Halo pyrimidine Br" ||
        nametemp == "Halo pyrimidine I"
      ) {
        nametemp = "Halo pyrimidine";
        //In case we detect one function more than on time
        if (cpt_Halo_pyrimidine != 0) {
          nametemp += "_" + cpt_Halo_pyrimidine;
        }
      } else {
        //In case we detect one function more than on time
        if (cpt != 0) {
          nametemp += "_" + cpt;
        }
      }

      //We search the first number
      while (
        j < output[i].length &&
        (isNaN(+output[i][j]) || output[i][j] == " " || output[i][j] == ",")
      ) {
        j++;
      }
      //Check if we are not at the end of the string
      if (j < output[i].length) {
        while (
          (+output[i][j] >= 0 && +output[i][j] <= 9) ||
          output[i][j] == ","
        ) {
          if (output[i][j] == "," || output[i][j] == " ") {
            if (tmp != "") {
              limit = Number(tmp);
              numb_tmp = limit;
              //Move the index of the function in the case with explicit H
              let k = 0;
              while (k <= limit) {
                if (
                  currentSmilesCode[k] == "H" ||
                  !isAlpha(currentSmilesCode[k])
                ) {
                  limit = limit + 1;
                  if (currentSmilesCode[k] == "H") {
                    numb_tmp = numb_tmp + 1;
                  }
                }
                k++;
              }
              pos.push(numb_tmp + 1);

              tmp = "";
            }
          } else {
            tmp += output[i][j];
          }
          j++;
        }

        if (tmp != "") {
          limit = Number(tmp);
          numb_tmp = limit;
          let k = 0;
          while (k <= limit) {
            if (currentSmilesCode[k] == "H" || !isAlpha(currentSmilesCode[k])) {
              limit = limit + 1;
              if (currentSmilesCode[k] == "H") {
                numb_tmp = numb_tmp + 1;
              }
            }
            k++;
          }

          pos.push(numb_tmp + 1);
        }
        for (let k = 0; k < pos.length; k++) {
          for (let h = 0; h < pos.length; h++) {
            if (k != h) {
              bond.push(pos[k] + "-" + pos[h]);
            }
          }
        }
        cpt += 1;
        if (
          name == "Halide alkyl Cl" ||
          name == "Halide alkyl Br" ||
          name == "Halide alkyl I"
        ) {
          cpt_Halide_alkyl += 1;
        } else if (
          name == "Halide aryl Cl" ||
          name == "Halide aryl Br" ||
          name == "Halide aryl I"
        ) {
          cpt_Halide_aryl += 1;
        } else if (
          name == "Halo pyrimidine Cl" ||
          name == "Halo pyrimidine Br" ||
          name == "Halo pyrimidine I"
        ) {
          cpt_Halo_pyrimidine += 1;
        }
        Detected_Functions.push({
          Name: nametemp,
          Position: pos.toString(),
          Name_Func: name,
          Bonds: bond.toString(),
          ID: cpt,
        });
      }
    }
  }
  return Detected_Functions;
};

//Take the result of the python script and generate the rules that we will show on the site
export const ConvertRestultRules = (output) => {
  if (!strictValidArray(output)) return [];
  let name = "";
  let id;
  let tmp = "";
  const Detected_Rules = [];
  for (let i = 0; i < output.length; i++) {
    let j = 0;
    name = "";
    tmp = "";
    while (+output[i][j] >= 0 && +output[i][j] <= 9) {
      tmp += output[i][j];
      j++;
    }
    id = Number(tmp);
    while (output[i][j] == " " || output[i][j] == ":") {
      j++;
    }
    while (j < output[i].length) {
      name += output[i][j];
      j++;
    }
    let trouve = false;
    let h = 0;
    while (!trouve && h < Detected_Rules.length) {
      if (Detected_Rules[h].Name == name) {
        trouve = true;
      }
      h++;
    }
    if (!trouve) {
      const filePath = `assets/Rules_Images/Rule_${
        id < 10 ? "0" : ""
      }${id}_${name.toLocaleLowerCase().replaceAll(" ", "_")}_labeltop.png`;
      Detected_Rules.push({
        checked: false,
        Id: id,
        Name: name,
        Image: filePath,
      });
    }
  }
  return Detected_Rules;
};

export const groupingReactionRules = [
  {
    title: "Commonly used reactions",
    rules: [29, 30, 31, 46, 47, 48, 51, 63, 64, 65, 67, 68, 70],
  },
  {
    title: "Less frequently used reactions",
    rules: [33, 35, 36, 41, 42, 43, 44, 45, 49, 50, 54, 57, 58, 69],
  },
  {
    title: "Uncommon reactions",
    rules: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 32, 34, 37, 38, 39, 40, 52, 53, 55, 56, 61,
      62, 66,
    ],
  },
];
export const groupingSubReactionRules = [
  {
    title: "Accepted",
    substructures: [
      "Active_Phosphate",
      "Cyanamide",
      "Fluorescein",
      "Hydrazothiourea",
      "Michael_Phenyl_Ketone",
      "N-Oxide_aliphatic",
      "Oxobenzothiepine",
      "Oxepine",
      "Phosphoramides",
      "Polysulfide",
      "Pyrylium",
      "Tetraazinane",
      "Thiatetrazolidine",
    ],
    tooltip:
      "Compounds with no structural alerts and satisfying the physicochemical filter.",
  },
  {
    title: "Intermediate",
    substructures: [
      "Acid_anhydrides",
      "Acyl_cyanide",
      "Any_Carbazide",
      "Peroxide",
      "Thiocyanate",
    ],
    tooltip: `Compounds which embeds low-risk structural alerts with a number of occurrences below the threshold.
    (the notion of low risk structural alerts has to be considered within the context of the project, the type of diseases...).
`,
  },
  {
    title: "Rejected",
    substructures: [
      "Acridine",
      "Aromatic_azides",
      "Coumarin",
      "Hydrazone",
      "Isocyanates_isothiocyanates",
      "Nitro",
      "Oxime",
      "Phenanthrene",
      "Phosphorane",
      "Thiazolidinone",
      "Triflate",
    ],
    tooltip:
      "Compounds that do not pass the selected or user defined physicochemical filter.",
  },
];
