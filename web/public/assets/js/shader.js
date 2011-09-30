/***
* Shader Program class
* A single shader that contains a vertex and fragment shader
* Note: requires global gl context var gl to be initialized 
* @author Leonard Teo
**/

/**
 * Main Shader definition & constructor
 * @param string vertexShader source file
 * @param string fragmentShader source file
 */
function Shader(vertexShader, fragmentShader){
	
	//Initialize properties
	this.program = gl.createProgram();
	this.programReady = false;	//Flag to check if the program is compiled and linked
	
	//Compile and link shaders
	this.compileVertexShader(vertexShader);
	this.compileFragmentShader(fragmentShader);
	
	return this.link();
}

/**
* Link the shader program
*/
Shader.prototype.link = function(){
	
	if (!this.vertexShader){
		console.error("Vertex shader missing");
		return false;
	}
	if (!this.fragmentShader){
		console.error("Fragment shader missing");
		return false;
	}
	if (!this.program){
		console.error("No shader program initialized. Did you pass the GL Context?");
		return false;
	}

	//Attach the shaders
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);

	//Link the programs
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error("Could not initialise shaders");
    }
	
	this.initShaderVars();
	
	//Set this programReady flag to true
	this.programReady = true;	
	
	return true;
}

/**
 * Sets up shader variables
 */
Shader.prototype.initShaderVars = function(){
	//Setup shader vars
	gl.useProgram(this.program);
	
	//Get the vertex position attribute
	this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
	
	//Get the vertex normal attribute
	this.program.vertexNormalAttribute = gl.getAttribLocation(this.program, "aVertexNormal");
	gl.enableVertexAttribArray(this.program.vertexNormalAttribute);

	//Get the texture coordinate attribute
	this.program.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.program.textureCoordAttribute);

	//Get uniforms
	//this.program.samplerUniform = gl.getUniformLocation(this.program, "uSampler");
	this.program.projectionMatrixUniform = gl.getUniformLocation(this.program, "uProjectionMatrix");
	this.program.modelViewMatrixUniform = gl.getUniformLocation(this.program, "uModelViewMatrix");
	this.program.normalMatrixUniform = gl.getUniformLocation(this.program, "uNormalMatrix");
	this.program.samplerUniform = gl.getUniformLocation(this.program, "uSampler");
}

/**
 * Sets the uniform data by pushing it to the shader
 */
Shader.prototype.setUniforms = function(projectionMatrixStack, modelViewMatrixStack){

	//Set the texture sampler
	//gl.uniform1i(this.program.samplerUniform, 0);	//DO WE REALLY NEED THIS?
	
	//Projection Matrix
	gl.uniformMatrix4fv(this.program.projectionMatrixUniform, false, projectionMatrixStack.getTopMatrix());
	
	//ModelViewMatrix
	gl.uniformMatrix4fv(this.program.modelViewMatrixUniform, false, modelViewMatrixStack.getTopMatrix());
	
	//Calculate normal matrix
	normalMatrix = mat3.create();
	mat4.toInverseMat3(modelViewMatrixStack.getTopMatrix(), normalMatrix);
	mat3.transpose(normalMatrix);
		
	gl.uniformMatrix3fv(this.program.normalMatrixUniform, false, normalMatrix);
}

/**
 * Sets the attributes on the shader
 */
Shader.prototype.setAttributes = function(vertexBuffer, textureCoordBuffer, normalBuffer, indexBuffer){

	//Send vertex position to the shader for drawing
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(this.program.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Send UVs
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.vertexAttribPointer(this.program.textureCoordAttribute, textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

	//Send normals
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(this.program.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Send index
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	
}


/**
* Compiles and attaches a vertex shader
**/
Shader.prototype.compileVertexShader = function(url){
	this.vertexShader = this.getAndCompileShader(url, "vertex");
	return this.vertexShader ? true : false;
}

/**
* Compiles and attaches a fragment shader
**/
Shader.prototype.compileFragmentShader = function(url){
	this.fragmentShader = this.getAndCompileShader(url, "fragment");
	return this.fragmentShader ? true : false;
}

/**
* Gets and compiles a vertex or fragment shader
**/
Shader.prototype.getAndCompileShader = function(url, type){

	if (!url || !type){
		console.error("No URL or Type")
		return null;
	}
	
	//Create a new HTTP request
	var request = new XMLHttpRequest();
	if (!request){
		console.error("Couldn't instantiate XMLHttpRequest!");
		return null;
	}

	//Get the text source from the shader
	request.open("GET", url, false);
	request.send(null);
	var shaderString = request.responseText;
	
	
	//Init shader
	var shader;
	if (type == "fragment"){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == "vertex"){
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	
	//Compile shader
	gl.shaderSource(shader, shaderString);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Error compiling shader");
		console.error(gl.getShaderInfoLog(shader));
		return null;
	}
	
	//Return the shader
	return shader;
	
}

/**
 * Get the program
 */
Shader.prototype.getProgram = function(){
	if (this.programReady){
		return this.program;
	}
	console.error("Shader program not compiled/linked");
	return false;
}