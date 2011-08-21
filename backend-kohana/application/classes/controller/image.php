<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Image extends Controller {

	public function action_index()
	{
        $id = $this->request->param('id');
        $model = new Model_images();
        $data = $model->getTimeslice($id);
        echo json_encode($data);
	}

} // End Welcome
