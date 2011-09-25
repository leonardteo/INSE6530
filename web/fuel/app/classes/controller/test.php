<?php
/**
 * Unit Test Controller
 */

class Controller_Test extends Controller_Base
{
	/**
	 * Run unit tests
	 */
	public function action_index()
	{
		//Load additional headers
		$this->template->additional_headers = '
			<link href="/assets/js/qunit/qunit.css" rel="stylesheet" type="text/css" />
			<script src="/assets/js/qunit/qunit.js"></script>
			<script src="/assets/js/unit_tests/matrixstack.js"></script>
			<script src="/assets/js/unit_tests/node.js"></script>
			';
		
		$this->template->title = "Running unit tests";
		$this->template->content = View::factory('test/index');
	}
	
}