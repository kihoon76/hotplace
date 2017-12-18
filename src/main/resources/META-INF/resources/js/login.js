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
	
	var _doJoinIdDuplicate = false;
	
	login.init = function() {
		_validateJoin();
	}
	
	function _validateJoin() {
		$('#joinUserEmailV').on('change', function() {
			$('#fmJoin').bootstrapValidator('revalidateField', 'joinUserEmailA');
			var v = $(this).val();
			
			if(v) {
				
			}
		});
		
		$('#joinUserPhoneL').on('keyup', function() {
			$('#fmJoin').bootstrapValidator('revalidateField', 'joinUserPhoneM');
		});
		
		
		$('#fmJoin')
		/*.find('[name="joinUserPhoneF"]')	
		.selectpicker()
			.change(function(e) {
				$('#fmJoin').bootstrapValidator('revalidateField', 'joinUserPhoneF');
			})
			.end()*/
		.bootstrapValidator({
			submitButtons: 'button[type="submit"]',
			live: 'enabled',
			trigger: null,
			message: '유효하지 않은 값입니다.',
			excluded: ':disabled',
			/*feedbackIcons: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },*/
			fields: {
				joinUserId: {
					message: '유효하지 않은 아이디 값입니다.',
					validators: {
						notEmpty: {
							message: '아이디값을 입력하세요'
						},
						callback: {
							message:'아이디 중복체크를 하세요',
							callback: function(value, validator) {
								if(_doJoinIdDuplicate) return true;
								
								return false;
							}
						}
					}
				},
				joinPw: {
					validators: {
						notEmpty: {
							message: '비밀번호를 입력하세요'
						}
					}
				},
				joinPwConfirm: {
					validators: {
						notEmpty: {
							message: '비밀번호를 입력하세요'
						},
						identical: {
							field: 'joinPw',
							message: '비밀번호가 일치하지 않습니다.'
						}
					}
				},
				joinUserName: {
					validators: {
						notEmpty: {
							message: '이름을 입력하세요'
						}
					}
				},
				joinUserEmailA: {
					validators: {
						notEmpty: {
							message: 'email을 입력하세요'
						},
						regexp: {
	                        regexp: /[^@]*/g,
	                        message: '@문자는 입력하실 수 없습니다.'
	                    },
						callback: {
							message: 'email을 선택하세요',
							callback: function(value, validator) {
								if($('#joinUserEmailV').val()) return true;
								
								return false;
							}
						}
					}
				},
				joinUserPhoneM: {
					message: '숫자를 입력해 주세요',
					validators: {
						notEmpty: {
							message: '숫자를 입력해 주세요'
						},
						digits: {
							message: '숫자만 입력해 주세요'
						},
						stringLength: {
	                        min: 3,
	                        max: 4,
	                        message: '3~4자리 숫자를 입력하세요'
	                    },
						callback: {
							message: '4자리 숫자를 입력해 주세요',
							callback: function(value, validator) {
								var last = $.trim($('#joinUserPhoneL').val());
								var pattern = /[0-9]/g;
								
								if(last && pattern.test(last) && last.length == 4) return true;
								return false;
							}
						}
						
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
            // Prevent submit form
            e.preventDefault();
            $('#dvJoinForm').hide();
    		$('#dvJoinCheck').show();
        });
	}
	
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
	
	function _initJoin() {
		$('#dvJoinService').show();
		$('#dvJoinForm').hide();
		$('#dvJoinCheck').hide();
		$('#dvJoinResult').hide();
	}
	
	function _checkYaggwanAgree(fn) {
		var v = true;
		
		$('#dvLoginJoin .tos input[type=checkbox]').each(function() {
			if(!$(this).is(':checked')) {
				v = false;
				return false;
			}
		})
		.promise()
		.done(function() {
			if(fn) fn(v);
		});;
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
	
	
	
	$(document).on('click', '#btnJoinIdCheck', function() {
		hotplace.ajax({
			url: 'user/checkId?id=' + $('#joinUserId').val(),
			method: 'GET',
			loadEl: '#dvLoginJoin',
			success: function(data) {
				if(data.success) {
					if(data.errCode == '300') {
						alert('중복된 아이디입니다.');
					}
					else {
						_doJoinIdDuplicate = true;
						$('#fmJoin').bootstrapValidator('revalidateField', 'joinUserId');
					}
				}
				console.log(data);
			}
			
		});
	});
	
	$(document).on('click', _btnJoinNext, function() {
		_checkYaggwanAgree(function(v) {
			if(v) {
				$('#dvJoinService').hide();
				$('#dvJoinForm').show();
			}
		});
	});
	
	$(document).on('click', '#dvLoginJoin .tos', function(e) {
		if(e.target.nodeName == 'INPUT') {
			_checkYaggwanAgree(function(v) {
				if(v) {
					$(_btnJoinNext).prop('disabled', false);
					$(_btnJoinNext).removeClass('btn-next-dis');
					$(_btnJoinNext).addClass('btn-next');
				}
				else {
					$(_btnJoinNext).prop('disabled', true);
					$(_btnJoinNext).addClass('btn-next-dis');
					$(_btnJoinNext).removeClass('btn-next');
				}
			});
		}
	});
	
	
	
	$(document).on('click', _btnJoinPrev, function() {
		$('#dvJoinService').show();
		$('#dvJoinForm').hide();
	});
	
	//회원가입
	/*$(document).on('click', _btnjoinCheck, function() {
		alert('oo');
		$('#dvJoinForm').hide();
		$('#dvJoinCheck').show();
	});*/
	

	
	
	$(document).on('click', _btnJoinCheckCancel, function() {
		_initJoin();
	});
	
	login.test = function() {
		return
	}
	
	
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
					$('#fmJoin')[0].reset();
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
				_initJoin();
			}, 500);
		}
	});
	
}(
		hotplace.login = hotplace.login || {},
		jQuery
));