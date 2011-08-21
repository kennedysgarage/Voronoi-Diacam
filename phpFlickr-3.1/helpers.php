<?php
function is_face(array $pic_urls, $hashes) {
    if (count($pic_urls) > 30) {
        return array();
    }

    $out = array();
    $url = 'http://api.face.com/faces/detect.json?';
    $param = array(
            'api_key' => 'f1daa075801e030d7e69149c82744126',
            'api_secret' => '8c811091f2f8e2a640bdfac66dd08ac7',
            'urls' => implode(',', $pic_urls),
            );

    $url = $url . http_build_query($param);

    $ret = do_curl($url);
    $j = json_decode($ret['html'], 1);

    if (!array_key_exists('photos', $j)) {
        var_dump($ret);exit;
    }

    $i = 0;
    foreach ($j['photos'] as $photo) {
        if ($photo['tags'][0]['attributes']['face']['value'] == 'true') {
            $out['yes'][$i][$photo['url']]['gender'] = $photo['tags'][0]['attributes']['gender']['value'];
            $out['yes'][$i][$photo['url']]['glasses'] = $photo['tags'][0]['attributes']['glasses']['value'];
            $out['yes'][$i][$photo['url']]['smiling'] = $photo['tags'][0]['attributes']['smiling']['value'];
            $out['yes'][$i][$photo['url']]['hash'] = $hashes[$photo['url']];
        } else {
            $out['no'][$i][$photo['url']]['gender'] = null;
            $out['no'][$i][$photo['url']]['glasses'] = null;
            $out['no'][$i][$photo['url']]['smiling'] = null;
            $out['no'][$i][$photo['url']]['hash'] = $hashes[$photo['url']]; 
        }
        $i++;
    }

    return $out;
}


function make_insert($p) {
    $hash = md5($p["url_sq"]);
    $urls = array('sq', 't', 's', 'm', 'z', 'l', 'o');
    foreach ($urls as $u) {
        if (strlen($p["url_".$u]) && strlen($p["height_".$u]) && strlen($p["width_".$u])) {
            if ($p["width_".$u] + $p["height_".$u] > 800) continue;
            if ($p["width_".$u] + $p["height_".$u] < 300) continue;
            if ($p["width_".$u] / $p["height_".$u] > 3) continue;
            if ($p["width_".$u] / $p["height_".$u] < 0.4) continue;

            echo "select autoin({$p['latitude']}, {$p['longitude']}, '{$p["url_".$u]}', {$p["height_".$u]}, {$p["width_".$u]}, '{$p['datetaken']}', '$hash');\n";
        }
    }
}

function do_curl($url, $auth = array(), $destination_file = null)
{
  $curl = curl_init();
  $header[] = "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
  $header[] = "Cache-Control: max-age=0";
  $header[] = "Connection: keep-alive";
  $header[] = "Keep-Alive: 300";
  $header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
  $header[] = "Accept-Language: en-us,en;q=0.5";
  $header[] = "Pragma: "; // browsers keep this blank.

  if (count($auth) && array_key_exists('username', $auth) && array_key_exists('password', $auth)) {
      $header[] = "Authorization: Basic " . base64_encode($auth['username'] . ':' . $auth['password']);
  }

  $cookiefile = tempnam('/tmp', 'curl_cookie_');

  curl_setopt($curl,CURLOPT_COOKIEJAR, $cookiefile);
  curl_setopt($curl,CURLOPT_COOKIEFILE,$cookiefile);
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.11) Gecko/2009060309 Ubuntu/8.04 (hardy) Firefox/3.0.11');
  curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
  curl_setopt($curl, CURLOPT_REFERER, 'http://www.google.com');
  curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
  curl_setopt($curl, CURLOPT_AUTOREFERER, true);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_TIMEOUT, 60);
  curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt($curl, CURLOPT_MAXREDIRS, 4);

  if ($destination_file) {
      $fp = fopen($destination_file, 'w');
      if (!$fp) {
          die("cannot create $destination_file");
      }
      curl_setopt($curl, CURLOPT_FILE, $fp);
      curl_exec($curl);
  if ($fp) {
    fclose($fp);
  }


  } else {
      $html = curl_exec($curl);
  }

  $ret = array(
      'http_code' => curl_getinfo($curl, CURLINFO_HTTP_CODE),
      'curl_message' => curl_error($curl),
      );

  if (!$destination_file) {
    $ret['html'] = $html;
  }
  curl_close($curl); // close the connection
  unlink($cookiefile);

  return $ret;

}


