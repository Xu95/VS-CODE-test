<?php
/**
 * @author Björn Schießle <schiessle@owncloud.com>
 * @author Christopher Schäpers <kondou@ts.unde.re>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
 * @author Morris Jobke <hey@morrisjobke.de>
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


namespace OCA\Files;

class App {
	/**
	 * @var \OC_L10N
	 */
	private $l10n;

	/**
	 * @var \OCP\INavigationManager
	 */
	private static $navigationManager;

	/**
	 * @var \OC\Files\View
	 */
	private $view;

	public function __construct($view, $l10n) {
		$this->view = $view;
		$this->l10n = $l10n;
	}

	/**
	 * Returns the app's navigation manager
	 *
	 * @return \OCP\INavigationManager
	 */
	public static function getNavigationManager() {
		if (self::$navigationManager === null) {
			self::$navigationManager = new \OC\NavigationManager();
		}
		return self::$navigationManager;
	}

	/**
	 * rename a file
	 *
	 * @param string $dir
	 * @param string $oldname
	 * @param string $newname
	 * @return array
	 */
	public function rename($dir, $oldname, $newname) {
		$result = array(
			'success' 	=> false,
			'data'		=> NULL
		);

		try {
			// check if the new name is conform to file name restrictions
			$this->view->verifyPath($dir, $newname);
		} catch (\OCP\Files\InvalidPathException $ex) {
			$result['data'] = array(
				'message'	=> $this->l10n->t($ex->getMessage()),
				'code' => 'invalidname',
			);
			return $result;
		}

		$normalizedOldPath = \OC\Files\Filesystem::normalizePath($dir . '/' . $oldname);
		$normalizedNewPath = \OC\Files\Filesystem::normalizePath($dir . '/' . $newname);

		// rename to non-existing folder is denied
		if (!$this->view->file_exists($normalizedOldPath)) {
			$result['data'] = array(
				'message'	=> $this->l10n->t('%s could not be renamed as it has been deleted', array($oldname)),
				'code' => 'sourcenotfound',
				'oldname' => $oldname,
				'newname' => $newname,
			);
		}else if (!$this->view->file_exists($dir)) {
			$result['data'] = array('message' => (string)$this->l10n->t(
					'The target folder has been moved or deleted.',
					array($dir)),
					'code' => 'targetnotfound'
				);
		// rename to existing file is denied
		} else if ($this->view->file_exists($normalizedNewPath)) {

			$result['data'] = array(
				'message'	=> $this->l10n->t(
						"The name %s is already used in the folder %s. Please choose a different name.",
						array($newname, $dir))
			);
		} else if (
			// rename to "." is denied
			$newname !== '.' and
			// THEN try to rename
			$this->view->rename($normalizedOldPath, $normalizedNewPath)
		) {
			// successful rename
			$meta = $this->view->getFileInfo($normalizedNewPath);
			$meta = \OCA\Files\Helper::populateTags(array($meta));
			$fileInfo = \OCA\Files\Helper::formatFileInfo(current($meta));
			$fileInfo['path'] = dirname($normalizedNewPath);
			$result['success'] = true;
			$result['data'] = $fileInfo;
		} else {
			// rename failed
			$result['data'] = array(
				'message'	=> $this->l10n->t('%s could not be renamed', array($oldname))
			);
		}
		return $result;
	}
	public static function sql_ca_info($user){

		$sql_config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);

		$conn = mysql_connect($sql_config['db']['host'],$sql_config['db']['user'],$sql_config['db']['passwd']) or die(var_dump($sql_config));

		mysql_select_db($sql_config['db']['name'],$conn);

		mysql_query("set names 'utf8'");

		$sql_group_info = 'SELECT groupid FROM GroupUser WHERE userid='.$user;

		$result=mysql_query($sql_group_info);
		$i = 0;
		while ( $row=mysql_fetch_row($result) ) {
			$arr_groupid[$i++] = $row;
		};
		return $arr_groupid;
	}
	
	public static function sql_ca_gname($id){

		$sql_config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);

		$conn = mysql_connect($sql_config['db']['host'],$sql_config['db']['user'],$sql_config['db']['passwd']) or die("database for cc have a error");

		mysql_select_db($sql_config['db']['name'],$conn);

		mysql_query("set names 'utf8'");

		$sql_group_info = 'SELECT groupname,groupspacequota FROM grouplist WHERE groupid='.$id.' AND groupspaceenable=1';

		$result=mysql_query($sql_group_info);
		
		$row=mysql_fetch_row($result);
	
		return $row;
	}

	public static function st_define($g_id){
		$path = "/var/storage/group/".$g_id;
		if(is_dir($path)){
			return true;
		}
	}

	public static function sql_suffix($fix){

		$sql_config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);

		$conn = mysql_connect($sql_config['db']['host'],$sql_config['db']['user'],$sql_config['db']['passwd']) or die("database for cc have a error");

		mysql_select_db($sql_config['db']['name'],$conn);

		mysql_query("set names 'utf8'");

		$sql_appid_info = 'SELECT appid FROM appsuffix where suffix='."'".$fix."'";

		$result=mysql_query($sql_appid_info);
		$appid_info=array();
		while($row=mysql_fetch_row($result)){
		array_push($appid_info, $row[0]);
		}
		return $appid_info;
	}

	public static function cu_curl($url,$uid){
		$headers=array('owncloudAccsessAction:'.$uid);
		$ch = curl_init();
		$options = array(
                CURLOPT_URL => $url,
                CURLOPT_HEADER => false,
                CURLOPT_NOBODY => false,
                CURLOPT_POST => true,
                CURLOPT_TIMEOUT => 20,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0
        );
        curl_setopt_array($ch, $options);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        $code = curl_errno($ch);
        curl_close($ch);
        return $result;
         mysql_close();
	}

	public static function sql_appname($id){

		$sql_config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);

		$conn = mysql_connect($sql_config['db']['host'],$sql_config['db']['user'],$sql_config['db']['passwd']) or die("database for cc have a error");

		mysql_select_db($sql_config['db']['name'],$conn);

		mysql_query("set names 'utf8'");

		$sql_appname = 'SELECT name FROM application where id='.$id;

		$result=mysql_query($sql_appname);
		while($row=mysql_fetch_row($result)){
			return $row[0];
		}
		mysql_close();
	}


	public static function reset(){
		var_dump($_SESSION["user_id"]);
	}

