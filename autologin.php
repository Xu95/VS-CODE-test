<?php
/**
 * @author Frank Karlitschek <frank@owncloud.org>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
 * @author Lukas Reschke <lukas@owncloud.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <icewind@owncloud.com>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
 * @author Vincent Petry <pvince81@owncloud.com>
 *
 * @copyright Copyright (c) 2015, ownCloud, Inc.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

// Show warning if a PHP version below 5.4.0 is used, this has to happen here
// because base.php will already use 5.4 syntax.
if (version_compare(PHP_VERSION, '5.4.0') === -1) {
	echo 'This version of ownCloud requires at least PHP 5.4.0<br/>';
	echo 'You are currently running ' . PHP_VERSION . '. Please update your PHP version.';
	return;
}

try {
	require_once 'lib/base.php';
    $requestToken =  OC_Util::callRegister();

} catch(\OC\ServiceUnavailableException $ex) {
	\OCP\Util::logException('index', $ex);

	//show the user a detailed error page
	OC_Response::setStatus(OC_Response::STATUS_SERVICE_UNAVAILABLE);
	OC_Template::printExceptionErrorPage($ex);
} catch (\OC\HintException $ex) {
	OC_Response::setStatus(OC_Response::STATUS_SERVICE_UNAVAILABLE);
	OC_Template::printErrorPage($ex->getMessage(), $ex->getHint());
} catch (Exception $ex) {
	\OCP\Util::logException('index', $ex);

	//show the user a detailed error page
	OC_Response::setStatus(OC_Response::STATUS_INTERNAL_SERVER_ERROR);
	OC_Template::printExceptionErrorPage($ex);
}
$_SESSION["user_id"] = null;
?>
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=0">
    <title>Sinocloud</title>
    <link rel="stylesheet" type="text/css" href="static/css/layer.css" />
    <style>
        body{
            font-size: 12px;
        }
        #login-form{
            display:none;
        }
		.load{
			display: flex;
			align-items:center;
            flex-direction: column;
			justify-content:center;
			width:200px;
			height: 150px;
			margin:0px auto;
            position: fixed;
            height: 100%;
            width: 100%;
		}
		/*loader-5*/
		@keyframes loader-5-inner {
			from{
				transform: scale(0);
			}
			to{
				transform: scale(1.665);
			}
		}
		#loader-5{
			display:flex;
			align-items: center;
			justify-content: center;
			width: 50px;
			height:50px;
			background-color:#85c0e8;
			border-radius: 50px;
            margin-top: -100px;
		}
		.loader-5-inner{
			width: 50px;
			height: 50px;
			border: 10px solid #fff;
			border-radius: 100px;
			animation-name: loader-5-inner;
			animation-iteration-count: infinite;
			animation-duration: 1s;
			box-sizing: border-box;
		}
        .tip{
            margin-top: 20px;
            color:#6b8fb5;
        }
        #btn-back{
            outline: none;
            border: none;
            background-color: rgb(218, 205, 191);
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 12px;
            color: rgb(255, 255, 255);
        }
    </style>
</head>
<body>
<form action='./index.php' method="post" id="login-form" name="login">
    <input type="hidden" name="user" id="user"/>
    <input type="hidden" name="password" id="password"/>
    <input type="hidden" name="requesttoken" value="<?php echo $requestToken; ?>">
</form>
<div class='load'>
	<div id='loader-5'>
		<div class="loader-5-inner"></div>
	</div>
    <p class="tip">
        正在打开网盘...
    </p>
	<p>
        <button type='button' id="btn-back">返回</button>
    </p>
</div>
<script src="static/js/layer.js"></script>
<script src="config/config.js"></script>
<script src="autologin.js"></script>
</body onload = "check_link()">
</html>

