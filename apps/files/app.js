/*
 * Copyright (c) 2014
 *
 * @author Vincent Petry
 * @copyright 2014 Vincent Petry <pvince81@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

/* global dragOptions, folderDropOptions */
(function() {

	if (!OCA.Files) {
		/**
		 * Namespace for the files app
		 * @namespace OCA.Files
		 */
		OCA.Files = {};
	}

	/**
	 * @namespace OCA.Files.App
	 */
	OCA.Files.App = {
		/**
		 * Navigation control
		 *
		 * @member {OCA.Files.Navigation}
		 */
		navigation: null,

		/**
		 * File list for the "All files" section.
		 *
		 * @member {OCA.Files.FileList}
		 */
		fileList: null,

		/**
		 * Initializes the files app
		 */
		initialize: function() {
			this.navigation = new OCA.Files.Navigation($('#app-navigation'));

			var urlParams = OC.Util.History.parseUrlQuery();
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

			this.files = OCA.Files.Files;

			// TODO: ideally these should be in a separate class / app (the embedded "all files" app)
			//初始化多个
			this.fileList = new OCA.Files.FileList(
				$('#app-content-files'), {
					scrollContainer: $('#app-content'),
					dragOptions: dragOptions,
					folderDropOptions: folderDropOptions,
					fileActions: fileActions,
					allowLegacyActions: true,
					scrollTo: urlParams.scrollto
				}
			);
			
			//this.fileList = new OCA.Files.FileList(
			// 	$("#app-content > div[id^='app-content-files']"), {
			// 		scrollContainer: $('#app-content'),
			// 		dragOptions: dragOptions,
			// 		folderDropOptions: folderDropOptions,
			// 		fileActions: fileActions,
			// 		allowLegacyActions: true,
			// 		scrollTo: urlParams.scrollto
			// 	}
			// );
			//yosang
			// $("#app-content > div[id^='app-content-filesgroup']").each(function(index){
			// 	new OCA.Files.FileList(
			// 		$(this), {
			// 			scrollContainer: $('#app-content'),
			// 			dragOptions: dragOptions,
			// 			folderDropOptions: folderDropOptions,
			// 			fileActions: fileActions,
			// 			allowLegacyActions: true,
			// 			scrollTo: urlParams.scrollto
			// 		}
			// 	);

			// })
			this.files.initialize();

			// for backward compatibility, the global FileList will
			// refer to the one of the "files" view
			window.FileList = this.fileList;

			OC.Plugins.attach('OCA.Files.App', this);

			this._setupEvents();
			// trigger URL change event handlers
			this._onPopState(urlParams);
		},

		/**
		 * Destroy the app
		 */
		destroy: function() {
			this.navigation = null;
			this.fileList.destroy();
			this.fileList = null;
			this.files = null;
			OCA.Files.fileActions.off('setDefault.app-files', this._onActionsUpdated);
			OCA.Files.fileActions.off('registerAction.app-files', this._onActionsUpdated);
			window.FileActions.off('setDefault.app-files', this._onActionsUpdated);
			window.FileActions.off('registerAction.app-files', this._onActionsUpdated);
		},

		_onActionsUpdated: function(ev, newAction) {
			// forward new action to the file list
			if (ev.action) {
				this.fileList.fileActions.registerAction(ev.action);
			} else if (ev.defaultAction) {
				this.fileList.fileActions.setDefault(
					ev.defaultAction.mime,
					ev.defaultAction.name
				);
			}
		},

		/**
		 * Returns the container of the currently visible app.
		 *
		 * @return app container
		 */
		getCurrentAppContainer: function() {
			return this.navigation.getActiveContainer();
		},

		/**
		 * Sets the currently active view
		 * @param viewId view id
		 */
		setActiveView: function(viewId, options) {
			this.navigation.setActiveItem(viewId, options);
		},

		/**
		 * Returns the view id of the currently active view
		 * @return view id
		 */
		getActiveView: function() {
			return this.navigation.getActiveItem();
		},

		/**
		 * Setup events based on URL changes
		 */
		_setupEvents: function() {
			OC.Util.History.addOnPopStateHandler(_.bind(this._onPopState, this));

			// detect when app changed their current directory
			$('#app-content').delegate('>div', 'changeDirectory', _.bind(this._onDirectoryChanged, this));
			$('#app-content').delegate('>div', 'changeViewerMode', _.bind(this._onChangeViewerMode, this));

			$('#app-navigation').on('itemChanged', _.bind(this._onNavigationChanged, this));
		},

		/**
		 * Event handler for when the current navigation item has changed
		 */
		_onNavigationChanged: function(e) {
			//yosang
			var params;
			var reg = /filesgroup/;
			var idstr = e.itemId;
			if (e && idstr) {
				if(reg.test(idstr)){
					params = {
						view: idstr,
						dir: '/'+idstr.slice(10,idstr.length+1)
					};
				}else{
					params = {
						view: idstr,
						// dir: '/personal'
						dir: '/'
					};
				}
				
				this._changeUrl(params.view, params.dir);
				this.navigation.getActiveContainer().trigger(new $.Event('urlChanged', params));
			}
		},

		/**
		 * Event handler for when an app notified that its directory changed
		 */
		_onDirectoryChanged: function(e) {
			if (e.dir) {
				this._changeUrl(this.navigation.getActiveItem(), e.dir);
			}
		},

		/**
		 * Event handler for when an app notifies that it needs space
		 * for viewer mode.
		 */
		_onChangeViewerMode: function(e) {
			var state = !!e.viewerModeEnabled;
			$('#app-navigation').toggleClass('hidden', state);
			$('.app-files').toggleClass('viewer-mode no-sidebar', state);
		},

		/**
		 * Event handler for when the URL changed
		 */
		_onPopState: function(params) {
			params = _.extend({
				dir: '/personal',
				view: 'files'
			}, params);
			var lastId = this.navigation.getActiveItem();
			if (!this.navigation.itemExists(params.view)) {
				params.view = 'files';
			}
			this.navigation.setActiveItem(params.view, {silent: true});
			if (lastId !== this.navigation.getActiveItem()) {
				this.navigation.getActiveContainer().trigger(new $.Event('show'));
			}
			this.navigation.getActiveContainer().trigger(new $.Event('urlChanged', params));
		},

		_setnavbg: function() {
			$('#app-navigation ul li a').each(function(){
				if($(this).attr("class").indexOf("group")!=-1){
					$(this).css("background-image","url('http://172.20.156.168/owncloud/apps/files/img/timg.png')");
				}
			});
		},

		/**
		 * Change the URL to point to the given dir and view
		 */
		_changeUrl: function(view, dir) {
			var params = {dir: dir};
			if (view !== 'files') {
				params.view = view;
			}
			OC.Util.History.pushState(params);
		}
	};
})();

$(document).ready(function() {
	// wait for other apps/extensions to register their event handlers and file actions
	// in the "ready" clause
	//alert(111);
	OCA.Files.App._setnavbg();
	_.defer(function() {
		OCA.Files.App.initialize();
	});
});

