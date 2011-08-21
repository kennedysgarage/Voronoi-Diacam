<?php

class Model_images extends Model_database {


    public function getTimeslice($n) {
        $n %= 3600;
        $sql = "SELECT * FROM frames 
                INNER JOIN ( 
                    SELECT max(image_id) AS image_id
                    FROM frames
                    where frame_id = {$n}
                    and sizex < 2000
                    GROUP BY venue_id
                ) foo
                USING (image_id)
                LIMIT 20";
        $res = $this->_db->query(Database::SELECT, $sql);
        return $res->as_array();
    }
}
