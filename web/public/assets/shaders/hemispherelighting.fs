/**
 * Fragment Shader for Hemispherical Lighting 
 */

#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
	
	//Get color from texture
	vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	
	//Output color is the color from the hemisphere calculation * texture color
	gl_FragColor = vec4(vColor, 1.0); // * textureColor;
}