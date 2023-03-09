export interface UndesiredSubstructures {
  Name:string;
  Smart:string;
}

export const Undesired_substructures_DATA_BASE:UndesiredSubstructures[]=[
  {Name:"Acid_anhydrides",Smart:"C(=O)OC(=O)"},
  {Name:"Acridine",Smart:"c1c2cc4ccccc4nc2ccc1"},
  {Name:"Active_Phosphate",Smart:"P(=S)([OH1,O$(O[#6])])([OH1,O$(O[#6])])[S,O]"},
  {Name:"Acyl_cyanide",Smart:"C(=O)-C#N"},
  {Name:"Any_Carbazide",Smart:"O=*N=[N+]=[N-]"},
  {Name:"Aromatic_azides",Smart:"cN=N=N"},
  {Name:"Coumarin",Smart:"c1cc2C=CC(=O)Oc2cc1"},
  {Name:"Cyanamide",Smart:"N[CH2]C#N"},
  {Name:"Fluorescein",Smart:"c1cc(O)cc(OC(=CC(=O)C=C3)C3=C2)c12"},
  {Name:"Hydrazone",Smart:"[#6]C(=!@NNa)[#6]"},
  {Name:"Hydrazothiourea",Smart:"N=NC(S)N"},
  {Name:"Isocyanates_&_isothiocyanates",Smart:"N=C=[S,O]"},
  {Name:"Michael_Phenyl_Ketone",Smart:"c1ccccc1C(=O)C=!@CC(=O)!@*"},
  {Name:"Nitro",Smart:"[#6]N(~O)~O"},
  {Name:"N-Oxide_aliphatic",Smart:"[N+!$(N=O)][O-X1]"},
  {Name:"Oxime",Smart:"[#6]C(=!@N[$(OC),$([OH])])[#6]"},
  {Name:"Oxobenzothiepine",Smart:"C1(=O)C=CCSC=C1"},
  {Name:"Oxepine",Smart:"O1C=CC=CC=C1"},
  {Name:"Peroxide",Smart:"[#8]~[#8]"},
  {Name:"Phenanthrene",Smart:"c12cccc3c1c4c(cc3)cccc4cc2"},
  {Name:"Phosphoramides",Smart:"NP(=O)(N)N"},
  {Name:"Phosphorane",Smart:"C=P"},
  {Name:"Polysulfide",Smart:"*[SX2][SX2][SX2]*"},
  {Name:"Pyrylium",Smart:"c1ccc[o+]c1"},
  {Name:"Tetraazinane",Smart:"C1NNC=NN1"},
  {Name:"Thiatetrazolidine",Smart:"[$(Sc1nnn[nH,n-]1),$(Sc1nn[nH,n-]n1)]"},
  {Name:"Thiazolidinone",Smart:"O=C1CSCN1"},
  {Name:"Thiocyanate",Smart:"SC#N"},
  {Name:"Triflate",Smart:"OS(=O)(=O)(C(F)(F)(F))"},
]
