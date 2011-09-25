/**
 * Matrix Stack Unit Test
 */

module("MatrixStack");


//Test Constructor
test("Constructor", function(){
	matrixStack = new MatrixStack();
	
	expected = mat4.create();
	mat4.identity(expected);
	
	actual = matrixStack.getTopMatrix();
	
	deepEqual(actual, expected);
});


//Test Translation
test("Translate", function(){
	modelView = new MatrixStack();	
	modelView.translate([1,1,1]);
	
	expected = mat4.create();
	mat4.identity(expected);
	mat4.translate(expected, [1,1,1]);

	actual = modelView.getTopMatrix();
	
	deepEqual(actual, expected);
});

//Test Scaling
test("Scaling", function(){
	modelView = new MatrixStack();	
	modelView.scale([1,1,1]);
	
	expected = mat4.create();
	mat4.identity(expected);
	mat4.scale(expected, [1,1,1]);

	actual = modelView.getTopMatrix();
	
	deepEqual(actual, expected);	
});


//Test Rotation
test("Rotation", function(){
	modelView = new MatrixStack();	
	modelView.rotate(90, [0,1,0]);
	
	expected = mat4.create();
	mat4.identity(expected);
	mat4.rotate(expected, 90 * modelView.degrees_to_radians, [0,1,0]);

	actual = modelView.getTopMatrix();
	
	deepEqual(actual, expected);		
});

//Test Push and Pop
test("Push and Pop", function(){
	modelView = new MatrixStack();
	modelView.translate([0,1,0]);
	modelView.push();
	modelView.translate([0,10,0]);
	modelView.push();
	modelView.translate([0,9,0]);
	
	actual = modelView.getTopMatrix();
	
	expected = mat4.create();
	mat4.identity(expected);
	mat4.translate(expected, [0,20,0]);
	
	deepEqual(actual, expected);
	
	modelView.pop();
	actual = modelView.getTopMatrix();
	
	expected = mat4.create();
	mat4.identity(expected);
	mat4.translate(expected, [0,11,0]);
	
	deepEqual(actual, expected);
	
	
	modelView.pop();
	actual = modelView.getTopMatrix();
	
	expected = mat4.create();
	mat4.identity(expected);
	mat4.translate(expected, [0,1,0]);	
	
	deepEqual(actual, expected);

	
	modelView.pop();
	actual = modelView.getTopMatrix();
	
	expected = mat4.create();
	mat4.identity(expected);
	
	deepEqual(actual, expected);
	
});