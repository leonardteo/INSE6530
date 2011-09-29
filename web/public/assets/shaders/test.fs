#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec3 vVertexPosition;
varying vec2 vUV;

uniform sampler2D uSampler;

void main(void) {
	
	vec3 normal = normalize(vNormal);
	
	//Calculate lighting
	
	//Light from the forward right
	vec3 lightPosition = vec3(20.0, 20.0, 20.0);
	
	//Calculate the lighting direction
	vec3 lightDirection = normalize(lightPosition - vVertexPosition);

	//Base color of the object
	//vec4 color = vec4(0.75, 0.75, 0.75, 1.0);
	vec4 color = texture2D(uSampler, vec2(vUV.s, vUV.t));
	
	vec3 diffuseTerm = color.rgb * clamp(dot(lightDirection, normal), 0.0, 1.0);
	
	//No texture
	//diffuseTerm = vec3(1.0, 1.0, 1.0) * clamp(dot(lightDirection, normal), 0.0, 1.0);
	
    gl_FragColor = vec4(diffuseTerm.rgb, 1.0);
	
	//gl_FragColor = diffuseTerm;
	
}