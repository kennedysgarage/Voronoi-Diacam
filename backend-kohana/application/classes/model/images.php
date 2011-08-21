<?php

class Model_images extends Model_database {


    public function getTimeslice($n) {
        $n %= 3600;
        $sql = "SELECT * FROM frames where frame_id = {$n}  LIMIT 20";
        $res = $this->_db->query(Database::SELECT, $sql);
        return $res->as_array();
    }
}
