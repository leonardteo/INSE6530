/**
 * Mesh container class
 */

/**
 * Load a mesh
 * @param string model path to model
 */
function Mesh(model){
	var vertexBuffer;
	var indexBuffer;
	var textureCoordBuffer;
	var normalBuffer;
	
	
	jQuery.ajax({
		async: false,
		//data: data,
		dataType: 'json',
		url: model,
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