/**
 * Vertex Shader for Hemispherical Lighting 
 */

//Standard inputs
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

//Outputs
varying vec3 vColor;
varying vec3 vNormal;	//varying normal to interpolate
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;		//Interpolated UV's

//Settings for lighting
vec3 lightPosition = vec3(0.0, 20.0, 0.0);
vec3 skyColor = vec3(0.95, 0.95, 0.95);
vec3 groundColor = vec3(0.4, 0.4, 0.4);

void main(void) {
	
	//Calculate the normal for automatic interpolation
	vNormal = uNormalMatrix * aVertexNormal;
	
	//Calculate vertex position in eye space
	vVertexPosition = vec3(uModelViewMatrix * vec4(aVertexPosition, 1));
	
	//UV
	vTextureCoord = aTextureCoord;
	
	//Lighting
	vec3 lightVector = normalize(lightPosition - vVertexPosition);
	float costheta = dot(vNormal, lightVector);
	float a = costheta * 0.5 + 0.5;
	vColor = mix(groundColor, skyColor, a);
	
	//Send the vertex position out
	gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);	
}