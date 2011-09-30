<?php
/**
 * View fragment for Hello WebGL
 */
?>

<h1>Hello WebGL</h1>

<canvas id="webgl_canvas" style="border: none;" width="640" height="640"></canvas>

<div style="padding-top:10px;">
	<label>Select a model to view:</label>
	<select id="model">
		<option value="quakeplasma">Quake Plasma Rifle</option>
		<option value="m1abrams">M1 Abrams Tank</option>
		<option value="humveehardtop">Humvee</option>
		<option value="uhtiger">UH Tiger Helicopter</option>
	</select>
</div>

<div>
	<h2>Status:</h2>
	<ul id="status">
	</ul>
</div>

<!-- Run time script -->

<script type="text/javascript">

	//Global variables
	var gl;	//OpenGL context
	
	
	var cubeNode;
	var cubeRotation = 0;
	
	var lastTime = 0;	
	
	
	//Start webGL when the DOM is ready...
	jQuery(document).ready(function(){
		main();
		
		jQuery('#model').change(function(obj){
			model = jQuery('#model').val();
			
			switch(model){
				case 'm1abrams':
					cubeNode = new MeshNode();
					cubeNode.loadShader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
					cubeNode.loadOBJModel("/assets/models/json/m1abrams.json");
					cubeNode.loadTexture("/assets/textures/m1abrams.jpg")
					break;
				case 'humveehardtop':
					cubeNode = new MeshNode();
					cubeNode.loadShader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
					cubeNode.loadOBJModel("/assets/models/json/humveehardtop.json");
					cubeNode.loadTexture("/assets/textures/humveehardtop.jpg")
					break;
				case 'uhtiger':
					cubeNode = new MeshNode();
					cubeNode.loadShader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
					cubeNode.loadOBJModel("/assets/models/json/uhtiger.json");
					cubeNode.loadTexture("/assets/textures/uhtiger.jpg")
					break;
				default:
					cubeNode = new MeshNode();
					cubeNode.loadShader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
					cubeNode.loadOBJModel("/assets/models/json/quakeplasma.json");
					cubeNode.loadTexture("/assets/textures/quakeplasma.jpg")
					
			}
			
		});
		
	});	

	/**
	 * Main function 
	 */
	function main(){
		
		updateStatus("Starting WebGL");
		
		var canvas = document.getElementById('webgl_canvas');
	
		//Get the OpenGL ES context and set to the global var.
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
        
        if (!gl) {
            updateStatus("Could not initialize webgl. Do you have a WebGL enabled browser?")
			return;
        }
		
		//Set the clear color
		gl.clearColor(0.5, 0.5, 0.5, 1.0);
		
		//Enable depth testing for 3D
		gl.enable(gl.DEPTH_TEST);
		
		//Create a cube node
		cubeNode = new MeshNode();
		cubeNode.loadShader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
		cubeNode.loadOBJModel("/assets/models/json/quakeplasma.json");
		cubeNode.loadTexture("/assets/textures/quakeplasma.jpg")
		
		//initTexture("/assets/textures/quakeplasma.jpg");
		
		//Start the animation
		tick();
		
		updateStatus("WebGL ready");
		
	}
	
	
	/**
	 * Helper function for updating the status
	 */
	function updateStatus(text){
		jQuery('#status').append("<li>" + text + "</li>");
	}
    

	/**
	 * Main drawing routine
	 */
    function drawScene() {
		
		//Set the viewport
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		//Set up projection matrix
		projectionMatrixStack = new MatrixStack();
		projectionMatrixStack.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);		
		
		//Set up ModelView Matrix
		modelViewMatrixStack = new MatrixStack();
		modelViewMatrixStack.translate([0.0, -3.0, -20.0]);
		modelViewMatrixStack.rotate(20.0, [1,0,0]);
		modelViewMatrixStack.rotate(cubeRotation, [0, 1, 0]);
		
		//Draw cube
		cubeNode.render(projectionMatrixStack, modelViewMatrixStack);
		
        //mvPopMatrix();
		modelViewMatrixStack.pop();

    }


	/**
	 * Main animation routine
	 */
    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            cubeRotation -= (75 * elapsed) / 2000.0;
        }
        lastTime = timeNow;
    }


	/**
	 * Do the frame update
	 */
    function tick() {
        requestAnimFrame(tick);
        drawScene();
        animate();
    }

</script>