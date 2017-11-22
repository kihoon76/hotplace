/*
 * jsDoc 설치방법
 * npm install -g jsdoc
 * > jsdoc map-core.js -d c://out
 * http://usejsdoc.org/
 * */

/**
 * @namespace hotplace
 * */
(function(hotplace, $) {
	
	var _version = '1.0';
	var _ROOT_CONTEXT = $('body').data('url');
	
	$.browser = {}; 
	/*jQuery.browser() removed

	The jQuery.browser() method has been deprecated since jQuery 1.3 and is removed in 1.9.
	If needed, it is available as part of the jQuery Migrate plugin.
	We recommend using feature detection with a library such as Modernizr.
	*/
    $.browser.msie = false;
    $.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        $.browser.msie = true;
        $.browser.version = RegExp.$1;
    }      
    
    String.prototype.format = function() {
        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;  
    };
    
    String.prototype.money = function() {
    	 var s = this;
    	 s = s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    	 
    	 return s;
    }
    
    String.prototype.getDecimalCount = function() {
    	var s = this;
    	var idx = s.indexOf('.');
    	
    	if(idx == -1) return -1;
    	
    	return s.length - (idx + 1);
    }
    
    /**
	 * @memberof hotplace
     * @property {object} config
     * @property {number} config.salesViewLevel  	물건보기 레벨
     * @property {number} config.minZoomLevel    	지도 최소 줌레벨
     * @property {number} config.mapDefaultX     	지도 초기 경도
     * @property {number} config.mapDefaultY     	지도 초기 위도
     * @property {number} config.addrSearchPanLevel 주소검색 후 panto 이동시 레벨설정
     */
    hotplace.config = {
    	salesViewLevel: 8,
    	minZoomLevel: 3,
    	mapDefaultX: 127.9204629,
    	mapDefaultY: 36.0207091,
    	addrSearchPanLevel: 10,
    	yangdoseStepPercent: 5,
    	gyeongmaeDetailImgInterval: 2000,
    	markerGrpCount: 2
    }
    
    Handlebars.registerHelper('json', function(context) {
        return JSON.stringify(context);
    });
    
    /**
     * @private
     * @desc handlebars-helper-x
     *  <p>
     *		{{#xif " name == 'Sam' && age === '12' " }}
     * 		BOOM
     *		{{else}}
     * 		BAMM
     *		{{/xif}}
   	 *	</p>
     * {@link https://gist.github.com/akhoury/9118682 handlebars-helper-x}
     */
    Handlebars.registerHelper('x', function(expression, options) {
    	
    	var result;

    	// you can change the context, or merge it with options.data, options.hash
    	var context = this;

    	// yup, i use 'with' here to expose the context's properties as block variables
    	// you don't need to do {{x 'this.age + 2'}}
    	// but you can also do {{x 'age + 2'}}
    	// HOWEVER including an UNINITIALIZED var in a expression will return undefined as the result.
    	with(context) {
    		result = (function() {
    			try {
    				return eval(expression);
    			}
    			catch (e) {
    				console.warn('•Expression: {{x \'' + expression + '\'}}\n•JS-Error: ', e, '\n•Context: ', context);
    			}
    		})
    		.call(context); // to make eval's lexical this=context
    	}
    	return result;
    });
    

    Handlebars.registerHelper('xif', function (expression, options) {
    	return Handlebars.helpers['x'].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
    });

    
    /**
     * @desc 숫자 자리수 
     */
    Handlebars.registerHelper('currency', function(amount, options) {
    	if (typeof(amount) === 'string') { amount = options.contexts[0].get(amount); }

    	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    
    /**
     * @desc 숫자 연산 
     * {@link https://gist.github.com/FrankFang/6603970 math.js}
     */
    Handlebars.registerHelper('math', function(lvalue, operator, rvalue, options) {
        if (arguments.length < 4) {
            // Operator omitted, assuming "+"
            options = rvalue;
            rvalue = operator;
            operator = "+";
        }
            
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
            
        return {
            '+': lvalue + rvalue,
            '-': lvalue - rvalue,
            '*': lvalue * rvalue,
            '/': lvalue / rvalue,
            '%': lvalue % rvalue
        }[operator];
    });
    
    Handlebars.registerHelper('step', function(numValue, ratio) {
    	var s = numValue.toString();
    	var sLen = s.length; 
    	var s1 = '';
    	for(var i=0; i<sLen; i++) {
    		if(i == 0) {
    			s1 += '1';
    		}
    		else {
    			s1 += '0';
    		}
    	}
    	
    	var n = parseInt(s1);
    	return Math.round(n * (ratio * 0.01));
    });

    /**
     * @private
     * @function _s4
     * @desc create UUID 
     */
	function _s4() {
		return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	}
    
	/**
	 * @memberof hotplace
     * @function isSupport
     * @param {string} target 찾을요소
     * @param {string[]} array 배열
     * @returns {boolean}
     */
	hotplace.isSupport = function(target, array) {
		return $.inArray(target, array) > -1;
	}
	
	/**
	 * Callback for ajax beforeSend.
	 *
	 * @callback ajax_beforeSend
	 * @param {object} xhr - XMLHttpRequest.
	 */
	
	/**
	 * Callback for ajax success.
	 *
	 * @callback ajax_success
	 * @param {object} data - data
	 * @param {string} textStatus
	 * @param {object} jqXHR
	 */
	
	/**
	 * @memberof hotplace
     * @function ajax
     * @param {object} 	   		params 설정
     * @param {string} 	   		params.url - 전송URL (처음에 '/' 반드시 생략)
     * @param {boolean}    		params.async - 비동기 여부 (default 'true')
     * @param {boolean}    		params.activeMask - ajax 마스크 사용여부 (default 'true')
     * @param {boolean}    		params.isMaskTran - multi ajax 마스크 사용여부 (default 'false')      
     * @param {string}			params.loadEl - 마스크할 element selector( ex: #id )
     * @param {string}			params.loadMsg - 마스크시 메시지 (default '로딩중입니다')
     * @param {ajax_beforeSend} params.beforeSend - 전송전 실행할 함수
     * @param {string}	   		params.contentType - (default 'application/x-www-form-urlencoded; charset=UTF-8')
     * @param {string}	   		params.dataType - (default 'json')
     * @param {string}     		params.method - (default 'POST')
     * @param {string}	   		params.data 
     * @param {ajax_success}	params.success
     * @param {number}			params.timeout - timeout(millisecond) default 300000
     */
	hotplace.ajax = function(params) {
		var dom = hotplace.dom;
		
		$.ajax(_ROOT_CONTEXT + params.url, {
			async: (params.async == null)? true : params.async,
			beforeSend: function(xhr) {
				var activeMask = (params.activeMask == undefined) ? true : params.activeMask; //전체설정 이후 마스크 개별설정
				if(activeMask && !params.isMaskTran) dom.showMask(params.loadEl, params.loadMsg);
				
				if(params.beforeSend && typeof params.beforeSend === 'function') {
					params.beforeSend(xhr);
				} 
			},
			contentType: params.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
			dataType: params.dataType || 'json',
			method: params.method || 'POST',
			context: params.context || document.body,
			data: params.data,
			statusCode: {
				404: function() {
					console.log('Page not found');
				}  
			},
			success: function(data, textStatus, jqXHR) {
				if(!params.success || typeof params.success !== 'function') {
					throw new Error('success function not defined');
				}
				
				try {
					params.success(data, textStatus, jqXHR);
					
				} 
				finally {
					var activeMask = (params.activeMask == undefined) ? true : params.activeMask; 
					if(activeMask) {
						if(params.isMaskTran) {
							dom.hideMaskTransaction();
						}
						else {
							dom.hideMask();
						}
					} 
					
				}
			},
			error: function(jqXHR, textStatus, e) {
				if(!params.error || typeof params.error !== 'function') {
					//Default 동작
				}
				else {
					params.error(jqXHR, textStatus, e);
				}
				
				var activeMask = (params.activeMask == undefined) ? true : params.activeMask; 
				if(activeMask) {
					if(params.isMaskTran) {
						dom.hideMaskTransaction();
					}
					else {
						dom.hideMask();
					}
				} 
			},
			complete: function(jqXHR, textStatus) {
				if(params.complete) params.complete(jqXHR);
			},
			timeout: params.timeout || 300000
		});
	}
	
	/**
	 * @memberof hotplace
     * @function getPlainText
     * @param {string} 	   		url - 전송URL (처음에 '/' 반드시 생략)
     * @param {object} 	   		param - data
     * @param {ajax_success}    cbSucc	
     * @param {boolean}    		isActiveMask - ajax 마스크 사용여부 (default 'true')
     * @param {boolean}    		isMaskTran - multi ajax 마스크 사용여부 (default 'false')
     * @param {function}		completeFn - ajax 통신이 완전히 종료된 후 실행될 함수
     */
	hotplace.getPlainText = function(url, param, cbSucc, isActiveMask, isMaskTran, completeFn) {
			
		hotplace.ajax({
			url: url,
			method: 'GET',
			dataType: 'text',
			data: param || {},
			activeMask: (isActiveMask != undefined) ? isActiveMask : true,
			isMaskTran: isMaskTran,
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				
				if(!jo.success) {
					jqXHR.errCode = jo.errCode;
				}
				else {
					cbSucc(jo);
				}
				//console.log('data count : ' + jo.datas.length);
				
			},
			error:function() {
				
			},
			complete: function(jqXHR) {
				switch(jqXHR.errCode) {
				case '100' :
					hotplace.dom.showAuthMsg(completeFn);
					break;
				case '202' :
					hotplace.dom.showAuthMsg(function() {
						window.location.reload();
					},'중복 로그인');
					
					break;
				}
			}
		});
		
	}
	
	/**
	 * @memberof hotplace
     * @function getPlainTextFromJson 
     * @param {string} 	   		url - 전송URL (처음에 '/' 반드시 생략)
     * @param {object} 	   		param - data
     * @param {ajax_success}    cbSucc	
     * @param {boolean}    		isActiveMask - ajax 마스크 사용여부 (default 'true')
     * @param {string}    		loadEl - 마스크할 element selector( ex: #id )
     */
	hotplace.getPlainTextFromJson = function(url, param, cbSucc, isActiveMask, loadEl) {
	
		hotplace.ajax({
			url: url,
			method: 'POST',
			dataType: 'text',
			contentType: 'application/json; charset=UTF-8',
			data: param || {},
			loadEl: loadEl,
			activeMask: (isActiveMask != undefined) ? isActiveMask : true,
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				cbSucc(jo);
			},
			error:function() {
				
			}
		});
	}
	
	/**
     * @memberof hotplace
     * @function createUuid
     * @returns {string}
     */
	hotplace.createUuid = function() {
		 return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
	}
	
	/**
     * @memberof hotplace
     * @function getContextUrl
     * @returns {string}
     */
	hotplace.getContextUrl = function() {
		return _ROOT_CONTEXT;
	} 
}(
	window.hotplace = window.hotplace || {},
	jQuery	
));
