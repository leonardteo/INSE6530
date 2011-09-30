/**
 * Scene Graph Node Base Class
 * @param string id - unique identifier for this node
 * @param Node parentNode
 */

function Node(id){
	
	this.id = id;			//text string identifier
	this.childNodes = [];	//child nodes
	
	//Scale, Rotate, Translate
	this.scale = vec3.create([1.0, 1.0, 1.0]);
	this.rotate = vec3.create();
	this.translate = vec3.create();
	
	
}

/**
 * Add a child
 */
Node.prototype.addChild = function(childNode){
	childNode.sceneGraph = this.sceneGraph;
	childNode.parentNode = this;
	this.childNodes.push(childNode);
}

/**
 * Returns all the children as an array
 */
Node.prototype.getChildren = function(){
	return this.childNodes;
}

/**
 * Get the current modelviewmatrix stack
 */


/**
 * renders the node
 */
Node.prototype.render = function(projectionMatrixStack, modelViewMatrixStack){

	if (debug) console.log("Rendering " + this.id);
	
	this.sceneGraph.modelViewMatrixStack.push();
	
	
	//Do a model transform
	this.modelTransform();
	
	
	//Render any children....
	if (this.childNodes.length > 0){	//Need this or Javascript goes into an endless loop!
		for (var i=0; i<this.childNodes.length; i++){
			if (debug) console.log("Calling render on childnode: " + this.childNodes[i].id);
			this.childNodes[i].render();
		}
	}
	
	this.sceneGraph.modelViewMatrixStack.pop();
}


/**
 * Does a model transform
 */
Node.prototype.modelTransform = function()
{
	this.sceneGraph.modelViewMatrixStack.translate(this.translate);
	
	//This piece of code is not good because the order of rotation is actually important. 
	//We need to figure out a way to rotate an entire local coordinate system.
	//This should be relatively simple but we'll need to figure it out... 
	this.sceneGraph.modelViewMatrixStack.rotate(this.rotate[2], [0.0,0.0,1.0]);
	this.sceneGraph.modelViewMatrixStack.rotate(this.rotate[1], [0.0,1.0,0.0]);
	this.sceneGraph.modelViewMatrixStack.rotate(this.rotate[0], [1.0,0.0,0.0]);
	
	//Scale
	this.sceneGraph.modelViewMatrixStack.scale(this.scale);
}

/**
 * View transform
 */
Node.prototype.viewTransform = function()
{
	//Rotate backwards
	this.sceneGraph.modelViewMatrixStack.rotate(-this.rotate[2], [0.0,0.0,1.0]);
	this.sceneGraph.modelViewMatrixStack.rotate(-this.rotate[1], [0.0,1.0,0.0]);
	this.sceneGraph.modelViewMatrixStack.rotate(-this.rotate[0], [1.0,0.0,0.0]);	
	
	//Translate backwards
	this.sceneGraph.modelViewMatrixStack.translate([-this.translate[0], -this.translate[1], -this.translate[2]]);
	
	//Any parent?
	if (this.parentNode != null){
		this.parentNode.viewTransform();
	} 
	
}

/**
 * Gets a node by name
 */
Node.prototype.getNode = function(name){
	
	strcomp = this.id.valueOf() == name.valueOf();	//Oh my word Javascript!!! You're more complex than I thought!
	
	//If found, return this object
	if (strcomp) {
		return this;
	}
	
	//If not found, traverse down
	if (this.childNodes.length > 0){
		
		for (var i=0; i<this.childNodes.length; i++){
			found = this.childNodes[i].getNode(name);
			//Quick escape
			if (found){
				return found;
			}
		}
		
	}
	
	return false;
}