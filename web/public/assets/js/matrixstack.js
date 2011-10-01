/**
 * Matrix Stack class
 * Mimics OpenGL Matrix Stacks
 * 
 * //Requires glMatrix.js
 */

function MatrixStack(){
	
	//Set degrees to radians
	this.degrees_to_radians = 0.0174532925;
	
	//Create array stack
	this.m = [];
	
	//Set the first matrix to identity
	this.m.push(mat4.create());
	mat4.identity(this.m[0]);
	
};

/**
 * Returns the top matrix on the stack
 */
MatrixStack.prototype.getTopMatrix = function(){
	return this.m[this.m.length-1];
}

/**
 * "Remember" the current position by pushing the
 * current matrix onto the stack
 */
MatrixStack.prototype.push = function(){
	
	//Clone the top matrix
	var clone = mat4.create(this.getTopMatrix());
	
	this.m.push(clone);
	
}

/**
 * Pop the current matrix off the stack
 */
MatrixStack.prototype.pop = function(){
	//Check the length
	//If length is 1, 
	if (this.m.length == 1){
		this.m.pop();
		var identity = mat4.create();
		mat4.identity(identity);
		this.m.push(identity);
	} else {
		this.m.pop();
	}
	
}

/**
 * Identity - reset the matrix to identity
 */
MatrixStack.prototype.identity = function(){
	mat4.identity(this.m[this.m.length-1]);
}

/**
 * Scale
 * @param vec3/array scale
 */
MatrixStack.prototype.scale = function(vec){
	mat4.scale(this.m[this.m.length-1], vec);
}

/**
 * Rotate
 * @param float angle in degrees
 * @param vec3/array axis 
 */
MatrixStack.prototype.rotate = function(angle, axis){
	mat4.rotate(this.m[this.m.length-1], angle * this.degrees_to_radians, axis);
}

/**
 * Translate
 * @param vec3/array translation
 */
MatrixStack.prototype.translate = function(vec){
	mat4.translate(this.m[this.m.length-1], vec);
}

/**
 * Perspective Matrix
 */
MatrixStack.prototype.perspective = function(fovy, aspect, znear, zfar){
	mat4.perspective(fovy, aspect, znear, zfar, this.m[this.m.length-1]);
}