<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$rules = [
    '@PhpCsFixer' => true,
    '@PhpCsFixer:risky' => true,
    'phpdoc_no_alias_tag' => [
        'replacements' => [ 'type' => 'var', 'link' => 'see' ]
    ],
];

$config = new Config();

return $config
    ->setRules($rules)
    ->setRiskyAllowed(true)
    ->setUsingCache(false);
