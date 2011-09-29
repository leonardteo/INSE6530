<?php
/**
 * Standard HTML5 template for INSE applications
 */
?>
<!DOCTYPE HTML>
<html>
	<head>
		<title>INSE 6530 - Leonard Teo | <?php echo $title; ?></title>
		
		<!-- Javascript - JQuery -->
		<script src="/assets/js/jquery-1.6.4.min.js"></script>
		<script src="/assets/js/jquery-ui-1.8.16.custom.min.js"></script>
		
		<!-- WebGL Libraries -->
		<script src="/assets/js/glMatrix.js"></script>
		<script src="/assets/js/webgl-utils.js"></script>
		
		<!-- My libraries -->
		<script src="/assets/js/matrixstack.js"></script>
		<script src="/assets/js/scenegraph.js"></script>
		<script src="/assets/js/shader.js"></script>
		<script src="/assets/js/node.js"></script>
		<script src="/assets/js/meshnode.js"></script>
		<script src="/assets/js/texture.js"></script>
		
		<!-- CSS -->
		<link href="/assets/css/styles.css" rel="stylesheet" type="text/css" />
		<link href="/assets/css/smoothness/jquery-ui-1.8.16.custom.css" rel="stylesheet" type="text/css" />
		
		<!-- Additional Headers -->
		<?php echo isset($additional_headers) ? $additional_headers : ""; ?>
		
	</head>
	
	<body>
	
	
		<?php echo $content; ?>
		
		
	</body>
	
	
</html>
