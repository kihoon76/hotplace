/**
 * @namespace hotplace.login
 */
(function(login, $) {
	var _btnId = '#btnLogin',
		_btnLogoutYes = '#btnLogoutYes',
		_btnLogoutNo = '#btnLogoutNo';
	
	function _changeLoginMenu($btn) {
		var rmClass = $btn.hasClass('glyphicon-log-in') ? 'glyphicon-log-in' : 'glyphicon-log-out';
		var addClass = '',	title = '', gubun = '';
		
		if(rmClass == 'glyphicon-log-in') {
			gubun = 'OUT'
			addClass = 'glyphicon-log-out';
			title = '로그아웃';
		}
		else {
			gubun = 'IN';
			addClass = 'glyphicon-log-in';
			title = '로그인';
		}
		
		$btn.data('gubun', gubun);
		$btn.removeClass(rmClass);
		$btn.addClass(addClass);
		$btn.tooltipster('content', title);
	}
	
	
	$(document).on('click', _btnId, function() {
		var id = $('#id').val(),
			pw = $('#pw').val();
		
		hotplace.ajax({
			url: 'login',
			method: 'POST',
			dataType: 'text',
			data: $('#loginFm').serialize(),
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				if(jo.success) {
					//var r = (hotplace.dom.getCurrentFnAfterModalClose())(true);
					var $menuBtn = $('#' + hotplace.dom.getMenuBtn().USER_LOGIN);
					
					_changeLoginMenu($menuBtn);
					hotplace.dom.closeModal();
				}
			},
			error: function(data, textStatus, jqXHR) {
				console.log(data)
			}
		});
	});
	
	$(document).on('click', _btnLogoutYes, function() {
		hotplace.dom.logout(function() {
			/*var $menuBtn = $('#' + hotplace.dom.getMenuBtn().USER_LOGIN);
			_changeLoginMenu($menuBtn);
			hotplace.dom.closeModal();*/
			window.location.reload();
		});
	});
	
	$(document).on('click', _btnLogoutNo, function() {
		hotplace.dom.closeModal();
	});
}(
		hotplace.login = hotplace.login || {},
		jQuery
));