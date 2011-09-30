//Vertex Shader

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec4 vColor;
varying vec3 vNormal;	//varying normal to interpolate
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;		//Interpolated UV's

void main(void) {
	
	//Calculate the normal for automatic interpolation
	vNormal = uNormalMatrix * aVertexNormal;
	
	//Calculate vertex position in eye space
	vVertexPosition = vec3(uModelViewMatrix * vec4(aVertexPosition, 1));
	
	//UV
	vTextureCoord = aTextureCoord;
	
	//Send the vertex position out
	gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);	
}