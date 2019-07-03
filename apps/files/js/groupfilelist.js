$(document).ready(function() {
	(function(OCA) {
		/**
		 * @class OCA.Files.GroupFileList
		 * @augments OCA.Files.GroupFileList
		 *
		 * @classdesc Favorites file list.
		 * Displays the list of files marked as favorites
		 *
		 * @param $el container element with existing markup for the #controls
		 * and a table
		 * @param [options] map of options, see other parameters
		 */
		var GroupFileList = function($el, options) {
			this.initialize($el, options);
		};
		GroupFileList.prototype = _.extend({}, OCA.Files.FileList.prototype,
			/** @lends OCA.Files.GroupFileList.prototype */ {
			id: 'Group',
			appName: t('files','Group'),

			//_clientSideSort: true,
			//_allowSelection: false,

			/**
			 * @private
			 */
			initialize: function($el, options) {
				OCA.Files.FileList.prototype.initialize.apply(this, arguments);
				if (this.initialized) {
					return;
				}
				//attach
				OC.Plugins.attach('OCA.Files.GroupFileList', this);
			},

			updateEmptyContent: function() {
				var dir = this.getCurrentDirectory();
				if (dir === '/') {
					// root has special permissions
					this.$el.find('#emptycontent').toggleClass('hidden', !this.isEmpty);
					this.$el.find('#filestable thead th').toggleClass('hidden', this.isEmpty);
				}
				else {
					OCA.Files.FileList.prototype.updateEmptyContent.apply(this, arguments);
				}
			},

			// getDirectoryPermissions: function() {
			// 	return OC.PERMISSION_READ | OC.PERMISSION_DELETE;
			// },

			updateStorageStatistics: function() {
				// no op because it doesn't have
				// storage info like free space / used space
			},

			reload: function() {
				this._selectedFiles = {};
				this._selectionSummary.clear();
				this.$el.find('.select-all').prop('checked', false);
				this.showMask();
				if (this._reloadCall) {
					this._reloadCall.abort();
				}
				this._reloadCall = $.ajax({
					url: this.getAjaxUrl('list'),
					data: {
						dir : this.getCurrentDirectory(),
						sort: this._sort,
						sortdirection: this._sortDirection
					}
				});
				var callBack = this.reloadCallback.bind(this);
				return this._reloadCall.then(callBack, callBack);
			},

			// reloadCallback: function(result) {
			// 	delete this._reloadCall;
			// 	this.hideMask();

			// 	if (result.files) {
			// 		this.setFiles(result.files.sort(this._sortComparator));
			// 	}
			// 	else {
			// 		// TODO: error handling
			// 	}
			// }
		});

		OCA.Files.GroupFileList = GroupFileList;
		//OCA.Files.FileList = GroupFileList;
	})(OCA);
});

