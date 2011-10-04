<?php
/**
 * View fragment video texture
 */
?>

<h1>Render Video to Texture</h1>

<p>Description: Test of Rendering a Video to Texture. The application reads an HTML5 video element and passes the video element as the texture.</p>
<p>Usage: </p>
<ul>
	<li>Orbit: Left mouse button + move</li>
	<li>Dolly: Right mouse button + move</li>
	<li>Pan: Middle mouse button + move</li>
</ul>
<p>Note: Use <a href="http://www.google.com/chrome">Google Chrome</a> for best experience</p>

<canvas id="webgl_canvas" width="640" height="480" oncontextmenu="return false;" style="float: left;"></canvas>

<video id="video" width="256" height="256" controls loop="true" style="float:left; padding-left: 20px;">
	<source src="/assets/movies/TestMovieCropResampled.webm" type="video/webm" />
	<source src="/assets/movies/TestMovieCropResampled.ogg" type="video/ogg" />
	Your browser doesn't support HTML5 video
</video>

<div style="clear:both;"></div>

<div>Time: <span id="currentTime"></span> seconds</div>

<div>
	<h2>Status:</h2>
	<ul id="status">
	</ul>
</div>

<h2>Development Notes</h2>

<ul>
	<li>Firefox issue: The filename for an Ogg file in Firefox has to be .ogg. It was not working when the file was .ogv. Apparently the MIME type declaration doesn't do anything.</li>
	<li>Firefox issue: This demo slows down the entire computer. There seems to be a memory leak somewhere.</li>
	<li>Textures need to be in powers of 2. Therefore, the video size is 256x256. It CANNOT be an arbitrary sized texture.</li>
</ul>


<!-- Run time script -->

<script type="text/javascript">

	//Global variables
	var gl;	//OpenGL context
	
	var sceneGraph;
	var model;
	var cubeRotation = 0;
	var camera;
	
	var lastTime = 0;	
	
	var debug = false;	
	
	//Mouse movements
	var leftmousedown = false;
	var rightmousedown = false;
	var middlemousedown = false;
	var mousedownX = 0.0;
	var mousedowny = 0.0;
	
	
	//Start webGL when the DOM is ready...
	jQuery(document).ready(function(){
		
		//And away we go!
		main();
		
	});	

	/**
	 * Main function 
	 */
	function main(){
		
		//bind all interface
		bindInterface();
		
		//Make the canvas BIG
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
		camera.translate = [0.0, 2.0, 0.0];
		camera.fovy = 45.0;
		camera.distance = 20;
		camera.elevation = 30;
		camera.azimuth = -30;
		if (debug) console.debug(camera);
		
		//Create a model node
		model = new MeshNode("model");
		var mesh = new Mesh();
		//mesh.loadMesh("/assets/models/json/quakeplasma.json");
		mesh.loadPlane(20);
		var shader = new Shader("/assets/shaders/test.vs", "/assets/shaders/test.fs");
		var texture = new VideoTexture('video');
		model.attachMesh(mesh);
		model.attachShader(shader);
		model.attachTexture(texture);
		if (debug) console.debug(model);
		
		//Create the scene graph
		sceneGraph = new SceneGraph();
		sceneGraph.rootNode.addChild(model);
		sceneGraph.rootNode.addChild(camera);
				
		
		//Start the animation
		if (shader.programReady){
			updateStatus("WebGL ready");
			
			//Check that the video is ready
			var video = document.getElementById("video");
			video.play();
			tick();
			
			
		} else {
			updateStatus("Error compiling shader. Check console.");
		}
		
	}
	
	/**
	 * Initialize the interface bindings
	 */
	function bindInterface(){
		
		jQuery('#webgl_canvas').mousedown(function(e){
			
			switch (e.which){
				case 1:	//left button
					leftmousedown = true;
					break;
				case 2:	//middle button
					middlemousedown = true;
					break;
				case 3:	//right button
					rightmousedown = true;
					break;
			}
			
			mousedownX = e.clientX;
			mousedownY = e.clientY;
			
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		
		jQuery('#webgl_canvas').mouseup(function(e){
			//Reset the offsets
			switch (e.which){
				case 1:	//left button
					leftmousedown = false;
					camera.elevation = camera.elevation + camera.elevationOffset;
					camera.azimuth = camera.azimuth + camera.azimuthOffset;
					camera.elevationOffset = 0.0;
					camera.azimuthOffset = 0.0;					
					break;
				case 2:	//middle button
					middlemousedown = false;
					camera.panX = camera.panX + camera.panXOffset;
					camera.panY = camera.panY + camera.panYOffset;
					camera.panXOffset = 0.0;
					camera.panYOffset = 0.0;
					break;
				case 3:	//right button
					rightmousedown = false;
					camera.distance = camera.distance + camera.distanceOffset;
					camera.distanceOffset = 0.0;
					break;
			}
			
			return false;
			
		});
		
		jQuery('#webgl_canvas').mousemove(function(e){
			if (leftmousedown){
				//Set the camera movement
				camera.elevationOffset = (e.clientY - mousedownY) / 2;
				camera.azimuthOffset = (e.clientX - mousedownX) / 2;
			}
			
			if (middlemousedown){
				camera.panXOffset = (mousedownX - e.clientX) / 50;
				camera.panYOffset = (e.clientY - mousedownY) /50;
			}
			
			if (rightmousedown){
				camera.distanceOffset = (mousedownX - e.clientX) / 20;
			}
			
			return false;
		});	
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
		
		//Rotate the model
		//model.rotate = [0.0, cubeRotation, 0.0];
		
		//Draw the scenegraph
		sceneGraph.render("camera");
		
    }


	/**
	 * Main animation routine
	 */
    function animate() {
		
		//Update the video texture
		model.texture.updateTexture();
		jQuery('#currentTime').html(document.getElementById('video').currentTime);
		
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