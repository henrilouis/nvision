<?php

	require 'medoo.min.php';

	$database = new medoo();

	$max = $database->max("users",'id');
	
	$data = $database->insert("users",array(

			"id"			=> $max+1,
			"useragent" 	=> $_POST['useragent'],
			"resolution"    => json_encode($_POST['resolution']),
			"condition"		=> $_POST['condition']
			
	));
	
	echo $max+1;

?>