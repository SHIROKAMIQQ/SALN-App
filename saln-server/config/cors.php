<?php

// FOR DEV:
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000', 
        'http://127.0.0.1:3000'
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];

// FOR PROD:
// return [
//     'paths' => ['api/*', 'sanctum/csrf-cookie'],
//     'allowed_methods' => ['*'],
//     'allowed_origins' => [
//         'http://localhost:3000', 
//         'http://127.0.0.1:3000',
//         'https://lamig-saln.online',
//         'https://www.lamig-saln.online'
//     ],
//     'allowed_headers' => ['*'],
//     'supports_credentials' => true,
// ];