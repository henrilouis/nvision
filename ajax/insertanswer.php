<?php

	require 'medoo.min.php';

	$database = new medoo();
	$data = $database->insert("questionnaire",array(

			"userid" 			=> $_POST['userid'],
			"questionid" 		=> $_POST['questionid'],
			"answer"			=> $_POST['answer'],
					
	));

?>