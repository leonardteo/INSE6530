/*****
 * SceneGraph
 * @author Leonard Teo
 */

//Declare class
function SceneGraph(canvas_id) {
	
	canvas = document.getElementById(canvas_id);
	
	//Initialize scenegraph on WebGL Canvas
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	
}



