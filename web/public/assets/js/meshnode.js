/**
 * Scene graph node for holding and rendering meshes
 * Requires global var gl for holding the gl context
 * @todo - somehow abstract it so that we can pass the gl context in?
 */

function MeshNode(id){
	
	this.id = id;

}

//Set parent node
MeshNode.prototype = new Node();

/**
 * Render the mesh to the opengl context
 * Note: For convenience, we pass the MatrixStack in and take the top matrix
 * when rendering
 * 
 * @param MatrixStack projectionMatrix
 * @param MatrixStack modelViewMatrix
 */
MeshNode.prototype.render = function(projectionMatrixStack, modelViewMatrixStack){
	
	//Set the shader program to use
	gl.useProgram(this.shader.getProgram());
	
	//Set the texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture.gltexture);
   
	//Sent attributes to shader
	this.shader.setAttributes(this.vertexBuffer, this.textureCoordBuffer, this.normalBuffer, this.indexBuffer);
	
	//Send matrices to shader	
	this.shader.setUniforms(projectionMatrixStack, modelViewMatrixStack);
	
	//Draw
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
}

/**
 * Load an OBJ json model
 */
MeshNode.prototype.loadOBJModel = function(model){
	
	//data = {};
	//data.file = model;
	
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
			
			console.log("OBJ Response from server");
			console.debug(response);
		
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
 * Loads a texture into this object
 * @param string filename
 */
MeshNode.prototype.loadTexture = function(filename){
	this.texture = new Texture(filename);
}

/**
 * Attaches a texture object to this meshnode
 * @param Texture texture
 */
MeshNode.prototype.attachTexture = function(texture){
	this.texture = texture;
}

/**
 * Loads a shader from source
 * @param string vertexShader path to vs
 * @param string fragmentShader path to fs
 */
MeshNode.prototype.loadShader = function(vertexShader, fragmentShader){
	this.shader = new Shader(vertexShader, fragmentShader);
}

/**
 * Attaches a shader program to this meshnode
 * @param Shader shader
 */
MeshNode.prototype.attachShader = function(shader){
	this.shader = shader;
}
