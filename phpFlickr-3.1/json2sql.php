<?php
$handle = fopen('flickr.json', 'r');
if ($handle) {
     while (($buffer = fgets($handle, 4096)) !== false) {

        $p = json_decode($buffer, 1);

        $hash = md5($p["url_sq"]);
        $urls = array('sq', 't', 's', 'm', 'z', 'l', 'o');
        foreach ($urls as $u) {
            if (strlen($p["url_".$u]) && strlen($p["height_".$u]) && strlen($p["width_".$u])) {
                echo "select autoin({$p['latitude']}, {$p['longitude']}, '{$p["url_".$u]}', {$p["height_".$u]}, {$p["width_".$u]}, '{$p['datetaken']}', '$hash');\n";
            }
        }
     }
     fclose($handle);
}

