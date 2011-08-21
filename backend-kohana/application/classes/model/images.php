<?php

class Model_images extends Model_database {


    public function getTimeslice($n) {
        $sql = "SELECT * FROM images LIMIT 20";
        $res = $this->_db->query(Database::SELECT, $sql);
        return $res->as_array();
    }
}