/*	public static function w_log(){
		$loginfo = $_POST['loginfo'];
		$loginfo = json_decode($loginfo);

		if(isset($loginfo)){
			$sql_config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);

			$conn = mysql_connect($sql_config['db']['host'],$sql_config['db']['user'],$sql_config['db']['passwd']) or die("database for cc have a error");

			mysql_select_db($sql_config['db']['name'],$conn);

			mysql_query("set names 'utf8'");	

			$username = $_SESSION['loginname'];
			$ctime = date('Y-m-d H:i:s');
			$sql_log = "INSERT INTO ownappinfo (username，appid，appname，file, ctime)
			VALUES (".$username.",".$loginfo['id'].",".$loginfo['name'].",".$loginfo['file'].",".$ctime.")";
			$result=mysql_query($sql_log);

			mysql_close();
			exit;
		}else{

		}
	}*/

		public static function sql_ca_uname($id){

		$sql_config = parse_ini_file('/var/www/cos/cmt/cloudstorage.ini', true);

		$conn = mysql_connect($sql_config['db']['host'],$sql_config['db']['user'],$sql_config['db']['passwd']) or die("database for cc have a error");

		mysql_select_db($sql_config['db']['name'],$conn);

		mysql_query("set names 'utf8'");

		$sql_user_info = 'SELECT username,userspacequota FROM user WHERE userid='.$id.' AND userspaceenable=1';

		$result=mysql_query($sql_user_info);
		
		$row=mysql_fetch_row($result);
	
		return $row;
	}

}
