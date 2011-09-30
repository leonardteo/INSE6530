<?php
/**
 * View fragment for Hello WebGL
 */
?>

<h1>Hello WebGL</h1>

<p>Test of hierarchical scene graph. Shader uses blinn-phong per-fragment specular lighting.</p>

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
	
	var sceneGraph;
	var model;
	var cubeRotation = 0;
	var camera;
	
	var lastTime = 0;	
	
	var debug = false;	//ugh/
	
	
	//Start webGL when the DOM is ready...
	jQuery(document).ready(function(){
		main();
		
		jQuery('#model').change(function(obj){
			modelName = jQuery('#model').val();
			
			switch(modelName){
				case 'm1abrams':
					model.loadMesh("/assets/models/json/m1abrams.json");
					model.loadTexture("/assets/textures/m1abrams.jpg")
					break;
				case 'humveehardtop':
					model.loadMesh("/assets/models/json/humveehardtop.json");
					model.loadTexture("/assets/textures/humveehardtop.jpg")
					break;
				case 'uhtiger':
					model.loadMesh("/assets/models/json/uhtiger.json");
					model.loadTexture("/assets/textures/uhtiger.jpg")
					break;
				default:
					model.loadMesh("/assets/models/json/quakeplasma.json");
					model.loadTexture("/assets/textures/quakeplasma.jpg")
					
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
		
		
		//Create a new camera node
		camera = new CameraNode("camera");
		camera.translate = [0, 10, 20];
		camera.rotate = [-20, 0, 0];
		if (debug) console.debug(camera);
		
		//Create a model node
		model = new MeshNode("model");
		var mesh = new Mesh("/assets/models/json/quakeplasma.json");
		var shader = new Shader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
		var texture = new Texture("/assets/textures/quakeplasma.jpg");
		model.attachMesh(mesh);
		model.attachShader(shader);
		model.attachTexture(texture);
		if (debug) console.debug(model);
		
		//Create the scene graph
		sceneGraph = new SceneGraph();
		sceneGraph.rootNode.addChild(model);
		sceneGraph.rootNode.addChild(camera);
				
		
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
    

	var t = 0.0;

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
		
		//Rotate the model
		model.rotate = [0.0, cubeRotation, 0.0];
		
		sceneGraph.projectionMatrixStack = projectionMatrixStack;
		
		//Draw the scenegraph
		sceneGraph.render();
		
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