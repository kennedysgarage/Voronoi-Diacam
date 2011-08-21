<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Image extends Controller {

	public function action_index()
	{
        $model = new Model_images();
        $data = $model->getTimeslice(1);
        echo json_encode($data);
	}

} // End Welcome
