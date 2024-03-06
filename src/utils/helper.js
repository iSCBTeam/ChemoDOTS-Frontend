import { strictValidArray } from "./commonUtils";

// Convert the result from the python script for function
export const ConvertResultFunction = (output, currentSmilesCode) => {
  let next_ids = {};

  const gen_next_id = name => {
    if (!next_ids[name])
      next_ids[name] = 1;

    let id = next_ids[name];
    next_ids[name]++;
    return id;
  };

  const is_single = name => {
    if (!next_ids[name])
      return true;

    return next_ids[name] <= 2;
  };

  return output
    .flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)])
    .flatMap(([name, val]) => val
      .replaceAll(/\s/g, "")
      .replace(/^\(\((.*)\),?\)$/g, "$1")
      .split(/\),\(?/g)
      .map(grp => {
        let id = gen_next_id(name);
        let atoms = grp
          .split(",")
          .map(atom => (atom | 0) + 1);

        return {
          ID: id,
          Name_Func: name,
          Position: atoms.join(","),
          Bonds: atoms
            .flatMap((atom, idx, atoms) => atoms
              .slice(idx + 1)
              .map(next_atom => `${atom}-${next_atom}`)
            )
            .join(","),
        };
      })
      .map(obj => ({
        ...obj,
        Name: is_single(obj.Name_Func) ? obj.Name_Func : `${obj.Name_Func} ${obj.ID}`,
      }))
    );
};

//Take the result of the python script and generate the rules that we will show on the site
export const ConvertRestultRules = (output) => {
  if (!strictValidArray(output)) return [];

  const Detected_Rules = [];
  for (let reaction of output) {
    const filePath = `assets/Rules_Images/Rule_${
      reaction.id < 10 ? "0" : ""
    }${reaction.id}.png`;
    Detected_Rules.push({
      checked: false,
      Id: reaction.id,
      Name: reaction.name,
      Image: filePath,
    });
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
    title: "Usually safe",
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
