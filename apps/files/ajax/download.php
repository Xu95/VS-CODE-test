<?php
/**
 * @author Andreas Fischer <bantu@owncloud.com>
 * @author Bart Visscher <bartv@thisnet.nl>
 * @author Björn Schießle <schiessle@owncloud.com>
 * @author Frank Karlitschek <frank@owncloud.org>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
 * @author Lukas Reschke <lukas@owncloud.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <icewind@owncloud.com>
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
//Check if we are a user

OCP\User::checkLoggedIn();

\OC::$server->getSession()->close();

$user = OC_User::getUser();



$fix = $_POST['fileSuffix'];


$own_appid = \OCA\Files\App::sql_suffix($fix);

//var_dump($own_appid);

if($own_appid==null){
	$nu['code']=801;
	$nu = json_encode($nu);
	echo $nu;
	exit;
}
$config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);
$url = 'http://'.$config['db']['host'].'/cu/index.php/Home/App/getSubscribedApp';

$uid = $_SESSION['loginname'];

$appinfo = \OCA\Files\App::cu_curl($url,$uid);

$appinfo = json_decode($appinfo,true);

//var_dump($appinfo['data']);

$cu_appid = array();

foreach ($appinfo['data'] as $value) {
	array_push($cu_appid, $value['id']);
}

$intersect_appid = array_intersect($cu_appid,$own_appid);
$un_buy['name'] = '';
$i=0;
if($intersect_appid == null){
	foreach ($own_appid as $value) {	
		$un_buy['name'].=\OCA\Files\App::sql_appname((int)$value).' ';//802
	}
	$un_buy['code'] = 802;
	//var_dump($un_buy);
	$un_buy = json_encode($un_buy);
	echo $un_buy;
	exit;
}

//var_dump($intersect_appid);
$data['code'] = 800;
$i=0;
foreach ($appinfo['data'] as  $value) {

	//var_dump(in_array($value['id'], $intersect_appid));
	//var_dump(array_diff($value['id'])) ;

	if(in_array($value['id'], $intersect_appid)){
		$data['apps'][$i++] = $value;
	}
}
$avb_appinfo = json_encode($data);//800

echo $avb_appinfo;

return  
exit;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$files = isset($_GET['files']) ? (string)$_GET['files'] : '';
$dir = isset($_GET['dir']) ? (string)$_GET['dir'] : '';

$files_list = json_decode($files);
// in case we get only a single file
if (!is_array($files_list)) {
	$files_list = array($files);
}

OC_Files::get($dir, $files_list, $_SERVER['REQUEST_METHOD'] == 'HEAD');


