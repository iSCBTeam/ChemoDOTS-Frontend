<?php
if($_SERVER['REQUEST_METHOD'] == "POST"){
	echo "<pre>";print_r($_POST);echo "</pre>";
	if(!empty($_POST['reaction']) && !(empty($_POST['SMILES']))){
		extract($_POST);
		echo "<pre>";print_r($_POST);echo "</pre>";
	}	
}

?>
