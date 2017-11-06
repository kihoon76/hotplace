/**
 * @namespace hotplace.login
 */
(function(login, $) {
	var _btnId = '#btnLogin';
	
	$(document).on('click', _btnId, function() {
		var id = $('#id').val(),
			pw = $('#pw').val();
		
		hotplace.ajax({
			url: 'login',
			method: 'GET',
			dataType: 'text',
			success: function(data, textStatus, jqXHR) {
				
			}
		});
	});
}(
		hotplace.login = hotplace.login || {},
		jQuery
));