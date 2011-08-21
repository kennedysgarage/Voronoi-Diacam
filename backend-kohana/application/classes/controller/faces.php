<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Faces extends Controller {

	public function action_index()
	{
        require "/home/max/public_html/voronoi/phpFlickr-3.1/helpers.php";
        $faces = $urls = array();
        $model = new Model_faces();

    
        // first 30
        $data1 = $model->Update();
        foreach ($data1 as $d) {
            if ($d['url'] == 'http://farm7.static.flickr.com/6182/6064414202_873c205fab.jpg') continue;

            $urls[$d['hash']] = $d['url'];
            $hashes[$d['url']] = $d['hash'];
        }
        $isf = is_face($urls, $hashes);

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


        // next 30
        $urls = $ifs = $hashes  = array();
        $data2 = $model->Update();
        foreach ($data2 as $d) {
            if ($d['url'] == 'http://farm7.static.flickr.com/6182/6064414202_873c205fab.jpg') continue;
            $urls[$d['hash']] = $d['url'];
            $hashes[$d['url']] = $d['hash'];
        }
        $isf = is_face($urls, $hashes);

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

        echo json_encode($faces);
	}

} // End Welcome
