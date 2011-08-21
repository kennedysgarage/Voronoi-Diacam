<?php

//require_once "modules/oauth/classes/baseOauth.class.php";
//require_once "modules/foursquare/classes/Foursquare.class.php";
$woe = $core = $search = $detail = array();

$str = 'array(';
for ($i = 10001; $i <= 10041; $i++) {
    $url = 'http://where.yahooapis.com/geocode?q=' . $i . '&appid=[yourappidhere]';
    $ret = do_curl($url);
    $data = new SimpleXMLElement($ret['html']);
    $data = xml2array($data);
    $str .= $data['Result']['woeid'] . ',';
    //$woe[] = $data['Result']['woeid'];
}
$str .= ');';
var_dump($str);exit;
var_dump($woe);exit;


// https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=CLIENT_ID&client_secret=CLIENT_SECRET
$url_search = 'https://api.foursquare.com/v2/venues/search?';
$url_detail = 'https://api.foursquare.com/v2/venues';
$core['client_id'] =  'TSAU21RKTIOVKPV025XZTMWUTAT4ZTIHTBGUIBUXZWONVGKN';
$core['client_secret'] = 'E0PSU5JZOY412JPUPA5RET4FGQMBT3NJYZH15DSMILEHH3PU';
$search['ll'] = '40.734665,-74.004754';

$url = $url_search . http_build_query(array_merge($core, $search));
$ret = do_curl($url);
$ret = json_decode($ret['html'], 1);

$out = array(
    'places' => array(),
    'meta' => array('startDate' => null, 'endDate' => null),
);

$i = 0;
foreach ($ret['response']['groups'][0]['items'] as $item) {
    $url = $url_detail .'/' . $item['id'] . '?' . http_build_query($core);
    $venue = do_curl($url);
    $venue = json_decode($venue['html'], 1);
    $photos = $venue['response']['venue']['photos']['groups'][1]['items'];
    if (!count($photos)) continue;

    $out['places'][$i]['name'] = $item['name'];
    $out['places'][$i]['coordinates'] = array($item['location']['lat'], $item['location']['lng']);

    //echo "id: {$item['id']}, name: {$item['name']}, lat: {$item['location']['lat']}, long: {$item['location']['lng']}\n";
    foreach ($photos as $p) {
        $p_array = array();
        $j = 0;
        
        foreach ($p['sizes']['items'] as $item) {
            $p_array[$j]['url'] =  $item['url'];
            $p_array[$j]['size'] = array($item['width'], $item['height']);
            $j++;
        }

        $out['places'][$i]['photos'][] = $p_array;

        $times[] = $p['createdAt'];

        //echo "\tcreated: {$p['createdAt']}, full: {$p['url']}\n";
/*
        echo "\t\tsize 1: {$p['sizes']['items'][0]['url']}, size: {$p['sizes']['items'][0]['width']}x{$p['sizes']['items'][0]['height']}\n";
        echo "\t\tsize 2: {$p['sizes']['items'][1]['url']}, size: {$p['sizes']['items'][1]['width']}x{$p['sizes']['items'][1]['height']}\n";
        echo "\t\tsize 3: {$p['sizes']['items'][2]['url']}, size: {$p['sizes']['items'][2]['width']}x{$p['sizes']['items'][2]['height']}\n";
        echo "\t\tsize 4: {$p['sizes']['items'][3]['url']}, size: {$p['sizes']['items'][3]['width']}x{$p['sizes']['items'][3]['height']}\n";
*/
        //var_dump($p);exit;
    }
    $i++;
}

sort($times);
$out['meta']['startDate'] = array_shift($times);
$out['meta']['endDate'] = array_pop($times);

echo json_encode($out);





// place
/*
  ["id"]=>
  string(24) "4b81ea40f964a520e0c330e3"
  ["name"]=>
  string(29) "Brooklyn Bridge Park - Pier 1"
  ["contact"]=>
  array(0) {
  }
  ["location"]=>
  array(8) {
    ["address"]=>
    string(17) "334 Furman Street"
    ["city"]=>
    string(8) "Brooklyn"
    ["state"]=>
    string(2) "NY"
    ["postalCode"]=>
    string(5) "11201"
    ["country"]=>
    string(3) "USA"
    ["lat"]=>
    float(40.701984159669)
    ["lng"]=>
    float(-73.996953964233)
    ["distance"]=>
    int(338)
  }
*/

// photos
/*
array(7) {
  ["id"]=>
  string(24) "4e4d8de1149505fcf1263902"
  ["createdAt"]=>
  int(1313705441)
  ["url"]=>
  string(96) "https://playfoursquare.s3.amazonaws.com/pix/HWGIYN4YGWAMDA4RDFOBQ5IELY2QNBNTYLCZVOSATPRLB5PY.jpg"
  ["sizes"]=>
  array(2) {
    ["count"]=>
    int(4)
    ["items"]=>
    array(4) {
      [0]=>
      array(3) {
        ["url"]=>
        string(96) "https://playfoursquare.s3.amazonaws.com/pix/HWGIYN4YGWAMDA4RDFOBQ5IELY2QNBNTYLCZVOSATPRLB5PY.jpg"
        ["width"]=>
        int(720)
        ["height"]=>
        int(431)
      }
      [1]=>
      array(3) {
        ["url"]=>
        string(112) "https://playfoursquare.s3.amazonaws.com/derived_pix/HWGIYN4YGWAMDA4RDFOBQ5IELY2QNBNTYLCZVOSATPRLB5PY_300x300.jpg"
        ["width"]=>
        int(300)
        ["height"]=>
        int(300)
      }
      [2]=>
      array(3) {
        ["url"]=>
        string(112) "https://playfoursquare.s3.amazonaws.com/derived_pix/HWGIYN4YGWAMDA4RDFOBQ5IELY2QNBNTYLCZVOSATPRLB5PY_100x100.jpg"
        ["width"]=>
        int(100)
        ["height"]=>
        int(100)
      }
      [3]=>
      array(3) {
        ["url"]=>
        string(110) "https://playfoursquare.s3.amazonaws.com/derived_pix/HWGIYN4YGWAMDA4RDFOBQ5IELY2QNBNTYLCZVOSATPRLB5PY_36x36.jpg"
        ["width"]=>
        int(36)
        ["height"]=>
        int(36)
      }
    }
  }
  ["source"]=>
  array(2) {
    ["name"]=>
    string(22) "foursquare for Android"
    ["url"]=>
    string(41) "https://foursquare.com/download/#/android"
  }
  ["user"]=>
  array(6) {
    ["id"]=>
    string(7) "6996237"
    ["firstName"]=>
    string(5) "Kiley"
    ["lastName"]=>
    string(2) "L."
    ["photo"]=>
    string(75) "https://playfoursquare.s3.amazonaws.com/userpix_thumbs/4ES4D1HWDRGQZXQZ.jpg"
    ["gender"]=>
    string(4) "male"
    ["homeCity"]=>
    string(12) "Brooklyn, NY"
  }
  ["visibility"]=>
  string(6) "public"
}
*/

