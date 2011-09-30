/**
 * Camera Node
 */

/**
 * Constructor
 */
function CameraNode(id){
	
	//Call the parent constructor
	Node.call(this, id);
	
}

//Inherit the node
CameraNode.prototype = new Node();

//Set the constructor to this
CameraNode.prototype.constructor = CameraNode;



