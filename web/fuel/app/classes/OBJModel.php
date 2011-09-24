<?php

/***
 * OBJModel Class
 * @author Leonard Teo
 * 
 * This class enables reading an OBJ File and returning a JSON string of elements for WebGL
 */

class OBJModel
{

	//Data members
	public $num_vertices;
	public $num_faces;
	public $num_uvs;
	public $num_normals;
	
	//OBJ data arrays
	public $vertices = array();
	public $normals = array();
	public $uvs = array();
	public $vertex_index = array();
	public $normals_index = array();
	public $uv_index = array();
	
	//Straight run arrays
	public $vertex_array = array();
	public $normals_array = array();
	public $uv_array = array();
	public $index_array = array();
	

	/**
	 * Constructor
	 */
	public function __construct($filename = NULL)
	{
		if ($filename === NULL)
		{
			throw new OBJFileReadException("No filename specified");
		}
		
		$this->load_file($filename);
	}

	/**
	 * Load a file into memory
	 */
	public function load_file($filename)
	{


		//Load the file into a string
		$lines = file($filename);
		if ($lines === FALSE)
		{
			throw new OBJFileReadException("Couldn't read file $filename");
		}
		
		//Step 1: Load the OBJ file into local memory
		foreach ($lines as $buffer)
		{
			
			switch ($buffer[0])
			{
				case 'v':
					
					switch ($buffer[1])
					{
						case ' ':
							$this->num_vertices++;
							
							//Create the new vertex
							$vertex = new Vector3();
							sscanf($buffer, "v %f %f %f", $vertex->x, $vertex->y, $vertex->z);
							$this->vertices[] = $vertex;
							break;
						
						case 'n':
							$this->num_normals++;
							
							//Create new normal
							$normal = new Vector3();
							sscanf($buffer, "vn %f %f %f", $normal->x, $normal->y, $normal->z);
							$this->normals[] = $normal;
							break;
						
						case 't':
							$this->num_uvs++;
							
							//Create the new UV
							$uv = new UV();
							sscanf($buffer, "vt %f %f", $uv->u, $uv->v);
							$this->uvs[] = $uv;
							
							break;
					}
					
					break;
				case 'f':
					
					//Create the face
					$vertex_face = array();
					$uv_face = array();
					$normal_face = array();
					
					sscanf($buffer, "f %d/%d/%d %d/%d/%d %d/%d/%d", 
							$vertex_face[0], $uv_face[0], $normal_face[0],
							$vertex_face[1], $uv_face[1], $normal_face[1],
							$vertex_face[2], $uv_face[2], $normal_face[2]
					);
					
					//decrement all indices to cater for OpenGL (OBJ indices start at 1)
					for ($i=0; $i<3; $i++)
					{
						$vertex_face[$i]--;
						$uv_face[$i]--;
						$normal_face[$i]--;
					}
					
					$this->vertex_index[] = $vertex_face;
					$this->uv_index[] = $uv_face;
					$this->normals_index[] = $normal_face;
					
					$this->num_faces++;
					break;
			}
			
		}
		
		//Step 2: Run through the local data arrays and convert them into elements that can be used for a straight glDrawElements march
		for ($face = 0; $face < $this->num_faces; $face++)
		{
			//Get vertex numbers
			$v1 = $this->vertex_index[$face][0];
			$v2 = $this->vertex_index[$face][1];
			$v3 = $this->vertex_index[$face][2];
			
			//Get normals number
			$n1 = $this->normals_index[$face][0];
			$n2 = $this->normals_index[$face][1];
			$n3 = $this->normals_index[$face][2];
			
			//Get UVs
			$uv1 = $this->uv_index[$face][0];
			$uv2 = $this->uv_index[$face][1];
			$uv3 = $this->uv_index[$face][2];
			
			//Element 1
			$this->uv_array[] = $this->uvs[$uv1]->u;
			$this->uv_array[] = $this->uvs[$uv1]->v;
			
			$this->normals_array[] = $this->normals[$n1]->x;
			$this->normals_array[] = $this->normals[$n1]->y;
			$this->normals_array[] = $this->normals[$n1]->z;
			
			$this->vertex_array[] = $this->vertices[$v1]->x;
			$this->vertex_array[] = $this->vertices[$v1]->y;
			$this->vertex_array[] = $this->vertices[$v1]->z;
			
			//Element 2
			$this->uv_array[] = $this->uvs[$uv2]->u;
			$this->uv_array[] = $this->uvs[$uv2]->v;
			
			$this->normals_array[] = $this->normals[$n2]->x;
			$this->normals_array[] = $this->normals[$n2]->y;
			$this->normals_array[] = $this->normals[$n2]->z;
			
			$this->vertex_array[] = $this->vertices[$v2]->x;
			$this->vertex_array[] = $this->vertices[$v2]->y;
			$this->vertex_array[] = $this->vertices[$v2]->z;
			
			//Element 3
			$this->uv_array[] = $this->uvs[$uv3]->u;
			$this->uv_array[] = $this->uvs[$uv3]->v;
			
			$this->normals_array[] = $this->normals[$n3]->x;
			$this->normals_array[] = $this->normals[$n3]->y;
			$this->normals_array[] = $this->normals[$n3]->z;
			
			$this->vertex_array[] = $this->vertices[$v3]->x;
			$this->vertex_array[] = $this->vertices[$v3]->y;
			$this->vertex_array[] = $this->vertices[$v3]->z;			
		}
		
		//Create a straight march array for the index
		for ($i=0; $i<$this->num_faces * 3; $i++)
		{
			$this->index_array[] = $i;
		}
		
	}
	
	
	/**
	 * Returns an object with the elements
	 */
	public function get_elements()
	{
		$out = array();
		$out['index'] = $this->index_array;
		$out['vertices'] = $this->vertex_array;
		$out['normals'] = $this->normals_array;
		$out['uvs'] = $this->uv_array;
		
		return $out;
	}

}

/**
 * Exceptions
 */
class OBJFileReadException extends Exception
{
	
}

/**
 * Vector 3 convenience data container
 */
class Vector3 
{
	public $x;
	public $y;
	public $z;
}

/**
 * UV convenience data container
 */
class UV
{
	public $u;
	public $v;
}