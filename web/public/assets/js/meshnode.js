/**
 * Scene graph node for holding and rendering meshes
 * Requires global var gl for holding the gl context
 * @todo - somehow abstract it so that we can pass the gl context in?
 */

/**
 * Constructor
 */
function MeshNode(id){
	
	//Call the parent constructor
	Node.call(this, id);
	
	//Set the drawing by default to solid. Other setting is wireframe
	this.drawMode = "solid";
	
	//Set texture to null;
	this.texture = null;
	
}

//Inherit the node
MeshNode.prototype = new Node();

//Set the constructor to this
MeshNode.prototype.constructor = MeshNode;

/**
 * Render the mesh to the opengl context
 */
MeshNode.prototype.render = function(){
	
	if (debug) console.log("Rendering " + this.id);
	
	this.sceneGraph.modelViewMatrixStack.push();
	
	//Do a model transform
	this.modelTransform();
	
	//Render any children....
	for (var i=0; i<this.childNodes.length; i++){
		this.childNodes[i].render();
	}
	
	//Draw the model
	this.draw();
	
	this.sceneGraph.modelViewMatrixStack.pop();
}

/**
 * The actual draw code
 */
MeshNode.prototype.draw = function(){

	//Set the shader program to use
	gl.useProgram(this.shader.getProgram());
	
	//Set the texture if it exists
	if (this.texture){
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.gltexture);
	} 
   
	//Send attributes to shader
	this.shader.setAttributes(this.mesh.vertexBuffer, this.mesh.textureCoordBuffer, this.mesh.normalBuffer, this.mesh.indexBuffer);
	
	//Send matrices to shader	
	this.shader.setUniforms(this.sceneGraph.projectionMatrixStack, this.sceneGraph.modelViewMatrixStack);
	
	//Draw @todo FIX THIS
	var glDrawMode = this.drawMode == "solid" ? gl.TRIANGLES : gl.LINESTRIP; 
	
	gl.drawElements(glDrawMode, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
}

/**
 * Attach an obj model
 */
MeshNode.prototype.attachMesh = function(mesh){
	this.mesh = mesh;
}

/**
 * Load an OBJ json model
 * @param string url - url to the location of the JSON file
 */
MeshNode.prototype.loadMesh = function(url){
	this.mesh = new Mesh();
	this.mesh.loadMesh(url);
}

/**
 * Load a plane into the meshnode
 */
MeshNode.prototype.loadPlane = function(scale){
	
	this.mesh = new Mesh();
	this.mesh.loadPlane(scale);
	
}

/**
 * Loads a texture into this object
 * @param string filename
 */
MeshNode.prototype.loadTexture = function(filename){
	this.texture = new Texture(filename);
}

/**
 * Attaches a texture object to this meshnode
 * @param Texture texture
 */
MeshNode.prototype.attachTexture = function(texture){
	this.texture = texture;
}

/**
 * Loads a shader from source
 * @param string vertexShader path to vs
 * @param string fragmentShader path to fs
 */
MeshNode.prototype.loadShader = function(vertexShader, fragmentShader){
	this.shader = new Shader(vertexShader, fragmentShader);
}

/**
 * Attaches a shader program to this meshnode
 * @param Shader shader
 */
MeshNode.prototype.attachShader = function(shader){
	this.shader = shader;
}
