<?php

// Array with main heteroatom present in a molecule.
function atomPresents($smiles,$onceEachElmt=false){
    $atoms= array("N","O","S","Cl","Br","I");
    $search= "N|O|S|Cl|Br|I";
    $smiles= preg_split('/('.$search.')\s*/', $smiles, NULL, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
    return comparisonArray($atoms,$smiles,$onceEachElmt);
}

// Definition of the colors of each chemical function according to the heteroatom
function getColor($idAtom){
    $y= array(
        "N" => "#0686CF",
        "O" => "#FF6243",
        "S" => "#FFE043",
        "X" => "#76FF43",
    );
    if($idAtom == "Br" || $idAtom == "Cl" || $idAtom == "I") $idAtom= "X";
    return $y[$idAtom];
}

// Generate an array $y with SMARTs of different chemical functions
// SMARTs => idSMARTs
function getSMARTs($idAtom){
    if($idAtom == "N"){ // Corresponds to the nitrogen atom
        $y= array(
            "[NX3;H2]" => 1,
            "[NX3;H1]" => 2,
            "[#6]C#N" => 3,
            "[ND1;H2]C([#6])=[ND1;H1]" => 4,
            "[ND1;H2]C([ND2;H1][#6])=[ND1;H1]" => 5,
            "[NH2][NH;R0][#6]" => 6, //*
            "[#6]N=[N+]=[N-]" => 7, //*
            "[NH;R0]([C;R0]([#6])=O)[C;R0]([#6])=O" => 8, //*
            "[#6]C#N" => 9,
            "[#6][#6;R1]-1=[#7;R1]-[#7;R1]=[#7;R1]-[#7;R1]-1[H]" => 10,
            "[#6][#6;R1]-1=[#7;R1]-[#7;R1]([H])-[#7;R1]=[#7;R1]-1" => 11,
            "[NH2]-[c;r6]:[c;r6]-[NH2]" => 12,
            "[NH2]-[c;r6]:[c;r6]-[NH;$(NC);!$(NC(=O))]" => 13, 
            "[nH]1cccc1" => 14, 
            "[nH]1cncc1" => 15, //*
            "[nH]1cccn1" => 16, //*
            "C1C[N,O]1" => 17, //1
            "O=C1[#6]=[#6]C(=O)N1" => 18, //*
            "[C;R0;!$(C=[O,S]);!$(CN)]=[N;R0][#6]" => 19,
            
        );
        return $y;
    }
	elseif($idAtom == "O"){ // Corresponds to the oxygen atom
        $y= array(
            "[#6][C;R0](=O)[OH]" => 20,
            "[#6]N=C=O" => 21, //*
            "[#6]O[C;R0](=[O])[#6]" => 22,
            "[O;R0]([C;R0]([#6])=O)[C;R0]([#6])=O" => 23,
            "[CD2;CX3;R0;+0;!$(C-[#7])](=O)" => 24,
            "[#6][CD3;R0](=O)C" => 25, 
            "[#6][C;R0](=O)[CH2;R0][C;R0]([#6])=O" => 26, 
            "[#6][C;R0](=O)[CH2;R0][CH2;R0][C;R0]([#6])=O" => 27,
            "[#6]B(O)O" => 28, //*
            "[NH2]-[c;r6]:[c;r6]-[OH]" => 29, //*
            "[NH2]-[c;r6]:[c;r6]-[CD2](=[OD1])" => 30, //*
            "[NH2]-[c;r6]:[c;r6]-C(=O)[OH]" => 31, //*
            "CC(=O)-[c;r6]:[c;r6]-C(=O)[OH]" => 32, //*
            "[OH]-[c;r6]:[c;r6]-C(=O)C" => 33, //*
            "[#6][C;R0](=[OD1])[NH2]" => 34, //*
            "[#6][C;R0](=[OD1])[NH][#6]" => 35, //*
            "[c;r6][C;R0]([OH])[C;R0](=O)[c;r6]" => 36, //*
            "[c;r6][C;R0](=O)[C;R0](=O)[c;r6]" => 37, //*
            "O=C1[CH2][CH2][C,N;R1][CH2][CH2]1" => 38, //*
            "C=[N;R0][OH]" => 39, //*
            "[N;R0](~[OD1])~[OD1]" => 40, //*
            "C1C[N,O]1" => 17, //1
            "[C;R0]=[C;R0][C;R0](=O)[#6,#7,#8]" => 42, //*
            "[OH;R0][#6;!$([#6]=[O,S])]" => 64,
        );
        return $y;
    }
	elseif($idAtom == "S"){ // Corresponds to the oxygen atom
        $y= array(
            "[SH;!$(S=O);R0][#6;!$([#6]=[O,S])]" => 43,
            "[#6]N=C=S " => 44, //*
            "[#6]O[C;R0](=[S])[#6]" => 45,
            "[#6][S;R0](=O)(=O)[OH]" => 46, //*
            "[NH2]-[c;r6]:[c;r6]-[SH]" => 47, //*
            "[#6][C;R0](=[SD1])[NH2]" => 48, //*
            "[NH2][S;R0]([#6])(=O)=O" => 49,
            "[#6][NH][S;R0]([#6])(=O)=O" => 50,
            "[#6][O;R0][S;R0](=O)(=O)[#6]" => 51,
            "S(=O)(=O)([CH2,c])F" => 52, //*
            "[C;R0]=[C;R0][S;R0](=O)(=O)[#6,#7,#8]" => 53, //*
            
        );
        return $y;
    }    
	elseif($idAtom == "Cl" || $idAtom == "Br" || $idAtom == "I"){ // Corresponds to a halogen atom
        $y= array(
            "[Cl,Br,I][CH2;R0][CD3;R0](=O)C" => 54,
            "[Cl,Br,I][CH2;R0][CH2;R0][CD3;R0](=O)C" => 55,
            "c[Cl,Br,I]" => 56,
            /*"[C;D2,D3;!$(C=A)][Cl,Br,I]" => 57,
            "[#6]C(=O)[Cl,Br,I]" => 58,
            "[#6]S(=O)(=O)[Cl,Br,I]" => 59,
            "[OH]-[c;r6]:[c;r6]-[Cl,Br,I]" => 60,
            "[NH2]-[c;r6]:[c;r6]-[Cl,Br,I]" => 61,
            "C[S;!$(S=O)]-[c;r6]:[c;r6]-[Cl,Br,I]" => 62,
            "[Cl,Br,I][c;R1]1[n;R1][c;R1][c;R1][c;R1][n;R1]1" => 63,*/
            
        );
        return $y;
    }
}

// Definition of priority chemical functions by their idSMARTs (see getSMARTs function)
function priorityChemicalFunction($IdSMARTs){
	$y= array(1,20);
	for($i=0; $i<count($y); $i++){
		if($IdSMARTs == $y[$i]){
			return "priority";
		}
		$i++;
	}
}

// Definition of compatible reactions by their ID for each chemical function (idSMARTs)
// idSMARTs => idReaction
function getReactions($idSMARTs){
    $y= array(
        1 => array(30,47,48,51),
        2 => array(2),
        3 => array(3),
        4 => array(4),
        5 => array(5),
        6 => array(6),
        7 => array(7),
        8 => array(8),
        9 => array(9),
        10 => array(10),
        11 => array(11),
        12 => array(12),
        13 => array(13),
        14 => array(14),
        15 => array(15),
        16 => array(16),
        17 => array(17),
        18 => array(18),
        19 => array(19),
        20 => array(20),
        21 => array(21),
        22 => array(22),
        23 => array(23),
        24 => array(24),
        25 => array(25),
        26 => array(26),
        27 => array(27),
        28 => array(28),
        29 => array(29),
        30 => array(30),
        31 => array(31),
        32 => array(32),
        33 => array(33),
        34 => array(34),
        35 => array(35),
        36 => array(36),
        37 => array(37),
        38 => array(38),
        39 => array(39),
        40 => array(40),
        41 => array(41),
        42 => array(42),
        43 => array(43),
        44 => array(44),
        45 => array(45),
        46 => array(46),
        47 => array(47),
        48 => array(48),
        49 => array(49),
        50 => array(50),
        51 => array(51),
        52 => array(52),
        53 => array(53),
        54 => array(54),
        55 => array(55),
        56 => array(56),
        64 => array(57),
    );
    return $y[$idSMARTs];
}

// Definition of the name of each chemical function associated with the ID
// idReaction => Name Function
function getNameFunction($idSMARTs){
    $y= array(
        1 => "Primary amine",
        2 => "Secondary amine",
        3 => "Nitrile",
        4 => "Amidine",
        5 => "Guanidinium",
        6 => "Hydrazine",
        7 => "Azide",
        8 => "Imide",
        9 => "Aniline",
        10 => "Acid tetrazole 1",
        11 => "Acid tetrazole 2",
        12 => "Aryl diamine 1",
        13 => "Aryl diamine 2",
        14 => "Pyrrole",
        15 => "Imidazole",
        16 => "Pyrazole",
        17 => "3-epoxide aziridine",
        18 => "Maleimide",
        19 => "Imine",
        20 => "Acid Carboxylic",
        21 => "Isocyanate",
        22 => "Ester",
        23 => "Anhydride",
        24 => "Aldehyde",
        25 => "Ketone",
        26 => "Dicarbonyl 1",
        27 => "Dicarbonyl 2",
        28 => "Acid Boronic",
        29 => "Aryl amine alcohol",
        30 => "Aryl amine aldehyde",
        31 => "Aryl acid amine",
        32 => "Aryl acid acetyl",
        33 => "Aryl alcohol acetyl",
        34 => "Amide 1",
        35 => "Amide 2",
        36 => "Triaryl imidazole 1",
        37 => "Triaryl imidazole 2",
        38 => "Cyclohexanone",
        39 => "Oxyme",
        40 => "Nitro",
        42 => "Michael acceptor like",
        43 => "Thiol",
        44 => "Isothiocyanate",
        45 => "Thioester",
        46 => "Sulfonic acid",
        47 => "Aryl amine thiol",
        48 => "Thioamide",
        49 => "Sulfonamide 1",
        50 => "Sulfonamide 2",
        51 => "Sulfonate ester",
        52 => "Fluorosulfonyl",
        53 => "Vinylsulfonamide like",
        54 => "Ketone-alpha-halide",
        55 => "Ketone-beta-halide",
        56 => "Aryl halide",
        57 => "Alkyl halide",
        58 => "Acyl halide",
        59 => "Sulfonyl halide",
        60 => "Aryl alcohol halogen",
        61 => "Aryl amine halogen",
        62 => "Aryl thiol halogen",
        63 => "Halo pyrimidine",
        64 => "Alcohol",
    );    
    return $y[$idSMARTs];
}

// Definition of the name of each reaction associated with the ID
// idReaction => Name Reaction
function getNameReactions($idReaction=''){
    $y= array(
        1 => "Pictet-Sengler",
        2 => "Benzimidazole carboxylic-acid/ester",
        3 => "Benzimidazole aldehyde",
        4 => "Benzothiazole",
        5 => "Benzoxazole arom-aldehyde",
        6 => "Benzoxazole carboxylic-acid",
        7 => "Thiazole",
        8 => "Niementowski quinazoline",
        9 => "Tetrazole 1-reactant",
        10 => "Tetrazole add-step azide-1",
        11 => "Tetrazole add-step azide-2",
        12 => "Triazole-123 Huisgen add-step azide-1",
        13 => "Triazole-123 Huisgen add-step azide-2",
        14 => "Triazole-123 Huisgen add-step azide-3",
        15 => "Triazole-124 acetohydrazide",
        16 => "Triazole-124 carboxylic-acid/ester add-step hydrazine",
        17 => "Pyridine-nitrile 1reactant",
        18 => "Spiro-chromanone",
        19 => "Pyrazole",
        20 => "Phthalazinone",
        21 => "Pyrrole Paal-Knorr",
        22 => "Triaryl imidazole",
        23 => "Indole Fischer",
        24 => "Quinoline Friedlaender",
        25 => "Benzofuran",
        26 => "Benzothiophen",
        27 => "Indole",
        28 => "Oxadiazole add-step amidoxime",
        29 => "Ether Williamson",
        30 => "Reductive Amination",
        31 => "Suzuki",
        32 => "Indole Piperidine",
        33 => "Negishi add-step zn-halide",
        34 => "Imide Mitsonobu",
        35 => "Phenol-ether Mitsonobu",
        36 => "Sulfonamide Mitsonobu",
        37 => "Tetrazole Mitsonobu 1",
        38 => "Tetrazole Mitsonobu 2",
        39 => "Tetrazole Mitsonobu 3",
        40 => "Tetrazole Mitsonobu 4",
        41 => "Vinyl-terminal Heck",
        42 => "Vinyl Heck",
        43 => "Stille add-step organo-stannane",
        44 => "Carbonyl Grignard add-step magnesium-halide",
        45 => "Alcohol Grignard add-step magnesium-halide",
        46 => "Alkyne Sonogashira",
        47 => "Amide Schotten-Baumann add-step acyl-chloryde",
        48 => "Sulfonamide",
        49 => "N-arylation heterocycles",
        50 => "Wittig add-step ylide-triaryl-phosphine",
        51 => "Amination Buchwald-Hartwig",
        52 => "Imidazole",
        53 => "Decarboxylative-coupling",
        54 => "Amination nucleophilic-subst heteroaromatic",
        55 => "Amination nucleophilic-subst aromatic-nitro-ortho",
        56 => "Amination nucleophilic-subst aromatic-nitro-para",
        57 => "Urea",
        58 => "Thiourea",
    );
    if(!empty($idReaction)) return $y[$idReaction];
    return $y;        
}


?>
