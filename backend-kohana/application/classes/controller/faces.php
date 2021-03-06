<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Faces extends Controller {

	public function action_index()
	{
        require "/home/max/public_html/voronoi/phpFlickr-3.1/helpers.php";

        $key = $_REQUEST['key'];
        $secret = $_REQUEST['secret'];

        $faces = $urls = array();
        $model = new Model_faces();

    
        // first 30
        for ($i = 0; $i = 1; $i++) {
            $data1 = $model->Update();
            foreach ($data1 as $d) {
                $urls[$d['hash']] = $d['url'];
                $hashes[$d['url']] = $d['hash'];
            }
            $isf = is_face($urls, $hashes, $key, $secret);

            if (count($isf['yes'])) {
                foreach ($isf['yes'] as $face_data) {
                    $model->setFace($face_data);
                    $faces[] = $face_data;
                }
            }

            if (count($isf['no'])) {
                foreach ($isf['no'] as $face_data) {
                    $model->setFace($face_data, false);
                }
            }
        }

        echo json_encode($faces);
	}

} // End Welcome
