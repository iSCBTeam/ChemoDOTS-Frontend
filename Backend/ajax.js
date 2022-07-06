/********* AJAX Functions ********/
// Manages the sending and retrieval of data from PHP
function ajaxPost(url,target,smiles,option1,option2){
	$.post(
	    url,
	    {
	    	smilesMolecule : smiles,
			listIdSMARTs: option1,
	    	search: option2,
		},  
	    function(data){
	    	if(data[0] !== 0){
	    		console.log(data);
				infoFunction= ajaxTreatment(data,option1); // Variable with global scope essential for the operation of the current code    	    
	    	}
	    },
	    'json'
	)
	.done(function(data){
    	eventCancel(); //Canceling requests to modify the SMILES or the molecule
		if(data[0] !== 0){ 
			MsgWarning();
			SuccessChoiceFunction();
			dltRctions();
    	}else{
    		$(".error").css("display","block");
			$("#displayError").html(data[1]);
    	}		
	});
}


// Manages the recovery of results from PHP
function ajaxTreatment(data,option1){
		$(".error").css("display","none");
		var infoFunction= infoFunctions(data); 
		if(data[0][data[0].length-1] == 0){ // If more than one chemical function detected
		FormSelectFunctions(data);
		}
		else{
			displayReactions(data,option1); 
			$("div.contain:nth-child(4)").css("display","block");
		}
		return infoFunction;
}

// Permits highlighting of chemical functions
// mainJS.js
function ajaxEventHighlight(infoFunction){
	/*** Start block : Permit to retrieve datas to highlight chemical functions checked  
	     Console : All data is recovered (see console line 159) and sent to the AutoHighlight Function 
	     Display : The highlighting appears randomly. Walk only partially after the second request***/
	if(typeof $("input:checked[name='listIdSMARTs[]']").val() != "undefined"){
		var color= new Object;
		var position= new Object;
		$("input:checked[name='listIdSMARTs[]']").each(function(){
			var idSMARTs= $(this).val();
			color[idSMARTs]= infoFunction[0][idSMARTs];
			position[idSMARTs]= infoFunction[1][idSMARTs]; 
		});
		dataHighlights= [color,position];
	/*** End block ***/
	}else dataHighlights= infoFunction;
	//console.log(dataHighlights);
 	marvin.exportStructure('mrv', { hasUID: true}).then(function(marvinSource) {
		source = marvinSource;
		highlights= highlightsFnctAuto(source,dataHighlights);
	});
}

// Highlighting and removing highlighting by user action by checking or unchecking the appropriate checkboxes
// Corresponding checkboxes are displayed in « Choice of chemical function » 
function SuccessChoiceFunction(){
	$("input[name='listIdSMARTs[]']").click(function(){
        var index= $(this).val(); // Retrieving the position (ID) of targeted chemical function
        if(!$(this).is(':checked')) delete highlights[index];  
        else highlightsFnct(source,infoFunction[0],infoFunction[1],index);
        marvin.setHighlight(highlights); 
        //sessionStorage.setItem('dataFunction', JSON.stringify(highlights));
    });
}

// Displaying a warning message if several of the same functions exist
function MsgWarning(){
	dataFunction = JSON.parse(sessionStorage.getItem("dataFunction"));
	console.log(sessionStorage["dataFunction"]);
	for(i=0; i<Object.keys(dataFunction[2]).length; i++){
		console.log(dataFunction[2]);
		console.log(dataFunction[2][i]);
		if((typeof dataFunction[2][i] !== "undefined")){
			$("#msgWarning").append("<div>"+dataFunction[2][i]+"</div>");
		}
	}
}


/******** Generate HTML elements and arrays from data from PHP ********/
// Retrieving data for each chemical function (color, position) and saving in an array
function infoFunctions(data){
	var dataFunction= sessionStorage.getItem("dataFunction");
	
	if(typeof sessionStorage["dataFunction"] == 'undefined'){
		var colors = new Object();
		var positions= new Object();
		var msgWarning= new Object();
		var idSMARTs= data[4];
		$(data[1]).each(function(index,element){
			positions[idSMARTs[index]]= data[1][index];
			colors[idSMARTs[index]]= data[2][index];
			msgWarning[index]= data[3][index];
		});
		dataFunction= [colors,positions,msgWarning];
		sessionStorage.setItem('dataFunction', JSON.stringify(dataFunction));
	}
	return dataFunction;
}

// Displays reactions by chemical function
function displayReactions(data,option1){
		var idSMARTs= data[0][data[0].length-1];
        document.getElementById('displayReactions').innerHTML = "";
  		$(data[0]).each(function(index, element){
			if(index == data[0].length-1) return false;
			var table= document.createElement("table");
  			var caption= document.createElement("caption");
      		caption.insertAdjacentHTML('beforeend', "<i class='fas fa-times-circle fa-delete'></i> ");   
			table.appendChild(caption);       	
          	caption.insertAdjacentHTML('beforeend', element[0]);
          	$(element[1]).each(function(i,e){
            	var tr= document.createElement("tr");
            	var tdNameReaction= document.createElement("td");
            	var tdImgReaction= document.createElement("td");
            	var tdInput= document.createElement("td");          	
            	table.appendChild(tr);
	            tr.appendChild(tdNameReaction);
	            tr.appendChild(tdImgReaction);
	            tr.appendChild(tdInput);
	            tdInput.setAttribute("style","display:none");
          		tdNameReaction.insertAdjacentHTML('beforeend', "<i class='fas fa-times-circle fa-delete'></i> "+idSMARTs[e]);
          		tdImgReaction.insertAdjacentHTML('beforeend', "<img src='IMG/dots-reactions/"+e+".png' />");
          		tdInput.insertAdjacentHTML('beforeend', "<input type='hidden' name='reaction[]' value='"+e+"' form='formSmiles' />");
          	});
			document.getElementById('displayReactions').appendChild(table);
          });
}

// Generates checkboxes for selection of chemical functions
function FormSelectFunctions(data){
	$("div.contain:nth-child(3)").css("display","block");
	var fieldset= document.createElement("fieldset");
	var idSMARTs= data[4];
	$(data[0]).each(function(index,element){
		if(index == data[0].length-1) return false;
		var label= document.createElement("label");
		var inputBox= document.createElement("input");
		var span= document.createElement("span");
		label.setAttribute("class","avalaibleFunc");
		inputBox.setAttribute("type","checkbox");
		inputBox.setAttribute("name","listIdSMARTs[]");
		inputBox.setAttribute("value",""+idSMARTs[index]+"");
		console.log(element);
		if(element[3] == "priority"){
			inputBox.setAttribute("checked","checked");
			label.setAttribute("class","avalaibleFunc "+element[3]);
		}
		inputBox.setAttribute("id",""+element[0].replace(/ /g, "")+"");	
		span.setAttribute("class","checkCustomized");	
		label.setAttribute("for",""+element[0].replace(/ /g, "")+"");
		fieldset.appendChild(label);
		label.appendChild(inputBox);
		label.appendChild(span);
		label.insertAdjacentHTML('beforeend',element[0]);
	});
	var inputSubmit= document.getElementById('selectFunctions').children[1];
	inputSubmit.before(fieldset);				
}


