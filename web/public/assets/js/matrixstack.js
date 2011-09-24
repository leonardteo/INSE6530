/**
 * Matrix Stack class
 * Mimics OpenGL Matrix Stacks
 * 
 * //Requires glMatrix.js
 */

function MatrixStack(){
	
	//Create array stack
	this.m = [];
	
	//Set the first matrix to identity
	this.m.push(mat4.create());
	mat4.identity(this.m[0]);
	
	
};



MatrixStack.prototype.push = function(){
	
}