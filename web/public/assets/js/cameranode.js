/**
 * Camera Node
 */

/**
 * Constructor
 */
function CameraNode(id){
	
	//Call the parent constructor
	Node.call(this, id);
	
	//Set the type of camera this is
	this.cameraProjection = "perspective"; //Or ortho
	this.cameraType = "polar"; //Or firstperson
	
	//Third person camera settings
	this.twist = 0.0;
	this.elevation = 0.0;
	this.azimuth = 0.0;
	this.distance = 0.0;
	this.panX = 0.0;
	this.panY = 0.0;
	
	//Offsets for mouse movements
	this.elevationOffset = 0.0;
	this.azimuthOffset = 0.0;
	this.panXOffset = 0.0;
	this.panYOffset = 0.0;
	this.distanceOffset = 0.0;
	
	//Projection Settings
	this.fovy = 45.0;
	this.nearPlane = 1.0;
	this.farPlane = 100.0;
	
}

//Inherit the node
CameraNode.prototype = new Node();

//Set the constructor to this
CameraNode.prototype.constructor = CameraNode;

/**
 * Set the projection
 */
CameraNode.prototype.setProjection = function(viewportWidth, viewportHeight){
	//Set the viewport
	gl.viewport(0, 0, viewportWidth, viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
	//Set up the projection matrix
	this.sceneGraph.projectionMatrixStack = new MatrixStack();
	this.sceneGraph.projectionMatrixStack.perspective(this.fovy, viewportWidth / viewportHeight, this.nearPlane, this.farPlane);
		
}

/**
 * Do a view transform
 */
/**
 * View transform
 */
CameraNode.prototype.viewTransform = function()
{
	//Do third person view transform
	this.sceneGraph.modelViewMatrixStack.translate([-(this.panX + this.panXOffset), -(this.panY + this.panYOffset), -(this.distance + this.distanceOffset)]);
	
	//Do the orbit
	this.sceneGraph.modelViewMatrixStack.rotate(this.twist, [0,0,1]);	//Z 
	this.sceneGraph.modelViewMatrixStack.rotate(this.elevation + this.elevationOffset, [1,0,0]);	//X 
	this.sceneGraph.modelViewMatrixStack.rotate(this.azimuth + this.azimuthOffset, [0,1,0]);	//Y 
	
			//Do third person view transform
		//glTranslatef(-((GLfloat)this->panX + (GLfloat)this->panX_offset), -((GLfloat)this->panY + (GLfloat)this->panY_offset), -( (GLfloat)this->distance + (GLfloat)this->distance_offset) );		//Translate along the z axis away from camera
		
		/*
		glTranslatef(-(this->panX + this->panX_offset), -(this->panY + this->panY_offset), -( this->distance + this->distance_offset) );		//Translate along the z axis away from camera
		glRotatef(this->twist + this->twist_offset, 0.0f, 0.0f, 1.0f);							//Rotate around z axis (usually by 0)
		glRotatef(this->elevation + this->elevation_offset, 1.0f, 0.0f, 0.0f);					//Rotate around x axis
		glRotatef(this->azimuth + this->azimuth_offset, 0.0f, 1.0f, 0.0f);						//Rotate around y axis

		//Local view transform based on position/rotation of the node
		glRotatef(this->rotate->z, 0.0f, 0.0f, 1.0f);	//Roll
		glRotatef(this->rotate->y, 0.0f, 1.0f, 0.0f);	//Heading
		glRotatef(this->rotate->x, 1.0f, 0.0f, 0.0f);	//Pitch
		glTranslatef(-this->translate->x, -this->translate->y, -this->translate->z);
		*/
	
	
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


