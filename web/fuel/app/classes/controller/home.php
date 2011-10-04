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
	
	/**
	 * Scene Graph
	 */
	public function action_scenegraph()
	{
		$this->template->title = "Hierarchical Scene Graph";
		$this->template->content = View::factory('home/scenegraph');
	}
	
	/**
	 * Hemispherical Lighting
	 */
	public function action_hemispherelighting()
	{
		$this->template->title = "Hemispherical Lighting";
		$this->template->content = View::factory('home/hemispherelighting');
	}
	
	/**
	 * Video Texture
	 */
	public function action_videotexture()
	{
		$this->template->title = "Video Texture";
		$this->template->content = View::factory('home/videotexture');
	}
	
}