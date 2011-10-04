/**
 * Mesh container class
 */

/**
 * Load a mesh
 * @param string model path to model
 */
function Mesh(){
	
}

/**
 * Load a mesh using JSON
 */
Mesh.prototype.loadMesh = function(url){
	var vertexBuffer;
	var indexBuffer;
	var textureCoordBuffer;
	var normalBuffer;
	
	
	jQuery.ajax({
		async: false,
		//data: data,
		dataType: 'json',
		url: url,
		success: function(response, textStatus, jqXHR){
			
			//console.log("OBJ Response from server");
			//console.debug(response);
		
			//Load into buffers
			//Load vertices into buffer
			vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(response.vertex_array), gl.STATIC_DRAW);
			vertexBuffer.itemSize = 3;	//3 values per point x, y, z
			vertexBuffer.numItems = response.index_array.length; //24 values that make up cube

			//Load index into buffer
			indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(response.index_array), gl.STATIC_DRAW);
			indexBuffer.itemSize = 1;
			indexBuffer.numItems = response.index_array.length;
			
			//Load texture coordinate buffer
			textureCoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(response.uv_array), gl.STATIC_DRAW);
			textureCoordBuffer.itemSize = 2;
			textureCoordBuffer.numItems = response.uv_array.length;
			
			//Load normalsBuffer
			normalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(response.normals_array), gl.STATIC_DRAW);
			normalBuffer.itemSize = 3;
			normalBuffer.numItems = response.index_array.length;
			
			
		}, 
		error: function(jqXHR, textStatus, errorThrown){
			
		}
		
	});
	
	this.vertexBuffer = vertexBuffer;
	this.indexBuffer = indexBuffer;
	this.normalBuffer = normalBuffer;
	this.textureCoordBuffer = textureCoordBuffer;	
}

/**
 * Load a plane
 * Manually define a plane
 */
Mesh.prototype.loadPlane = function(scale){
	
	
	//Vertex array is two triangles
	var vertex_array = [
		-0.5, 0.0, 0.5,
		-0.5, 0.0, -0.5,
		0.5, 0.0, -0.5,
		0.5, 0.0, 0.5,
		-0.5, 0.0, 0.5,
		0.5, 0.0, -0.5
	];
	
	//Scale the plane
	for (var i=0; i<vertex_array.length; i++){
		vertex_array[i] *= scale;
	}
	
	var uv_array = [
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,
		0.0, 0.0,
		1.0, 1.0
	];
	
	
	var normal_array = [
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0
	];
	
	
	var index_array = [
		0, 1, 2, 3, 4, 5
	];
	
	
	
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_array), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;	//3 values per point x, y, z
	vertexBuffer.numItems = index_array.length; //24 values that make up cube

	//Load index into buffer
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_array), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = index_array.length;
			
	//Load texture coordinate buffer
	textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_array), gl.STATIC_DRAW);
	textureCoordBuffer.itemSize = 2;
	textureCoordBuffer.numItems = index_array.length;
			
	//Load normalsBuffer
	normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_array), gl.STATIC_DRAW);
	normalBuffer.itemSize = 3;
	normalBuffer.numItems = index_array.length;
	
	this.vertexBuffer = vertexBuffer;
	this.indexBuffer = indexBuffer;
	this.normalBuffer = normalBuffer;
	this.textureCoordBuffer = textureCoordBuffer;	
	
}