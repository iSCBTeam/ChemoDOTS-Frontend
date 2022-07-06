// Function creating datas (uids, color, size, opacity) for the highlighting of functions on Sketcher
function createHighlights(parser,source,position, color){
    var highlight= {};
	var xml = parser.parseFromString(source, "text/xml");
    var atom= xml.getElementById('a'+position+'.prop1');
    highlight.uids= {};
    highlight.uids.atoms= [];
    highlight.uids.bonds = highlightsBonds(xml,position);
    highlight.style= {};
    highlight.style.color= color;
    highlight.style.opacity= "0.7";
    highlight.style.size= "1";
    for(i=0; i<position.length;i++){
    	var atom= xml.getElementById('a'+position[i]+'.prop1');
    	if(atom){
    		var uid= atom.textContent;
    		highlight.uids.atoms.push(uid);
   		}
    }
	
    return highlight;
}

function mycreateHighlights(position, color){
	var highlight= {};
    highlight.uids= {};
    highlight.uids.atoms= [];
    highlight.style= {};
    highlight.style.color= color;
    highlight.style.opacity= "0.7";
    highlight.style.size= "1";
    for(i=0; i<position.length;i++){
    	
    	if(atom){
    		var uid= atom.textContent;
    		highlight.uids.atoms.push(uid);
   		}
    }
	
    return highlight;
	
}

// Function permitting the automatic highlighting after the first query 
// Call highlightFnct function
function highlightsFnctAuto(source,arrayInfoFunction){
    $(Object.keys(arrayInfoFunction[1])).each(function(i,e){
    	var colors= arrayInfoFunction[0];
      	var positions= arrayInfoFunction[1];
		highlightsFnct(source,colors,positions,e);
    });
    
 	marvin.setHighlight(highlights);
    return highlights;
}

// Function to retrieve function-specific data (position, color)
// Permits manual and automatic highlighting of functions
function highlightsFnct(source,colors,positions,index){
    var position= positions[index];
    var position= position.replace(/ /g,"");
    var position= position.split(",");
    var color= colors[index];
    highlights[index]= createHighlights(parser,source,position,color);
}

// Function generating data permitting the bonds highlighting from positions (uids) of functions. 
// [REQUIRE] UID : aXaY with int(X) < int(Y) 
function highlightsBonds(xml,listPos){
    listBonds= [];
    sortUIDBond= [];
    for(var i=0; i<(listPos.length)-1; i++){
        if(parseInt(listPos[i]) < parseInt(listPos[i+1])){
        	var X= listPos[i]; var Y= listPos[i+1];
    	}
        else{
        	if(i != 0){
        		if(parseInt(listPos[i-1]) < parseInt(listPos[i+1])){
		        	var X= listPos[i-1]; var Y= listPos[i+1];
        		}else{ 
        			var X= listPos[i+1]; var Y= listPos[i-1]; 
    			}		
        	}else{ 
        		var X= listPos[i+1]; var Y= listPos[i]; 
    		}
    	}   	
    	var bond= xml.getElementById('a'+X+'a'+Y+'.prop1');
    	if(bond){
    		listBonds.push(bond.textContent);
    	}
    };
    return listBonds;
}
