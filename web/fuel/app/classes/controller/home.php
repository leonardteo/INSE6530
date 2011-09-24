<?php

/**
 * Home Controller
 */

class Controller_Home extends Controller_Base
{
	
	/**
	 * Index
	 */
	public function action_index()
	{
		$this->template->title = "Home";
		$this->template->content = View::factory('home/index');
		
	}
	
}