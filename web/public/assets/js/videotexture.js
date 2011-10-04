/**
 * A Video Texture Object
 * @param string video_id - the element ID for the HTML5 video
 */
function VideoTexture(video_id){	
	this.video_element = document.getElementById(video_id);
}

/**
 * Updates the video texture frame
 */
VideoTexture.prototype.updateTexture = function(){
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);  
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video_element);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);  
	gl.generateMipmap(gl.TEXTURE_2D);  
	gl.bindTexture(gl.TEXTURE_2D, null); 
	this.gltexture = texture;	
}

//[10:11:15.223] uncaught exception: [Exception... "Failure arg 5 [nsIDOMWebGLRenderingContext.texImage2D]"  nsresult: "0x80004005 (NS_ERROR_FAILURE)"  location: "JS frame :: http://inse6530/assets/js/videotexture.js :: <TOP_LEVEL> :: line 16"  data: no]