<?php
// Patch otomatis: composer.json (merge-plugin), app.css (@source), tsconfig.json (include Modules)
$root = getcwd();

// 1. composer.json
$f = "$root/composer.json";
$c = json_decode(file_get_contents($f), true);
$c['extra']['merge-plugin']['include'] = ['Modules/*/composer.json'];
$c['config']['allow-plugins']['wikimedia/composer-merge-plugin'] = true;
$c['autoload']['psr-4']['Modules\\'] = 'Modules/';
file_put_contents($f, json_encode($c, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);
echo "[ok] composer.json\n";

// 2. resources/css/app.css
$f = "$root/resources/css/app.css";
$s = file_get_contents($f);
$line = "@source '../../Modules/**/*.tsx';";
if (strpos($s, $line) === false) {
    $anchor = "@source '../views';";
    if (strpos($s, $anchor) !== false) {
        $s = str_replace($anchor, $anchor . "\n" . $line, $s);
    } else {
        $s = preg_replace("/(@import 'tw-animate-css';)/", "$1\n\n$line", $s, 1);
    }
    file_put_contents($f, $s);
}
echo "[ok] resources/css/app.css\n";

// 3. tsconfig.json
$f = "$root/tsconfig.json";
$s = file_get_contents($f);
$inc = '"Modules/**/resources/js/**/*.tsx"';
if (strpos($s, $inc) === false) {
    $s = str_replace('"resources/js/**/*.tsx"', '"resources/js/**/*.tsx",' . "\n        " . $inc, $s);
    file_put_contents($f, $s);
}
echo "[ok] tsconfig.json\n";
