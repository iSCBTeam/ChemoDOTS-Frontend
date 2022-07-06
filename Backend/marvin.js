// Function generating the SMILES
function generateSMILES(smilesFieldName){
	marvin.on("molchange",function(){
		marvin.exportStructure("smiles").then(function(smiles){
			$(smilesFieldName).val(smiles);
		});
	});
}

// Function generating the fragment from the SMILES
function generateMolSketcher(smilesFieldName){
	var smiles= $(smilesFieldName).val();
	if(smiles == ""){
		marvin.clear();
	}
	marvin.importStructure("smiles",smiles);
}



// Function generating the template from URL indicated on template configuration field
function updateTemplates(url){
	var settings = {
			"templateurl": url
	};
	//console.log(marvin.getDisplaySettings());
	marvin.setDisplaySettings(settings);
	
	
}

/*
		//Function generating the SMILES
		ChemicalizeMarvinJs.createEditor("#marvin-test").then(function (marvin) {
		
    
            function generateSMILES() {
                marvin.exportStructure("smiles").then(function (smiles) {
                	document.getElementById("SMILESField").innerHTML = smiles;
                });
            }
		
	
            marvin.on("molchange", generateSMILES);
 
        
	});
	
	
	
	 // Function generating the fragment from the SMILES
	
		function generateMolSketcher(smilesMolecule){
			var smiles= $(smilesMolecule).val();
			if(smiles == ""){
			marvin.clear();
			}
			
			marvin.importStructure("smiles",smiles);
		}
*/
