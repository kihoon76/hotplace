/**
 * @namespace hotplace.validation
 * */
(function(validation, $) {
	
	$(document).on('focus', '.readonly', function() {
		$(this).trigger('blur')
	});
	
	//숫자관련 제한 공통함수
	function _digitKeyLimit(selector, regEx, isComma, blurFn) {
		$(document).on('keyup', selector, function(e) {
			if (!(e.keyCode >=37 && e.keyCode<=40)) {
				$(this).val( $(this).val().replace(regEx, '') );
				
			}
			
			if(isComma) {
				var v = $(this).val();
				v = v.replace(/,/gm, '');
				$(this).val(v.money());
			}
		});
		
		//tab키 눌렀을 때 버그로 인해서 blur이후 다시 설정, max 점검
		$(document).on('blur', selector, function(e) {
			//max 점검
			var maxObj = $(this).data('max');
			var suffix = $(this).data('suffix');
			
			$(this).val($(this).val().replace(regEx,''));
			var v = $(this).val();
			v = v.replace(/,/gm, '');
			
			if(suffix != undefined) {
				v = v.replace(new RegExp(suffix, 'ig'), '');
			}
			
			var fIdx = v.indexOf('.');
			//소수점 있을 경우 
			if(fIdx > -1) {
				v = v.replace(/\./gm, '');
				v = v.slice(0, fIdx) + '.' + v.slice(fIdx);
				
				//입력을 5...이런식으로 했을경우
				if(v.length - 1 == v.lastIndexOf('.')) {
					v = v + '0';
				}
			}
			
			if(maxObj != undefined) {
				if(parseFloat(v) > parseFloat(maxObj)) {
					v = $(this).data('value');
				}
			}
			
			$(this).data('value', v);
			
			if(isComma) {
				v = v.toString().money(); 
			}
			
			$(this).val(v + (suffix || ''));
			if(blurFn) blurFn($(this));
			
			//spinner textbox일 경우
			var $next = $(this).next();
			var fnStr = $next.data('fn');
			if(fnStr != undefined) hotplace.calc.profit[fnStr]();
			
		});
	}
	
	/**
	 * @memberof hotplace.validation
	 * @function numberOnly
	 * @param {string} selector jquery selector
	 * @desc text 숫자만 입력되게 함
	 */
	validation.numberOnly = function(selector, blurFn) {
		_digitKeyLimit(selector, /[^0-9]/gi, true, blurFn);
	}
	
	/**
	 * @memberof hotplace.validation
	 * @function numberNdot
	 * @param {string} selector jquery selector
	 * @desc text 숫자와 . 입력되게 함
	 */
	validation.numberNdot = function(selector, blurFn) {
		_digitKeyLimit(selector, /[^0-9|\.]/gi, true, blurFn);
	}
}(
	hotplace.validation = hotplace.validation || {},
	jQuery
));