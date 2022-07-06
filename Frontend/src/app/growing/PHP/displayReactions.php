<?php

if($_SERVER['REQUEST_METHOD'] == "POST"){
    if(!empty($_POST['smilesMolecule'])){
    	
		
        require_once ("Functions/staticData.php");
        require_once ("Functions/arrayTreated.php");
        
        
        $listReactions= array(); // List of reactions compatible with the chemical functions detected
        $listFunctions= array(); // List of chemical functions detected with the main informations (color, position, priority)
        $listIdSMARTs= array(); // List of IDs of SMARTs detected 
        $listColor= array();
		$listPosition= array();
		$listWarning= array();
		$WarningMsg= null;
        
        $PATH_jcsearch= "/opt/chemaxon/jchemsuite/bin/jcsearch";
        //$PATH_jcsearch= "/mnt/c/'Program Files'/ChemAxon/JChemSuite/bin/jcsearch.exe";
        //$PATH_jcsearch= "/Applications/chemaxon/JChemSuite/bin/jcsearch";
        $SMILES=  htmlspecialchars($_POST['smilesMolecule'],ENT_NOQUOTES);
		
// Establishment of possible reactions on the molecule. 
// First condition : Presence of a heteroatom (N,O,S,Cl,Br,I) in SMILES
// Second condition : Detection of a chemical function in SMILES
        if(!empty(atomPresents($SMILES)) AND $_POST['search'] != "Validate"){
            if(!isset($AP)) $AP= atomPresents($SMILES); // List each heteroatom present in the SMILES in multiple
			$countEachAtom= array_count_values($AP); // Counts the number of heteroatoms of the same type
			$AP= atomPresents($SMILES,true); // List the number of different heteroatoms at once
			
            for($i=0; $i<count($AP); $i++){                 
                $listSMARTs= getSMARTs($AP[$i]); // Recovery of all SMARTs corresponding to each atom present in the SMILES
				$countAtom= 0; 
				
                for($j=0; $j<count($listSMARTs); $j++){
                    $SMARTs= key($listSMARTs); 
                    $idSMARTs= $listSMARTs[$SMARTs];
                    
                    $jcsearch= shell_exec($PATH_jcsearch." --allHits -q '".$SMARTs."' -f smiles -s '".$SMILES."'");
                    if(!preg_match('/Query has no match/',$jcsearch)){ 
                    	if(!preg_match('/Query has 1 match/',$jcsearch)){
                    		$WarningMsg= "The function ".getNameFunction($idSMARTs)." is present more than once.";
							$listWarning[]= $WarningMsg;
                    	}
                        preg_match_all("/\[([^\]]{1,})\]/", $jcsearch, $pos);
                        $listPosition[]= implode(",",extractDataArrays($pos,"1"));
                		$listColor[]= getColor($AP[$i]);
                        $listIdSMARTs[]= $idSMARTs;
                        $listFunctions[]= array(getNameFunction($idSMARTs),implode(",",$pos),$color,priorityChemicalFunction($idSMARTs),$WarningMsg);
						$countAtom++;
						if($countAtom == $countEachAtom[$AP[$i]]){
							break 1; // Stops the loop as soon as all the chemical functions including the heteroatom are discovered
						}
                    }
					$WarningMsg = "";
                    next($listSMARTs);
                }
            }
        }
		
		if(count($listFunctions) > 1  AND $_POST['search'] != "Validate"){
			$listFunctions[count($listFunctions)]= 0;
            header('Content-Type: application/json');
            echo json_encode(array($listFunctions,$listPosition,$listColor,$listWarning,$listIdSMARTs));
        }
		else if(count($listFunctions) < 1  AND $_POST['search'] != "Validate"){
			if(empty($AP)) $error= "No reaction was found. Your molecule does not have an reactive chemical function.";
			else $error= "No reaction was found";
			echo json_encode(array(0,$error));
		}
        else{
			if(isset($_POST['listIdSMARTs'])){
				extract($_POST);
			}
        	for($i=0; $i<count($listIdSMARTs);$i++){
	        	$idSMARTs= $listIdSMARTs[$i];
	        	$listReactions[]= array(getNameFunction($idSMARTs),getReactions($idSMARTs));            
   			}
			$listReactions[count($listReactions)]= getNameReactions();
	   		header('Content-Type: application/json');
			echo json_encode(array($listReactions,$listPosition,$listColor,$listWarning,$listIdSMARTs));
        }
   	}
}



?>
