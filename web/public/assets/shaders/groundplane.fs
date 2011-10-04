/**
 * Ground Plane Fragment Shader
 */

#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec3 vVertexPosition;

uniform sampler2D uSampler;

vec3 groundColor = vec3(0.5, 0.5, 0.5);

void main(void) {
	
	vec3 normal = normalize(vNormal);
	
	//Calculate lighting
	
	//Light from the forward right
	vec3 lightPosition = vec3(20.0, 20.0, 20.0);
	
	//Calculate the lighting direction
	vec3 lightDirection = normalize(lightPosition - vVertexPosition);
	
	//Calculate the eyedirection half vector for blinn-phong shading
	vec3 eyeDirection = normalize(-vVertexPosition);	//I'm not sure why this works.
	vec3 halfVector = normalize(lightDirection + eyeDirection);

	//Base color of the object
	vec4 color = vec4(groundColor, 1.0);
	
	//Calculate diffuse term
	vec4 diffuseTerm = vec4(color.rgb * clamp(dot(lightDirection, normal), 0.0, 1.0), 1.0);	//Forcing the alpha to 1.0 so it's not affected by lighting
		
	gl_FragColor = diffuseTerm;
}