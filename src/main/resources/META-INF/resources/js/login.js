/**
 * @namespace hotplace.login
 */
(function(login, $) {
	var _btnId = '#btnLogin',
		_btnLogoutYes = '#btnLogoutYes',
		_btnJoinPrev = '#dvJoinBtnPrev',
		_btnJoinNext = '#btnJoinNext',
		_btnjoinCheck = '#dvJoinBtnCheck',
		_btnJoinCheckSubmit = '#dvJoinCheckBtnSubmit',
		_btnJoinCheckCancel = '#dvJoinCheckBtnCancel',
		_btnLogoutNo = '#btnLogoutNo';
	
//	function _changeLoginMenu($btn) {
//		var rmClass = $btn.hasClass('glyphicon-log-in') ? 'glyphicon-log-in' : 'glyphicon-log-out';
//		var addClass = '',	title = '', gubun = '';
//		
//		if(rmClass == 'glyphicon-log-in') {
//			gubun = 'OUT'
//			addClass = 'glyphicon-log-out';
//			title = '로그아웃';
//		}
//		else {
//			gubun = 'IN';
//			addClass = 'glyphicon-log-in';
//			title = '로그인';
//		}
//		
//		$btn.data('gubun', gubun);
//		$btn.removeClass(rmClass);
//		$btn.addClass(addClass);
//		$btn.tooltipster('content', title);
//	}
	
	function _changeLoginMenu($menu) {
		
		var sw = $menu.data('gubun');
		if(sw == 'IN') {
			gubun = 'OUT';
			$menu.find('img').prop('src', hotplace.getContextUrl() + 'resources/img/menu/menu_logout.png');
			$menu.find('p.over img').prop('src', hotplace.getContextUrl() + 'resources/img/menu/menu_logout_on.png');
		}
		else {
			gubun = 'IN';
			$menu.find('img').prop('src', hotplace.getContextUrl() + 'resources/img/menu/menu_login.png');
			$menu.find('p.over img').prop('src', hotplace.getContextUrl() + 'resources/img/menu/menu_login_on.png');
		}
		
		$menu.data('gubun', gubun);
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
					
					hotplace.minimaps.bindData(hotplace.maps.getMap(), 3);
				}
			},
			error: function(data, textStatus, jqXHR) {
				console.log(data)
			}
		});
	});
	
	function _joinInit() {
		$('#dvJoinService').show();
		$('#dvJoinForm').hide();
		$('#dvJoinCheck').hide();
		$('#dvJoinResult').hide();
	}
	//로그아웃 YES버튼
	$(document).on('click', _btnLogoutYes, function() {
		hotplace.dom.logout(function() {
			/*var $menuBtn = $('#' + hotplace.dom.getMenuBtn().USER_LOGIN);
			_changeLoginMenu($menuBtn);
			hotplace.dom.closeModal();*/
			window.location.reload();
		});
	});
	
	//로그아웃 NO 버튼
	$(document).on('click', _btnLogoutNo, function() {
		hotplace.dom.closeModal();
	});
	
	$(document).on('keydown', '#pw', function(e) {
		if (e.which == 13) {
			var txt = e.target.value;
			$(_btnId).trigger('click'); 
	    }
	});
	
	$(document).on('click', _btnJoinNext, function() {
		$('#dvJoinService').hide();
		$('#dvJoinForm').show();
	});
	
	$(document).on('click', _btnJoinPrev, function() {
		$('#dvJoinService').show();
		$('#dvJoinForm').hide();
	});
	
	//회원가입
	$(document).on('click', _btnjoinCheck, function() {
		$('#dvJoinForm').hide();
		$('#dvJoinCheck').show();
	});
	
	$(document).on('click', _btnJoinCheckCancel, function() {
		_joinInit();
	});
	
	$(document).on('click', _btnJoinCheckSubmit, function() {
		var param = {};
		
		param.id = $('#joinUserId').val();
		param.userName = $('#joinUserName').val();
		param.password = $('#joinPw').val();
		param.phone = $('#joinUserPhoneF').val() + '-' + $('#joinUserPhoneM').val() + '-' + $('#joinUserPhoneL').val();
		param.email = $('#joinUserEmailA').val() + '@' + $('#joinUserEmailV').val();
		
		hotplace.ajax({
			url: 'user/join',
			data: JSON.stringify(param),
			contentType: 'application/json; charset=UTF-8',
			success: function(data, textStatus, jqXHR) {
				if(data.success) {
					$('#pJoinResultMsg').text('회원가입이 완료되었습니다.');
					$('#dvJoinResultBtn').html('<button class="btn-success">로그인 화면으로</button>');
				}
				else {
					$('#pJoinResultMsg').text('오류가 발생했습니다.');
				}
				
				$('#dvJoinCheck').hide();
				$('#dvJoinResult').show();
			},
		})
	});
	
	$(document).on('click', '#dvJoinResultBtn button', function() {
		if($(this).hasClass('btn-success')) {
			$('#btnTabLogin').trigger('click');
			setTimeout(function() {
				_joinInit();
			}, 500);
		}
	});
	
}(
		hotplace.login = hotplace.login || {},
		jQuery
));