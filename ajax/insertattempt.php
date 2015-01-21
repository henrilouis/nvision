<?php

	require 'medoo.min.php';

	$database = new medoo();
	$data = $database->insert("attempts",array(

			"userid" 			=> $_POST['userid'],
			"assignment" 		=> $_POST['assignment'],
			"globalfilters"		=> json_encode( $_POST['globalfilters'] ),
			"sheets"			=> json_encode( $_POST['sheets'] ),
			"answer"			=> $_POST['answer'],
			"success"			=> $_POST['success'],
					
	));
	
?>