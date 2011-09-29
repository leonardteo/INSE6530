/**
 * Scene graph node for holding and rendering meshes
 * Requires global var gl for holding the gl context
 * @todo - somehow abstract it so that we can pass the gl context in?
 */

function MeshNode(id){
	
	this.id = id;
	
	//For testing purposes let's hold static data for the cube
	/*
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	
	vertices = [
	// Front face
	-1.0, -1.0,  1.0,
	1.0, -1.0,  1.0,
	1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,

	// Back face
	-1.0, -1.0, -1.0,
	-1.0,  1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0, -1.0, -1.0,

	// Top face
	-1.0,  1.0, -1.0,
	-1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
	1.0,  1.0, -1.0,

	// Bottom face
	-1.0, -1.0, -1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0,  1.0,
	-1.0, -1.0,  1.0,

	// Right face
	1.0, -1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0,  1.0,  1.0,
	1.0, -1.0,  1.0,

	// Left face
	-1.0, -1.0, -1.0,
	-1.0, -1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0,  1.0, -1.0
	];
	
	//Send data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;	//3 values per point x, y, z
	this.vertexBuffer.numItems = 24; //24 values that make up cube
	
	
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	var vertexNormals = [
	// Front face
	0.0,  0.0,  1.0,
	0.0,  0.0,  1.0,
	0.0,  0.0,  1.0,
	0.0,  0.0,  1.0,

	// Back face
	0.0,  0.0, -1.0,
	0.0,  0.0, -1.0,
	0.0,  0.0, -1.0,
	0.0,  0.0, -1.0,

	// Top face
	0.0,  1.0,  0.0,
	0.0,  1.0,  0.0,
	0.0,  1.0,  0.0,
	0.0,  1.0,  0.0,

	// Bottom face
	0.0, -1.0,  0.0,
	0.0, -1.0,  0.0,
	0.0, -1.0,  0.0,
	0.0, -1.0,  0.0,

	// Right face
	1.0,  0.0,  0.0,
	1.0,  0.0,  0.0,
	1.0,  0.0,  0.0,
	1.0,  0.0,  0.0,

	// Left face
	-1.0,  0.0,  0.0,
	-1.0,  0.0,  0.0,
	-1.0,  0.0,  0.0,
	-1.0,  0.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = 24;
	
	
	//Create index buffer
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	var cubeVertexIndices = [
	0, 1, 2,      0, 2, 3,    // Front face
	4, 5, 6,      4, 6, 7,    // Back face
	8, 9, 10,     8, 10, 11,  // Top face
	12, 13, 14,   12, 14, 15, // Bottom face
	16, 17, 18,   16, 18, 19, // Right face
	20, 21, 22,   20, 22, 23  // Left face
	];
	
	//Send data to the index buffer
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = 36;
	*/
   
   
   

	//Create and compile the shader
	this.shader = new Shader(gl);

	this.shader.compileVertexShader("/assets/shaders/test.vs");
	this.shader.compileFragmentShader("/assets/shaders/test.fs");
	result = this.shader.link();
		
	if (!result){
		updateStatus("Could not compile/link shader");
		return;
	} else {
		updateStatus("Compiled and linked shaders");
	}
	
	//Setup shader vars
	shaderProgram = this.shader.getProgram();
	gl.useProgram(shaderProgram);
	
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.uvAttribute = gl.getAttribLocation(shaderProgram, "aUV");
	gl.enableVertexAttribArray(shaderProgram.uvAttribute);

	//Get uniforms
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	shaderProgram.normalMatrixUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

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
MeshNode.prototype.render = function(projectionMatrix, modelViewMatrix){
	
	shaderProgram = this.shader.getProgram();
	gl.useProgram(shaderProgram);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture.gltexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	
	//Send vertex position to the shader for drawing
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Send UVs
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
	gl.vertexAttribPointer(shaderProgram.uvAttribute, this.uvBuffer.itemSize, gl.FLOAT, false, 0, 0)

	//Send normals
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Send index
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


	//Send matrices to shader	

	//Projection Matrix
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix.getTopMatrix());
	
	//ModelViewMatrix
	gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix.getTopMatrix());
	
	//Calculate normal matrix
	normalMatrix = mat3.create();
	mat4.toInverseMat3(modelViewMatrix.getTopMatrix(), normalMatrix);
	mat3.transpose(normalMatrix);
		
	gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);
	
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
	var uvBuffer;
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
			
			//Load uvBuffer
			uvBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(response.uv_array), gl.STATIC_DRAW);
			uvBuffer.itemSize = 2;
			uvBuffer.numItems = response.uv_array.length;
			
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
	this.uvBuffer = uvBuffer;
	
	
	
/*
	jQuery.get("/common/model.json", data, function(response){
		console.debug(response);
		
		//Load into buffers
		
		//Load vertices into buffer
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(response.vertex_array), gl.STATIC_DRAW);
		this.vertexBuffer.itemSize = 3;	//3 values per point x, y, z
		this.vertexBuffer.numItems = response.index_array.count; //24 values that make up cube

	//Load index into buffer
		
	}, 'json');
	*/
	
}

/**
 * Loads a texture into this object
 */
MeshNode.prototype.loadTexture = function(filename){
	this.texture = new Texture(filename);
}