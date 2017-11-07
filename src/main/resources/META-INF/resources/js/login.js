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
			method: 'POST',
			dataType: 'text',
			data: $('#loginFm').serialize(),
			success: function(data, textStatus, jqXHR) {
				console.log(data)
			},
			error: function(data, textStatus, jqXHR) {
				console.log(data)
			}
		});
	});
}(
		hotplace.login = hotplace.login || {},
		jQuery
));