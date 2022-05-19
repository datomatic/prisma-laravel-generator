<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$rules = [
    '@PhpCsFixer' => true,
    '@PhpCsFixer:risky' => true,
];

$config = new Config();

return $config
    ->setRules($rules)
    ->setRiskyAllowed(true)
    ->setUsingCache(false);
