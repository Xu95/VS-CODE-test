<div id="controls">
		<div class="actions creatable hidden">
			<?php if(!isset($_['dirToken'])):?>
			<div id="new" class="button">
				<a><?php p($l->t('新建'));?></a>
				<ul>
					<li class="icon-filetype-text svg"
						data-type="file" data-newname="<?php p($l->t('新建文本文件')) ?>.txt">
						<p><?php p($l->t('文本文档'));?></p>
					</li>
					<li class="icon-filetype-folder svg"
						data-type="folder" data-newname="<?php p($l->t('新建文件夹')) ?>">
						<p><?php p($l->t('文件夹'));?></p>
					</li>
				</ul>
			</div>
			<?php endif;?>
			<?php /* Note: the template attributes are here only for the public page. These are normally loaded
					 through ajax instead (updateStorageStatistics).
			*/ ?>
			<div id="upload" class="button"
				 title="<?php isset($_['uploadMaxHumanFilesize']) ? p($l->t('上传(最大 %s)', array($_['uploadMaxHumanFilesize']))) : '' ?>">
					<input type="hidden" id="max_upload" name="MAX_FILE_SIZE" value="<?php isset($_['uploadMaxFilesize']) ? p($_['uploadMaxFilesize']) : '' ?>">
					<input type="hidden" id="upload_limit" value="<?php isset($_['uploadLimit']) ? p($_['uploadLimit']) : '' ?>">
					<input type="hidden" id="free_space" value="<?php isset($_['freeSpace']) ? p($_['freeSpace']) : '' ?>">
					<?php if(isset($_['dirToken'])):?>
					<input type="hidden" id="publicUploadRequestToken" name="requesttoken" value="<?php p($_['requesttoken']) ?>" />
					<input type="hidden" id="dirToken" name="dirToken" value="<?php p($_['dirToken']) ?>" />
					<?php endif;?>
					<input type="hidden" class="max_human_file_size"
						   value="(max <?php isset($_['uploadMaxHumanFilesize']) ? p($_['uploadMaxHumanFilesize']) : ''; ?>)">
					<input type="file" id="file_upload_start" name='files[]'
						   data-url="<?php print_unescaped(OCP\Util::linkTo('files', 'ajax/upload.php')); ?>" />
					<label for="file_upload_start" class="svg icon-upload">
						<span class="hidden-visually"><?php p($l->t('上传'))?></span>
					</label>
			</div>
			<div id="uploadprogresswrapper">
				<div id="uploadprogressbar"></div>
				<button class="stop icon-close" style="display:none">
					<span class="hidden-visually">
						<?php p($l->t('取消上传'))?>
					</span>
				</button>
			</div>
		</div>
		<!-- <div id="file_action_panel"></div> -->
		<div class="notCreatable notPublic hidden">
			<?php p($l->t('您没有权限上传和创建'))?>
		</div>
	<input type="hidden" name="permissions" value="" id="permissions">
</div>

<div id="emptycontent" class="hidden">
	<div class="icon-folder"></div>
	<h2><?php p($l->t('没有文件')); ?></h2>
	<p class="uploadmessage hidden"><?php p($l->t('上传一些内容或者与设备同步')); ?></p>
</div>

<div class="nofilterresults emptycontent hidden">
	<div class="icon-search"></div>
	<h2><?php p($l->t('该文件夹没有文件')); ?></h2>
	<p></p>
</div>

<table id="filestable" data-allow-public-upload="<?php p($_['publicUploadEnabled'])?>" data-preview-x="36" data-preview-y="36">
	<thead>
		<tr>
			<th id='headerName' class="hidden column-name">
				<div id="headerName-container">
					<input type="checkbox" id="select_all_files" class="select-all"/>
					<label for="select_all_files">
						<span class="hidden-visually"><?php p($l->t('全选'))?></span>
					</label>
					<a class="name sort columntitle" data-sort="name"><span><?php p($l->t( '名称' )); ?></span><span class="sort-indicator"></span></a>
					<span id="selectedActionsList" class="selectedActions">
						<span class="selectedActions"><a href="" class="delete-selected">
                            <?php p($l->t('删除'))?>
                            <img class="svg" alt=""
                                 src="<?php print_unescaped(OCP\image_path("core", "actions/delete.svg")); ?>" />
                        </a></span>
					</span>
				</div>
			</th>
			<th id="headerSize" class="column-size">
				<a class="size sort columntitle" data-sort="size"><span>大小</span><span class="sort-indicator"></span></a>
			</th>
			<th id="headerDate" class="hidden column-mtime">
				<a id="modified" class="columntitle" data-sort="mtime"><span><?php p($l->t( '修改')); ?></span><span class="sort-indicator"></span></a>
			</th>
		</tr>
	</thead>
	<tbody id="fileList">
	</tbody>
	<tfoot>
	</tfoot>
</table>
<input type="hidden" name="dir" id="dir" value="" />
<div id="editor"></div><!-- FIXME Do not use this div in your app! It is deprecated and will be removed in the future! -->
<div id="uploadsize-message" title="<?php p($l->t('上传文件过大'))?>">
	<p>
	<?php p($l->t('您正尝试上传的文件超过了此服务器可以上传的最大容量限制'));?>
	</p>
</div>
<div id="scanning-message">
	<h3>
		<?php p($l->t('文件正在被扫描，请稍候。'));?> <span id='scan-count'></span>
	</h3>
	<p>
		<?php p($l->t('正在扫描'));?> <span id='scan-current'></span>
	</p>
</div>
