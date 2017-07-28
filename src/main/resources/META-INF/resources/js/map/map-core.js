(function(hotplace, $) {
	var _version = '1.0';
	var ROOT_CONTEXT = 'http://hotplace.ddns.net:8080/';
	
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
    
	hotplace.isSupport = function(target, array) {
		return $.inArray(target, array) > -1;
	}
	
	hotplace.ajax = function(params) {
		var dom = hotplace.dom;
		
		$.ajax(ROOT_CONTEXT + params.url, {
			async: (params.async == null)? true : params.async,
			beforeSend: function(xhr) {
				if(dom.isActiveMask()) dom.showMask();
				
				if(params.beforeSend && typeof params.beforeSend === 'function') {
					params.beforeSend();
				}
			},
			contentType: params.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
			dataType: params.dataType || 'json',
			method: params.method || 'POST',
			complete: function() {
				console.log("###### Ajax Completed ######");
				var hideMask = (params.hideMask == undefined) ? true : params.hideMask;
				
				if(dom.isActiveMask() && hideMask) dom.hideMask();
			},
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
				
				params.success(data, textStatus, jqXHR);
			},
			error: function(jqXHR, textStatus, e) {
				if(!params.error || typeof params.error !== 'function') {
					//Default 동작
				}
				else {
					params.error(jqXHR, textStatus, e);
				}
			},
			timeout: params.timeout || 30000
		});
	}
	
}(
	window.hotplace = window.hotplace || {},
	jQuery	
));

(function(maps, $) {
	var _venderStr = null;
	var _container = document.getElementById('map');
	var _venderMap = null;
	var _venderEvent = null;
	var _initCalled = false;
	
	var _events = ['zoom_changed', 'bounds_changed'];
	var _vender = ['naver', 'daum'];
	
	
	/*
	 * daum  zoom : [14 ~ 1]
	 * naver zoom : [1 ~ 14]
	 * */
	var convertEventObjToCustomObj = function(eventName, vender, obj) {
		var returnObj;
		switch(eventName) {
		case 'zoom_changed' :
			if(vender == 'daum') {
				returnObj = _venderMap.getLevel();
			}
			else if(vender == 'naver') {
				returnObj = obj;
			}
			break;
		}
		
		return returnObj;
	}
	
	
	maps.Map = null;
	maps.event = {
		addListener : function(eventName, callback) {
			
			if(!hotplace.isSupport(eventName, _events)) {
				throw new Error('[' + eventName + ' 는(은) 지원하지 않습니다](supported : zoom_changed, bounds_changed');
			}
			
			var _fnListener;
			
			switch(_venderStr) {
			case 'naver' : 
			case 'daum'  :
				_fnListener = _venderEvent.addListener;
				break;
			}
			
			_fnListener(_venderMap, eventName, function(e) {
				return function(obj) {
					var convertedObj = convertEventObjToCustomObj(e,_venderStr, obj)
					callback(_venderMap, [convertedObj]);
				}
				
			}(eventName));
			
		},
		/*custom event*/
		onMapInited : function(handler) {
			$(document).on('onMapInited', function(e, map) {
				handler(map);
			});
		}
	};
	

	maps.init = function(venderStr, mapOptions, listeners) {
		if(_initCalled) throw new Error('init 함수는 이미 호출 되었습니다');
		
		if(hotplace.isSupport(venderStr, _vender)) {
			_venderStr = venderStr;
			_initCalled = true;
			
			switch(venderStr) {
			case 'naver' :
				_venderEvent = naver.maps.Event;
				_venderMap = new naver.maps.Map(_container, {
				 	center: new naver.maps.LatLng(mapOptions.Y, mapOptions.X), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
			        zoom: mapOptions.level, //지도의 초기 줌 레벨
			        mapTypeControl: true,
			        mapTypeControlOptions: {
			        	style: naver.maps.MapTypeControlStyle.DROPDOWN
			        }
				});
				
				break;
			case 'daum' :
				_venderEvent = daum.maps.event;
				_venderMap = new daum.maps.Map(_container, {
					center: new daum.maps.LatLng(mapOptions.Y, mapOptions.X),
					level: mapOptions.level
				});
				
				break;
			}
			
			
			if(listeners) {
				for(var eventName in listeners) {
					maps.event.addListener(eventName, listeners[eventName]);
				}
			}
			
			maps.Map = _venderMap;
			
			$(document).trigger('onMapInited', [_venderMap]);
		}
		else {
			throw new Error('[' + venderStr + '는(은) 지원하지 않습니다](supported : naver, daum');
		}
	}
}(
	hotplace.maps = hotplace.maps || {},
	jQuery	
));

(function(dom, $) {
	
	var _loadEl;
	var _loadTxt = 'Please wait...';
	var _loadEffects = {
		bounce: 'bounce',
		rotateplane: 'rotateplane',
		stretch: 'stretch',
		orbit: 'orbit',
		roundBounce: 'roundBounce',
		win8: 'win8',
		win8_linear: 'win8_linear',
		ios: 'ios',
		facebook: 'facebook',
		rotation: 'rotation',
		timer: 'timer',
		pulse: 'pulse',
		progressBar: 'progressBar',
		bouncePulse: 'bouncePulse'
	};
	
	var _loadmask = false;
	
	/*
	 * //https://github.com/vadimsva/waitMe/blob/gh-pages/index.html
	 * */
	function _runWaitMe(num, effect){
		
		var fontSize = '';
		var maxSize = '';
		var loadTxt = '';
		var textPos = '';
		
		switch (num) {
			case 1:
			maxSize = '';
			textPos = 'vertical';
			fontSize = '25px';
			break;
			case 2:
			loadTxt = '';
			maxSize = 30;
			textPos = 'vertical';
			break;
			case 3:
			maxSize = 30;
			textPos = 'horizontal';
			fontSize = '18px';
			break;
		}
		
		_loadEl.waitMe({
			effect: effect,
			text: loadTxt,
			bg: 'rgba(255,255,255,0.4)',
			color: '#000',
			maxSize: maxSize,
			source: 'img.svg',
			textPos: textPos,
			fontSize: fontSize,
			onClose: function() {}
		});
	}
	
	dom.isActiveMask = function() {
		return loadmask;
	};
	
	dom.enableLoadMask = function(cfg) {
		_loadmask = true;
		_loadEl = cfg.el || $('body');
		_loadTxt = cfg.msg || _loadTxt; 
	};
	
	dom.showMask = function() {
		if(_loadmask) {
			_runWaitMe(1, _loadEffects.timer);
		}
	};
	
	dom.hideMask = function() {
		if(_loadmask) {
			_loadEl.waitMe('hide');
		}
	},
	
	dom.closeModal = function(selector) {
		
	}
}(
	hotplace.dom = hotplace.dom || {},
	jQuery
));

