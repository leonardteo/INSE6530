/**
 * Scene Graph Node Base Class
 * @param string id - unique identifier for this node
 * @param Node parentNode
 */

function Node(id){
	
	this.id = id;
	this.childNodes = [];
	
}

Node.prototype.addChild = function(childNode){
	this.childNodes.push(childNode);
}

Node.prototype.getChildren = function(){
	return this.childNodes;
}