#!/usr/bin/php
<?php
/**
 * This script will take an input obj and output it as a .json file
 */
require_once(__DIR__ . "/../fuel/app/classes/OBJModel.php");

exit(main());

function main()
{

	//Args
	global $argc, $argv;

	if ($argc < 3)
	{
		echo "Usage: objtojson.php <obj file> <output file>" . PHP_EOL;
		exit(1);
	}

	$read_file = $argv[1];
	$write_file = $argv[2];

	echo "Converting OBJ to JSON".PHP_EOL;

	try
	{
		$obj_model = new OBJModel($read_file);

		//get only the data we need
		$output['vertex_array'] = $obj_model->vertex_array;
		$output['uv_array'] = $obj_model->uv_array;
		$output['normals_array'] = $obj_model->normals_array;
		$output['index_array'] = $obj_model->index_array;
		
		$str = json_encode($output);
		
		file_put_contents($write_file, $str);
		
	} catch (OBJFileReadException $e)
	{
		echo "Error with OBJ file: " . $e->getMessage();
		exit(1);
	}

	return 0;
}

