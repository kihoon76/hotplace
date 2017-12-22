/**
 * @namespace hotplace.location
 */
(function(location, $) {
	//location.
	
	location.viewLLU = {
	}
	
	location.viewGwansim = function() {
		var _viewGwansimInit = false;
		
		return {
			init: function() {
				if(_viewGwansimInit) return;
				
				$('#dvCateGwansim .save').click(function(){
					$('#dvCateGwansim .message').show();
				});
				
				$('#dvCateGwansim .confirm').click(function(){
					$('#dvCateGwansim .message').hide();
				});
				
				_viewGwansimInit = true;
			}	
		}
	}();
	
	location.viewMaemul = function() {
		var _viewMaemulInit = false;
		var _fileUp = null;
		
		function _save(data) {
			if(_fileUp) {
				_fileUp.update({
					formData: data
				});
				_fileUp.startUpload();
			}
		}
		
		function _onSuccess(files, data, xhr) {
			console.log(xhr);
		}
		
		function _onError(files, status, errMsg) {
			console.log(errMsg);
		}
		
		function _onSelect(files) {
			
		}
		
		return {
			init: function(param) {
				if(_viewMaemulInit) return;
				_fileUp = $('#fileUp').uploadFile({
					url: hotplace.getContextUrl() + 'upload/maemul',
					fileName: 'file',
					showCancel: true,
					showDone: true,
					autoSubmit: false,
					showPreview: true,
					dragdropWidth: '250px',
					previewWidth: '100px',
					previewHeight: '100px',
					statusBarWidth: '200px',
					allowedTypes: 'jpg,png,gif',
					returnType: 'json',
					//dragDropStr: '끌어다 놓기',
					maxFileCount: 3,
					onSuccess: _onSuccess,
					onError: _onError
				});
				
				$(document).on('click', '#btnRegMaemulSave', function() {
					var formData = {
						pnu: ''
					}
					_save();
				});
				
				_viewMaemulInit = true;
			},
			regist: function() {
				if(_fileUp) {
					/*_fileUp.update({
						formData: {}
					});*/
					_fileUp.startUpload();
				}
			}
		}
	}();
		
	
		
		

	
}(
	hotplace.location = hotplace.location || {},
	jQuery
));