/*
 * Copyright (c) 2014 Vincent Petry <pvince81@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OCA) {
	/**
	 * @namespace OCA.Files.GroupPlugin
	 *
	 * Registers the favorites file list from the files app sidebar.
	 */
	OCA.Files.GroupPlugin = {
		name: 'Group',

		/**
		 * @type OCA.Files.GroupPlugin
		 */
		groupFileList: null,

		//yosang
		groupFileListArray: null,
		//yosang
		groupindex:null,

		attach: function() {
			var self = this;
			if(!this.groupFileListArray){
				this.groupFileListArray = new Array($("#app-content > div[id^='app-content-filesgroup']").length);
			}
			$("#app-content > div[id^='app-content-filesgroup']").each(function(index){
				$(this).on('show.plugin-group', function(e) {
					self.showFileList($(e.target));
				});
				$(this).on('hide.plugin-group', function() {
					self.hideFileList();
				});
			})
			// $('#app-content-filesgroup1').on('show.plugin-group', function(e) {
			// 	self.showFileList($(e.target));
			// });
			// $('#app-content-filesgroup1').on('hide.plugin-group', function() {
			// 	self.hideFileList();
			// });
		},

		detach: function() {
			if (this.groupFileList) {
				this.groupFileList.destroy();
				OCA.Files.fileActions.off('setDefault.plugin-group', this._onActionsUpdated);
				OCA.Files.fileActions.off('registerAction.plugin-group', this._onActionsUpdated);
				$('#app-content-group').off('.plugin-group');
				this.groupFileList = null;
			}
		},

		showFileList: function($el,index) {
			var elidstr = $el.attr('id');
			// var index = elidstr.slice(elidstr.length-1,elidstr.length);
			var index = elidstr.slice(22,elidstr.length+1);
			//这里确定要show哪个
			if (!(this.groupFileListArray)[index]) {
				//console.log((this.groupFileListArray)[index])
				(this.groupFileListArray)[index] = this._createGroupFileList($el,index);
				//this.groupFileList = this._createGroupFileList($el);
			}
			this.groupFileList = (this.groupFileListArray)[index];
			window.GroupFileList = this.groupFileList;
			window.commonFileList = window.GroupFileList;
			return this.groupFileList;
		},

		hideFileList: function() {
			if (this.groupFileList) {
				this.groupFileList.$fileList.empty();
			}
		},

		/**
		 * Creates the favorites file list.
		 *
		 * @param $el container for the file list
		 * @return {OCA.Files.FavoritesFileList} file list
		 */
		_createGroupFileList: function($el,index) {
			var fileActions = this._createFileActions(index);
			// register favorite list for sidebar section
			return new OCA.Files.GroupFileList(
				$el, {
					fileActions: fileActions,
					scrollContainer: $('#app-content')
				}
			);
		},

		_createFileActions: function(index) {
			// // inherit file actions from the files app
			// var fileActions = new OCA.Files.FileActions();
			// // note: not merging the legacy actions because legacy apps are not
			// // compatible with the sharing overview and need to be adapted first
			// fileActions.registerDefaultActions();
			// fileActions.merge(OCA.Files.fileActions);

			// if (!this._globalActionsInitialized) {
			// 	// in case actions are registered later
			// 	this._onActionsUpdated = _.bind(this._onActionsUpdated, this);
			// 	OCA.Files.fileActions.on('setDefault.plugin-favorites', this._onActionsUpdated);
			// 	OCA.Files.fileActions.on('registerAction.plugin-favorites', this._onActionsUpdated);
			// 	this._globalActionsInitialized = true;
			// }

			// // when the user clicks on a folder, redirect to the corresponding
			// // folder in the files app instead of opening it directly
			// fileActions.register('dir', 'Open', OC.PERMISSION_READ, '', function (filename, context) {
			// 	console.log('filesgroup'+index)
			// 	OCA.Files.App.setActiveView('files', {silent: true});
			// 	console.log(context.$file.attr('data-path'));
			// 	//OCA.Files.App.fileList.changeDirectory(context.$file.attr('data-path') + '/' + filename, true, true);
			// 	OCA.Files.App.fileList.changeDirectory(window.ytargetDir + '/' + filename, true, true);
			// });
			// fileActions.setDefault('dir', 'Open');

			// var fileActions = new OCA.Files.FileActions();
			// // default actions
			// fileActions.registerDefaultActions();
			// // legacy actions
			// fileActions.merge(window.FileActions);
			// // regular actions
			// fileActions.merge(OCA.Files.fileActions);

			// this._onActionsUpdated = _.bind(this._onActionsUpdated, this);
			// OCA.Files.fileActions.on('setDefault.app-files', this._onActionsUpdated);
			// OCA.Files.fileActions.on('registerAction.app-files', this._onActionsUpdated);
			// window.FileActions.on('setDefault.app-files', this._onActionsUpdated);
			// window.FileActions.on('registerAction.app-files', this._onActionsUpdated);


			var fileActions = new OCA.Files.FileActions();
			// default actions
			fileActions.registerDefaultActions();
			// legacy actions
			fileActions.merge(window.FileActions);
			// regular actions
			fileActions.merge(OCA.Files.fileActions);

			this._onActionsUpdated = _.bind(this._onActionsUpdated, this);
			OCA.Files.fileActions.on('setDefault.app-files', this._onActionsUpdated);
			OCA.Files.fileActions.on('registerAction.app-files', this._onActionsUpdated);
			window.FileActions.on('setDefault.app-files', this._onActionsUpdated);
			window.FileActions.on('registerAction.app-files', this._onActionsUpdated);
			return fileActions;
		},

		_onActionsUpdated: function(ev) {
			if (ev.action) {
				this.groupFileList.fileActions.registerAction(ev.action);
			} else if (ev.defaultAction) {
				this.groupFileList.fileActions.setDefault(
					ev.defaultAction.mime,
					ev.defaultAction.name
				);
			}
		}
	};

})(OCA);
OC.Plugins.register('OCA.Files.App', OCA.Files.GroupPlugin);

