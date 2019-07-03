<?php
/**
 * @author Arthur Schiwon <blizzz@owncloud.com>
 * @author Frank Karlitschek <frank@owncloud.org>
 * @author Jakob Sack <mail@jakobsack.de>
 * @author Joas Schilling <nickvergessen@owncloud.com>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
 * @author Lukas Reschke <lukas@owncloud.com>
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
// OCP\JSON::checkLoggedIn();
// OCP\JSON::callCheck();
// \OC::$server->getSession()->close();
// $user = OC_User::getUser();


// // Get data
// $dir = isset($_POST['dir']) ? (string)$_POST['dir'] : '';
// $allFiles = isset($_POST["allfiles"]) ? (string)$_POST["allfiles"] : false;

// // delete all files in dir ?
// if ($allFiles === 'true') {
// 	$files = array();
// 	$fileList = \OC\Files\Filesystem::getDirectoryContent($dir);
// 	foreach ($fileList as $fileInfo) {
// 		$files[] = $fileInfo['name'];
// 	}
// } else {
// 	$files = isset($_POST["file"]) ? (string)$_POST["file"] : (string)$_POST["files"];
// 	$files = json_decode($files);
// }
// $filesWithError = '';
// //$link_mand = '';

// $success = true;

// //Now delete
// foreach ($files as $file) {
// 	try {
// 		if (/*\OC\Files\Filesystem::file_exists($dir . '/' . $file) &&
// 			!(\OC\Files\Filesystem::isDeletable($dir . '/' . $file) &&
// 				\OC\Files\Filesystem::unlink($dir . '/' . $file))*/transh($user,$dir,$file)
// 		) {
// 			$filesWithError .= $file . "\n";
// 			$success = false;
// 		}
// 	} catch (\Exception $e) {
// 		$filesWithError .= $file . "\n";
// 		$success = false;
// 	}
// }

// // get array with updated storage stats (e.g. max file size) after upload
// try {
// 	$storageStats = \OCA\Files\Helper::buildFileStorageStatistics($dir);
// } catch(\OCP\Files\NotFoundException $e) {
// 	OCP\JSON::error(['data' => ['message' => 'File not found']]);
// 	return;
// }

// if ($success) {
// 	OCP\JSON::success(array("data" => array_merge(array("dir" => $dir, "files" => $files), $storageStats)));
// } else {
// 	OCP\JSON::error(array("data" => array_merge(array("message" =>"禁止删除回收站"), $storageStats)));
// }
// function transh($user,$dir,$file){
// 	//$src_dir = "/var/www/owncloud/data/".$user."/files".$dir.'/'.$file;
// 	$src_dir = "/var/www/owncloud/data/$user/files$dir/\"".$file."\"";
// 	if(stristr($dir,"personal")){
// 		$des_dir = "/var/storage/recycle/".$user.'/'.\OCA\Files\App::sql_ca_uname($user)[0];
// 	}else{
// 		$des_dir = "/var/storage/recycle/".$user.'/'.\OCA\Files\App::sql_ca_gname(substr($dir, 1))[0];
// 	}
// 	if($file == "回收站"){
// 		return true;
// 	}

// 	if(substr($dir, -9) == "回收站"){
// 		$link_mand = 'rm -rf '.$src_dir;
// 	}else{
// 		$link_mand = 'mv '.$src_dir.' ' .$des_dir;
// 	}
// 	if(exec($link_mand,$re)){
// 		return false;
// 	}
// }


include_once "../../config/config.php";
// 返回json
$ret = array(
    'TIMED_OPEN_APP_TIME' => '2019-06-25 21:57:30',
    'TIMED_OPEN_APP_ID' => '72',
    'TIME_NOW' => date("Y-m-d h:i:s"),
);
echo json_encode($ret);
