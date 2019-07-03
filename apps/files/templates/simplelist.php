<div id="controls">
	<div id="file_action_panel"></div>
</div>
<div id='notification'></div>

<div id="emptycontent" class="hidden">
	<div class="icon-starred"></div>
	<h2><?php p($l->t('无收藏的文件')); ?></h2>
	<p><?php p($l->t('收藏的文件和文件夹会在这里显示')); ?></p>
</div>

<input type="hidden" name="dir" value="" id="dir">

<div class="nofilterresults hidden">
	<div class="icon-search"></div>
	<h2><?php p($l->t('此文件夹中未找到条目')); ?></h2>
	<p></p>
</div>

<table id="filestable">
	<thead>
		<tr>
			<th id='headerName' class="hidden column-name">
				<div id="headerName-container">
					<a class="name sort columntitle" data-sort="name"><span><?php p($l->t( '名称' )); ?></span><span class="sort-indicator"></span></a>
				</div>
			</th>
			<th id="headerSize" class="hidden column-size">
				<a class="size sort columntitle" data-sort="size"><span><?php p($l->t('大小')); ?></span><span class="sort-indicator"></span></a>
			</th>
			<th id="headerDate" class="hidden column-mtime">
				<a id="modified" class="columntitle" data-sort="mtime"><span><?php p($l->t( '修改' )); ?></span><span class="sort-indicator"></span></a>
					<span class="selectedActions"><a href="" class="delete-selected">
						<?php p($l->t('删除'))?>
						<img class="svg" alt="<?php p($l->t('删除'))?>"
							 src="<?php print_unescaped(OCP\image_path("core", "actions/delete.svg")); ?>" />
					</a></span>
			</th>
		</tr>
	</thead>
	<tbody id="fileList">
	</tbody>
	<tfoot>
	</tfoot>
</table>

