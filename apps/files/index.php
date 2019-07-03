<?php
/**
 * @author Björn Schießle <schiessle@owncloud.com>
 * @author Frank Karlitschek <frank@owncloud.org>
 * @author Jakob Sack <mail@jakobsack.de>
 * @author Jan-Christoph Borchardt <hey@jancborchardt.net>
 * @author Joas Schilling <nickvergessen@owncloud.com>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <icewind@owncloud.com>
 * @author Roman Geber <rgeber@owncloudapps.com>
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

// Check if we are a user
OCP\User::checkLoggedIn();

// Load the files we need
OCP\Util::addStyle('files', 'files');
OCP\Util::addStyle('files', 'upload');
OCP\Util::addStyle('files', 'mobile');
OCP\Util::addStyle('files', 'layer');
OCP\Util::addscript('files', 'config');
OCP\Util::addscript('files', 'app');
OCP\Util::addscript('files', 'file-upload');
OCP\Util::addscript('files', 'jquery.iframe-transport');
OCP\Util::addscript('files', 'jquery.fileupload');
OCP\Util::addscript('files', 'jquery-visibility');
OCP\Util::addscript('files', 'filesummary');
OCP\Util::addscript('files', 'breadcrumb');
OCP\Util::addscript('files', 'filelist');
OCP\Util::addscript('files', 'search');

\OCP\Util::addScript('files', 'favoritesfilelist');
\OCP\Util::addScript('files', 'tagsplugin');
\OCP\Util::addScript('files', 'favoritesplugin');
\OCP\Util::addScript('files', 'qwebchannel');
\OCP\Util::addScript('files', 'client');
\OCP\Util::addScript('files', 'groupfilelist');
\OCP\Util::addScript('files', 'groupplugin');
\OCP\Util::addScript('files', 'layer');
\OCP\Util::addScript('files', 'checklogin');
\OCP\Util::addScript('files', 'ownapp');
\OCP\Util::addScript('config', 'jquery.cookie');

\OC_Util::addVendorScript('core', 'handlebars/handlebars');

OCP\App::setActiveNavigationEntry('files_index');

$l = \OC::$server->getL10N('files');

$isIE8 = false;
preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
if (count($matches) > 0 && $matches[1] <= 9) {
	$isIE8 = true;
}

// if IE8 and "?dir=path&view=someview" was specified, reformat the URL to use a hash like "#?dir=path&view=someview"
if ($isIE8 && (isset($_GET['dir']) || isset($_GET['view']))) {
	$hash = '#?';
	$dir = isset($_GET['dir']) ? $_GET['dir'] : '/personal';
	$view = isset($_GET['view']) ? $_GET['view'] : 'files';
	$hash = '#?dir=' . \OCP\Util::encodePath($dir);
	if ($view !== 'files') {
		$hash .= '&view=' . urlencode($view);
	}
	header('Location: ' . OCP\Util::linkTo('files', 'index.php') . $hash);
	exit();
}

$user = OC_User::getUser();

$config = \OC::$server->getConfig();

// mostly for the home storage's free space
$dirInfo = \OC\Files\Filesystem::getFileInfo('/', false);
$storageInfo=OC_Helper::getStorageInfo('/', $dirInfo);

$nav = new OCP\Template('files', 'appnavigation', '');

function sortNavigationItems($item1, $item2) {
	return $item1['order'] - $item2['order'];
}
$group = \OCA\Files\App::sql_ca_info($user);
$groupinfo['id'] = 'groupfiles';
$groupinfo['appname'] = 'files';
$groupinfo['script'] = 'list.php';
$groupinfo['order'] = 0;
$groupinfo['name'] = 'filesgroup';
for($i=0;$i<sizeof($group);$i++){
	if(\OCA\Files\App::sql_ca_gname($group[$i][0])){
		$groupinfo['id'] = 'filesgroup'.$group[$i][0];
		$groupinfo['order'] = $i+1;
		$info = \OCA\Files\App::sql_ca_gname($group[$i][0]);
		$groupinfo['name'] = "共享文档".$info[0]."  (".$info[1]/(1024*1024*1024)."GB)";
		//yosang
		$groupinfo['dir'] = '/'+$i+1;
		\OCA\Files\App::getNavigationManager()->add($groupinfo);
	}
}

/*\OCA\Files\App::getNavigationManager()->add(
	array(
		'id' => 'favorites',
		'appname' => 'files',
		'script' => 'simplelist.php',
		'order' => 10,
		'name' => $l->t('Favorites')
	)
);*/


$navItems = \OCA\Files\App::getNavigationManager()->getAll();
usort($navItems, 'sortNavigationItems');
$nav->assign('navigationItems', $navItems);

$contentItems = array();

function renderScript($appName, $scriptName) {
	$content = '';
	$appPath = OC_App::getAppPath($appName);
	$scriptPath = $appPath . '/' . $scriptName;
	if (file_exists($scriptPath)) {
		// TODO: sanitize path / script name ?
		ob_start();
		include $scriptPath;
		$content = ob_get_contents();
		@ob_end_clean();
	}
	return $content;
}

// render the container content for every navigation item
foreach ($navItems as $item) {
	$content = '';
	if (isset($item['script'])) {
		$content = renderScript($item['appname'], $item['script']);
	}
	$contentItem = array();
	$contentItem['id'] = $item['id'];
	$contentItem['content'] = $content;
	$contentItems[] = $contentItem;
}

OCP\Util::addscript('files', 'fileactions');
OCP\Util::addscript('files', 'files');
OCP\Util::addscript('files', 'navigation');
OCP\Util::addscript('files', 'keyboardshortcuts');
$tmpl = new OCP\Template('files', 'index', 'user');
$tmpl->assign('usedSpacePercent', (int)$storageInfo['relative']);
$tmpl->assign('owner', $storageInfo['owner']);
$tmpl->assign('ownerDisplayName', $storageInfo['ownerDisplayName']);
$tmpl->assign('isPublic', false);
$tmpl->assign("mailNotificationEnabled", $config->getAppValue('core', 'shareapi_allow_mail_notification', 'yes'));
$tmpl->assign("mailPublicNotificationEnabled", $config->getAppValue('core', 'shareapi_allow_public_notification', 'yes'));
$tmpl->assign("allowShareWithLink", $config->getAppValue('core', 'shareapi_allow_links', 'yes'));
$tmpl->assign('appNavigation', $nav);
$tmpl->assign('appContents', $contentItems);

$tmpl->printPage();
