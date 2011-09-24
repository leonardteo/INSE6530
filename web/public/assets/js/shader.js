/***
* Shader class
* A single shader that contains a vertex and fragment shader
* @author Leonard Teo
**/


function Shader(glContext){
	if (!glContext){
		console.log("No GL Context sent to shader");
		return;
	}
	this.gl = glContext;
	this.program = this.gl.createProgram();
}

/**
* Link the shader program
*/
Shader.prototype.link = function(){
	
	if (!this.vertexShader){
		console.log("Vertex shader missing");
		return false;
	}
	if (!this.fragmentShader){
		console.log("Fragment shader missing");
		return false;
	}
	if (!this.program){
		console.log("No shader program initialized. Did you pass the GL Context?");
		return false;
	}

	//Attach the shaders
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);

	//Link the programs
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }
	
	return true;
}


/**
* Compiles and attaches a vertex shader
**/
Shader.prototype.compileVertexShader = function(url){
	this.vertexShader = this.getShader(url, "vertex");
	return this.vertexShader ? true : false;
}

/**
* Compiles and attaches a fragment shader
**/
Shader.prototype.compileFragmentShader = function(url){
	this.fragmentShader = this.getShader(url, "fragment");
	return this.fragmentShader ? true : false;
}

/**
* Gets and compiles a vertex or fragment shader
**/
Shader.prototype.getShader = function(url, type){

	if (!url || !type){
		console.log("No URL or Type")
		return null;
	}
	
	//Create a new HTTP request
	var request = new XMLHttpRequest();
	if (!request){
		console.log("Couldn't instantiate XMLHttpRequest!");
		return null;
	}

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
		console.log("Error compiling shader");
		console.log(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
	
}