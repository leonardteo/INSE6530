/***
* Shader Program class
* A single shader that contains a vertex and fragment shader
* @author Leonard Teo
**/

/**
 * Main Shader definition & constructor
 */
function Shader(glContext){
	if (!glContext){
		console.error("No GL Context sent to shader");
		return;
	}
	
	//Initialize properties
	this.gl = glContext;
	this.program = this.gl.createProgram();
	this.programReady = false;	//Flag to check if the program is compiled and linked
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
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);

	//Link the programs
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error("Could not initialise shaders");
    }
	
	this.programReady = true;
	return true;
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