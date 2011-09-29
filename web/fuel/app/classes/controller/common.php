<?php
/**
 * Common Ajax Functions
 */

class Controller_Common extends \Fuel\Core\Controller_Rest
{
	/**
	 * Get model
	 */
	public function get_model()
	{
		if (!Input::get('file'))
		{
			$this->response(array('status' => 'fail', 'message' => 'No mesh provided'));
			return;
		}
		
		//Try loading the mesh
		try {
			$obj_model = new OBJModel(ASSETS_PATH."models/".Input::get('file'));
			
			//get only the data we need
			$output['vertex_array'] = $obj_model->vertex_array;
			$output['uv_array'] = $obj_model->uv_array;
			$output['normals_array'] = $obj_model->normals_array;
			$output['index_array'] = $obj_model->index_array;
			
			echo json_encode($output);
			exit();
			
			//var_dump($obj_model);
			
			//$this->response($obj_model);
			
			
		} catch (OBJFileReadException $e) {
			echo $e->getMessage();
			return;
		}
		
		
	}
	
}