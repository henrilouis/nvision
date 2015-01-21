<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->update("users",array(

			"email" 		=> $_POST['email'],
			"age" 			=> $_POST['age'],
			"gender"		=> $_POST['gender'],
			
	),
	array(
			"id"			=> $_POST['id']
	));

?>