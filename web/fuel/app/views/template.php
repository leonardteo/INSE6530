<?php
/**
 * Standard HTML5 template for INSE applications
 */
?>
<!DOCTYPE HTML>
<html>
	<head>
		<title>INSE 6530 - Leonard Teo | <?php echo $title; ?></title>
		
		<!-- Javascript -->
		<script src="/assets/js/jquery-1.6.4.min.js"></script>
		<script src="/assets/js/jquery-ui-1.8.16.custom.min.js"></script>
		<script src="/assets/js/glMatrix.js"></script>
		<script src="/assets/js/scenegraph.js"></script>
		
		<!-- CSS -->
		<link href="/assets/css/smoothness/jquery-ui-1.8.16.custom.css" rel="stylesheet" type="text/css" />
		
		<!-- Additional Headers -->
		<?php echo isset($additional_headers) ? $additional_headers : ""; ?>
		
	</head>
	
	<body>
	
	
		<?php echo $content; ?>
		
		
	</body>
	
	
</html>
