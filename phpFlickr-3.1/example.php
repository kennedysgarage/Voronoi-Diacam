<?php
/* Last updated with phpFlickr 1.3.2
 *
 * This example file shows you how to call the 100 most recent public
 * photos.  It parses through them and prints out a link to each of them
 * along with the owner's name.
 *
 * Most of the processing time in this file comes from the 100 calls to
 * flickr.people.getInfo.  Enabling caching will help a whole lot with
 * this as there are many people who post multiple photos at once.
 *
 * Obviously, you'll want to replace the "<api key>" with one provided 
 * by Flickr: http://www.flickr.com/services/api/key.gne
 */

require_once("phpFlickr.php");

// see what our last time was
$min_date = 0;
$handle = fopen('flickr.json', 'r');
if ($handle) {
     while (($buffer = fgets($handle, 4096)) !== false) {

        // 2011-08-20 15:37:00
        $p = json_decode($buffer, 1);
        $d = strtotime($p['datetaken']);
        if ($d > $min_date) {
            $min_date = $d;
        }
     }
     fclose($handle);
}


// get new pics
//$woes = array(12761333,12761334,12761335,12761336,12761337,12761338,12761339,12761340,12761341,12761342,12761343,12761344,12761345,12761346,23509641,12761347,12761348,12761349,12761350,12761351,12761352,12761353,12761354,12761355,12761356,12761357,12761358,12761359,12761360,12761361,12761362,12761363,12761364,12761365,12761366,12761367,12761368,12761369,12761370,12761371,12761372);

$woes = array(2459115);

$search = array('media' => 'photos', 'has_geo' => 1, 'extras' => 'geo,date_taken,tags,url_sq, url_t, url_s, url_m, url_z, url_l, url_o'); 

$f = new phpFlickr("56800cb60012fb3fb3491c1bcf697fdb");

$handle = fopen('flickr.json', 'a+');
foreach ($woes as $w) { 
    $search['min_taken_date'] = $min_date;
    $search['woeid'] = $w;

    $recent = $f->photos_Search($search);

    foreach ($recent['photo'] as $photo) {
        $j = json_encode($photo) . "\n";
        fwrite($handle, $j);
    }
}

fclose($handle);
?>
