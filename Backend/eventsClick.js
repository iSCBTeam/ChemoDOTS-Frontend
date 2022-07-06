// Manager function to send the data after the first and second request
function eventSubmit(smilesFieldName,target){
	$("input[name=search]").click(function(event){
        event.preventDefault();
        var smiles= $(smilesFieldName).val();
        if(smiles != ""){
	        var detailView= $("select[name=detailView]").val();
	        var url= "PHP/displayReactions.php";
	        var checkArray= Array();
	        var submit= $(this).val();
	        if(typeof $("input[name='listIdSMARTs[]']").val() !== "undefined"){
		        $("input[name='listIdSMARTs[]']").each(function(){
					if($(this).is(':checked')){
					   checkArray.push($(this).val());
				  }
				});
	        }
	        generateMolSketcher(smilesFieldName);
	        disabledFormSettings(smilesFieldName);
	        ajaxPost(url,target,smiles,checkArray,submit);
        }else FieldEmptyCSS(smilesFieldName);
        
    });
}

// Function to cancel the display of query results
function eventCancel(){
	$(".btnCancel").click(function(){
		var cssField= {opacity: "1", cursor: "auto",};
		if($("div.error").css("display") == "block") $("div.error").css("display","none");
		$("div.contain:nth-child(3)").find("fieldset").remove();
		$("div.contain:nth-child(3)").css("display","none");
		$("div#displayReactions").find("div").empty();
		$("div.contain:nth-child(4)").css("display","none");
		
		$("input[name=cancel]").css("display","none");
		$("input[value='Search compatible reactions']").css("display","inline");
		$("input[name=generateMol]").css("display","inline");
		$(".fieldSMILES").css(cssField).removeAttr("readonly");
		$(".fieldTmplte").css(cssField).removeAttr("disabled");
		$("#sketch").css("pointer-events", "auto");
	});
}


// Disabling setting fields after queries
function disabledFormSettings(smilesFieldName){
	var cssField= {opacity: "0.6", cursor: "not-allowed",};
	$("input[name=cancel]").css("display","inline");
	$("input[value='Search compatible reactions']").css("display","none");
	$("input[name=generateMol]").css("display","none");
	if($(smilesFieldName).css("border") == "1.99653px solid rgb(202, 77, 73)"){
		$(smilesFieldName).css("border","0.5px solid rgba(0,0,0,0.3)");
		$("p.emptyFieldSMILES").remove();
	}
	$(".fieldSMILES").css(cssField).attr("readonly","readonly");
	$(".fieldTmplte").css(cssField).attr("disabled","disabled");
	$("#sketch").css("pointer-events", "none");
}

// Function allowing the suppression of the displayed reactions
function dltRctions(){
	$(".fa-delete").on("click", function(){
		var parent= $(this).parents();
		parent[1].remove();
    });
}


function FieldEmptyCSS(smilesFieldName){
	$(smilesFieldName).css("border","2px solid #CA4D49");
	$(smilesFieldName).before("<p class='emptyFieldSMILES'>Filling SMILES field</p>");
}


function loading(imgGif){
    $(document).ajaxStart(function() {
          $("#loading").show();
    });
    $(document).ajaxStop(function(){
        $("#loading").hide();
    });
}