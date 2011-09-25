<?php
/**
 * Hello Webgl
 */
class Controller_HelloWebGL extends Controller_Base
{
	/**
	 * Index function
	 */
	public function action_index()
	{
		
		$this->template->title = "Hello WebGL!";
		$this->template->content = View::factory('hellowebgl/index');
				
	}
}