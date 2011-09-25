/**
 * Scene graph node for holding and rendering meshes
 * Requires global var gl for holding the gl context
 * @todo - somehow abstract it so that we can pass the gl context in?
 */

function MeshNode(id){
	
	this.id = id;
	
	//For testing purposes let's hold static data for the cube
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
	
	
	//Create color buffer
	this.vertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
	colors = [
	[1.0, 0.0, 0.0, 1.0], // Front face
	[1.0, 1.0, 0.0, 1.0], // Back face
	[0.0, 1.0, 0.0, 1.0], // Top face
	[1.0, 0.5, 0.5, 1.0], // Bottom face
	[1.0, 0.0, 1.0, 1.0], // Right face
	[0.0, 0.0, 1.0, 1.0]  // Left face
	];
	
	var unpackedColors = [];
	for (var i in colors) {
		var color = colors[i];
		for (var j=0; j < 4; j++) {
			unpackedColors = unpackedColors.concat(color);
		}
	}

	//send data to buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	this.vertexColorBuffer.itemSize = 4;
	this.vertexColorBuffer.numItems = 24;
	
	
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

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	

}

//Set parent node
MeshNode.prototype = new Node();

/**
 * Draw the mesh
 * Note: For convenience, we pass the MatrixStack in and take the top matrix
 * when rendering
 * 
 * @param MatrixStack projectionMatrix
 * @param MatrixStack modelViewMatrix
 */
MeshNode.prototype.draw = function(projectionMatrix, modelViewMatrix){
	
	shaderProgram = this.shader.getProgram();
	gl.useProgram(shaderProgram);
	
	//Send data to the shader for drawing
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
	//Send matrices to shader		
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix.getTopMatrix());
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelViewMatrix.getTopMatrix());
	
	//Draw
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
}

