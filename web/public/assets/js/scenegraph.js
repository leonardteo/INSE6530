/*****
 * SceneGraph
 * @author Leonard Teo
 */

//Declare class
function SceneGraph() {
	this.rootNode = new Node("root");
	this.rootNode.parentNode = null;
	this.rootNode.sceneGraph = this;	//Make sure that we have a reference to the scenegraph
	this.modelViewMatrixStack = new MatrixStack();
	this.projectionMatrixStack = new MatrixStack();
}

/**
 * Render the scenegraph
 */
SceneGraph.prototype.render = function render(){
	
	if (debug) {
		console.log("Calling scenegraph.render on scenegraph:");
		console.debug(this);
	}
	
	//Reset the modelview matrix stack
	this.modelViewMatrixStack = new MatrixStack();
	
	//Do the view transform
	camera.viewTransform();
	
	//Draw the elements
	this.rootNode.render();
}

/**
 * Gets a node from the scenegraph with a name
 */
SceneGraph.prototype.getNode = function(name){
	//Start the traversal 
	return this.rootNode.getNode(name);
}

