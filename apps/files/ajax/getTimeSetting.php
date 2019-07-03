<?php
include_once "../../config/config.php";
// 返回json
$ret = array(
    'TIMED_OPEN_APP_TIME' => $CONFIG['TIMED_OPEN_APP_TIME'],
    'TIMED_OPEN_APP_ID' => $CONFIG['TIMED_OPEN_APP_ID'],
);
echo json_encode($ret);
