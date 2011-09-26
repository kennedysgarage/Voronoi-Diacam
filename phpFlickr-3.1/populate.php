<?php
require_once("phpFlickr.php");
require_once('helpers.php');

//$span = 24 * 60 * 60;

// first start - 1282262400
$ar = $argv[1];
$ar = explode('|', $ar);
$date_start = strtotime($ar[2]);
$date_end = strtotime($ar[3]);

if (!$date_start || !$date_end) {
    ;exit;
}

$search = array(
    'accuracy' => 11,
    'media' => 'photos',
    'has_geo' => 1,
    'safe_search' => 1,
    'extras' => 'geo,date_taken,tags,url_sq, url_t, url_s, url_m, url_z, url_l, url_o',
    'woe_id' => 2459115,
    );

$f = new phpFlickr("56800cb60012fb3fb3491c1bcf697fdb");

//for ($i = $date_start; $i = $i + $span; $i <= $date_end) {
    $search['min_taken_date'] = $date_start;
    $search['max_taken_date'] = $date_end;

    $recent = $f->photos_Search($search);

    foreach ($recent['photo'] as $photo) {
        // echo insert
        make_insert($photo);
    }
    //sleep(1);
//}



