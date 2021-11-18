<?php
//! to rabim za ng serve če ne gre z istega hosta

header("Access-Control-Allow-Origin: https://potep.in/*");


// header("Access-Control-Allow-Headers: *");

//! določim v funkcij header("Content-Type: application/pdf; charset=UTF-8");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// //! end to rabim za ng serve

require_once 'settings.php';

// Kickstart the framework
$f3 = require 'lib/base.php';
// Load configuration
$f3->config('config/config.ini');
$f3->config('config/routes.ini');

$f3->run();

