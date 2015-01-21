<?php

	require 'medoo.min.php';

	$database = new medoo();
	
	/*****************************************
			Script to echo the DB
	*****************************************/
	
	function echoTable( $name, $database ){

		$data = $database->select($name,"*");
	
		echo "<h2>".$name."</h2>";
		echo "<table>";
		echo "<tr>";
		foreach ( $data[0] as $key => $value ){
			echo "<td>".$key."</td>";
		}
		echo "</tr>";

		foreach ( $data as $key => $value ){
			echo "<tr>";
			foreach ($value as $k => $v) {
				echo "<td>".$v."</td>";
			}
			echo "</tr>";
		}

		echo "</table>";
	}

	echoTable( "users",$database );
	echoTable( "attempts",$database );
	echoTable( "questionnaire",$database );
	
?>