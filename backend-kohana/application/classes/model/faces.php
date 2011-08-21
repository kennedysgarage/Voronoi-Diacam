<?php

class Model_faces extends Model_database {


    public function Update() {
        $sql = "select url,hash from images where face is null and take_date <= now() and total_size > 650 order by take_date desc limit 30";
        $res = $this->_db->query(Database::SELECT, $sql);
        return $res->as_array();
    }

    public function setFace($face_data, $is_face = true) {
            foreach ($face_data as $url=>$data) {

                if ($is_face) {
                    $sql = "update images set face=1";

                    if (strlen($data['gender'])) {
                        switch ($data['gender']) {
                            case 'male':
                                $sql .= ", gender=1";
                                break;
                            case 'female':
                                $sql .= ", gender=0";
                                break;
                        }
                    }

                    if (strlen($data['glasses'])) {
                        switch ($data['glasses']) {
                            case 'true':
                                $sql .= ", glasses=1";
                                break;
                            case 'false':
                                $sql .= ", glasses=0";
                                break;
                        }
                    }

                    if (strlen($data['smiling'])) {
                        switch ($data['smiling']) {
                            case 'true':
                                $sql .= ", smiling=1";
                                break;
                            case 'false':
                                $sql .= ", smiling=0";
                                break;
                        }
                    }

                } else {
                    $sql = "update images set face=0";
                }


                $sql .= " where hash='{$data['hash']}'";
                $res = $this->_db->query(Database::UPDATE, $sql);
            }
        }

}
