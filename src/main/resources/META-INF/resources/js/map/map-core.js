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
    	gyeongmaeDetailImgInterval: 2000
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
     */
	hotplace.getPlainText = function(url, param, cbSucc, isActiveMask, isMaskTran) {
			
		hotplace.ajax({
			url: url,
			method: 'GET',
			dataType: 'text',
			data: param || {},
			activeMask: (isActiveMask != undefined) ? isActiveMask : true,
			isMaskTran: isMaskTran,
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				//console.log('data count : ' + jo.datas.length);
				cbSucc(jo);
			},
			error:function() {
				
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

/**
 * @namespace hotplace.maps
 */
(function(maps, $) {
	/**
	 * @private 
	 * @desc 맵 제공업체 naver, daum
	 */
	var _venderStr = '';
	
	/**
	 * @private 
	 * @desc 맵 element
	 */
	var _container = document.getElementById('map');
	
	var _vender = null;
	var _venderMap = null;
	var _venderEvent = null;
	
	/** 
	 * @private
	 * @desc hotplace.naps.init 함수가 호출되었는지 여부
	 */
	var _initCalled = false;
	
	/**
	 * @private 
	 * @desc 지원하는 hotplace map 이벤트 목록
	 */
	var _events = ['zoom_changed', 'bounds_changed', 'dragend', 'zoom_start', 'click', 'tilesloaded', 'idle'];
	
	/**
	 * @private
	 * @desc 지원하는 벤더목록
	 */
	var _venders = ['naver', 'daum'];
	
	/** 
	 * @private 
	 * @desc 화면에 보이는 bounds
	 * @type {object}
	 * @property {number} swx - 극서
	 * @property {number} nex - 극동
	 * @property {number} swy - 극남
	 * @property {number} ney - 극북
	 */
	var _currentBounds = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 }; 
	
	/** 
	 * @private 
	 * @desc 실제로 cell을 그릴 bounds
	 * @type {object}
	 * @property {number} swx - 극서
	 * @property {number} nex - 극동
	 * @property {number} swy - 극남
	 * @property {number} ney - 극북
	 */
	var _marginBounds  = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 };  
	
	/** 
	 * @private 
	 * @desc 서버로부터 받을 좌표계 bounds
	 * @type {object} 
	 * @property {number} swx - 극서
	 * @property {number} nex - 극동
	 * @property {number} swy - 극남
	 * @property {number} ney - 극북
	 */
	var _locationBounds = {'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0};	  
	
	var _cellTypes = {DEFAULT:'HP', GONGSI:'GONGSI'};
	
	/** 
	 * @private 
	 * @desc 표시하고자 하는 layer 0:inactive, 1:on -1:off (XOR관계임) 
	 * @type {object} 
	 * @property {string} DEFAULT - HP지수
	 * @property {string} GONGSI  - 공시지가
	 */
	var _cellLayerOnOff = {DEFAULT:0, GONGSI:1};
	
	/** 
	 * @private 
	 * @desc 표시하고자 하는 마커그룹 0:off, 1:on  
	 * @type {object} 
	 * @property {string} GYEONGMAE - 경매
	 * @property {string} GONGMAE - 공매
	 */
	var _markerGroupOnOff = {GYEONGMAE:0, GONGMAE:0};
	
	/**
	 * @memerof hotplace.maps
	 * @function getActiveMarkers
	 * @returns {Array} 활성화된 marker types
	 * @desc 활성화된 marker type
	 */
	maps.getActiveMarkers = function() {
		var types = [];
		for(var t in _markerGroupOnOff) {
			if(_markerGroupOnOff[t] == 1) {
				types.push(t);
			}
		}
		
		return types;
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function isActiveMarker
	 * @param {hotplace.maps.MarkerTypes} markerType 
	 * @returns {boolean} 
	 * @desc 마커타입 활성화 여부
	 */
	maps.isActiveMarker = function(markerType) {
		if(_markerGroupOnOff[markerType] == undefined) throw new Error('[ ' + markerType + ' ]는 지원되지 않는 마커타입입니다');
		return _markerGroupOnOff[markerType] == 1 ? true : false;
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function getActiveMarkers
	 * @param {object} markerState 
	 * @param {number} markerState.GYEONGMAE
	 * @param {number} markerState.GONGMAE
	 * @desc markertype 활성화 설정
	 */
	maps.setMarkers = function(markerState) {
		for(var t in markerState) {
			if(_markerGroupOnOff[t] == undefined) throw new Error('마커타입 [' + t + ']가 존재하지 않습니다');
			
			_markerGroupOnOff[t] = markerState[t];
			
		}
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function changeCell
	 * @params {hotplace.maps.CellTypes} cellType - 변경하려는 cell type
	 * @todo celltype을 변경 가능할때 구현
	 * @ignore
	 */
	maps.changeCell = function(cellType) {
		var currCellType = _getActiveCellType();
		
		//cell이 꺼져 있을경우
		if(currCellType == null) {
			
		}
		
		for(var t in _cellTypes) {
			//if(_cellLayerOnOff[t])
		}
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function cellToggle
	 * @desc cell toggle
	 */
	maps.cellToggle = function() {
		
		hotplace.dom.addBodyAllMask();
		
		//masking 동작을 위해 delay를 준다.
		setTimeout(function() {
			if(_isOffCell(true)) {
				//on 한다.
				_restoreAllCells();
				maps.showCellLayer();
				hotplace.dom.enableYearRangeDiv(true);
			}
			else {
				//off 한다.
				_removeAllCells();
				hotplace.dom.enableYearRangeDiv(false);
				hotplace.database.initLevel(_getCurrentLevel(), _getActiveCellType());
			}
			
			hotplace.dom.removeBodyAllMask();
		}, 100);
		
	}
	
	/** 
	 * @private 
	 * @desc 현재 활성화 된 cell layer를 반환
	 * @function _getActiveCellType 
	 * @returns {hotplace.maps.CellTypes} 
	 */
	var _getActiveCellType = function() {
		
		for(var t in _cellTypes) {
			if(_cellLayerOnOff[t] == 1 || _cellLayerOnOff[t] == -1/*toggle*/) {
				return _cellTypes[t];
			}
		}
	}
	
	var _isOffCell = function(isWrite) {
		for(var t in _cellLayerOnOff) {
			if(_cellLayerOnOff[t] == 1) {
				if(isWrite) _cellLayerOnOff[t] = -1;
				return false;
			}
			else if(_cellLayerOnOff[t] == -1) {
				if(isWrite) _cellLayerOnOff[t] = 1;
				return true;
			}
		}
	}
	
	
	/** 
	 * @memberof hotplace.maps  
	 * @desc 현재 cell layer가 off 되어있는지 검사
	 * @function isOffCell 
	 * @param {boolean} isWrite - 현재 toggle상태를 바꿀지 여부
	 * @returns {boolean} 
	 */
	maps.isOffCell = _isOffCell;
	
	/** 
	 * @private 
	 * @desc 지도위에 그려진 (visible && invisible)cell들의 배열
	 * @type {Array} 
	 */
	var _cells = [];
	
	/** 
	 * @private 
	 * @desc weight값 제한으로 화면에서 보이는 좌표이지만 그리지않은 cell들
	 * @ignore
	 * @type {Array} 
	 */
	var _notDrawedCells = [];    
	
	
	var _markerTypes = {
		RADIUS_SEARCH: 'RADIUS_SEARCH',
		GYEONGMAE: 'GYEONGMAE', 
		GONGMAE: 'GONGMAE'
	};
	
	/** 
	 * @memberof hotplace.maps
	 * @desc 지도위에 그려진 마커그룹 타입
	 * @typedef {object} hotplace.maps.MarkerTypes 
	 * @property {string} RADIUS_SEARCH - 반경검색 후 지도상에 보이는 마커(1개)
	 * @property {string} GYEONGMAE - 경매물건 마커들
	 */
	maps.MarkerTypes = _markerTypes;
	
	/** 
	 * @memberof hotplace.maps
	 * @desc cell(heatmap)이 표현할수 있는 타입종류 
	 * @typedef {object} hotplace.maps.CellTypes
	 * @property {string} GONGSI - 공시지가
	 * @property {string} DEFAULT - 기본값 (HP지수)
	 */
	maps.CellTypes = _cellTypes;
	
	/** 
	 * @private 
	 * @desc 지도위에 그려진 마커그룹
	 * @type  {object} 
	 * @param {object} RADIUS_SEARCH 반경검색 마커그룹
	 * @param {Array}  RADIUS_SEARCH.m 반경검색 marker
	 * @param {Array}  RADIUS_SEARCH.c 반경검색 circle
	 * @param {object} GYEONGMAE 경매
	 * @param {Array}  GYEONGMAE.m 경매물건 마커들
	 */
	var _markers = {
		RADIUS_SEARCH : { m: [], c: [], url: '' },
		GYEONGMAE : { m: [], url: 'gyeongmaemarker', icon:'blink.gif' },
		GONGMAE : { m: [], url: 'gongmaemarker', icon: 'gongmae.png' }
	};
	
	/** 
	 * @private 
	 * @desc 마커그룹의 마커 위에 보여질 infoWindow 팝업
	 * @type  {object} 
	 * @param {Array}  RADIUS_SEARCH 반경검색 마커윈도우
	 * @param {Array}  GYEONGMAE 경매마커 윈도우
	 * @param {Array}  GONGMAE 공매마커 윈도우
	 */
	var _infoWindowsForMarker = {
		RADIUS_SEARCH : [],
		GYEONGMAE : [],
		GONGMAE : []
	};
	
	
	/** 
	 * @private 
	 * @function _setCurrentBounds 
	 * @desc 현재 보이는 영역의 bounds와 margin 영역의 bounds를 설정한다. 
	 *       zoom_changed, dragend, maps.init 함수호출시 호출됨.
	 *       _convertEventObjToCustomObj 함수참조.
	 */
	function _setCurrentBounds() {
		var bnds = null;
		
		switch(_venderStr) {
		case 'daum' :
			bnds = _venderMap.getBounds();
			_currentBounds = {
				swx : bnds.ba,
				swy : bnds.ha,
				nex : bnds.fa,
				ney : bnds.ga
			};
			break;
		case 'naver' :
			bnds = _venderMap.getBounds();
			_currentBounds = {
				swx : bnds._sw.x,
				swy : bnds._sw.y,
				nex : bnds._ne.x,
				ney : bnds._ne.y
			};
			break;
		}
		
		var r = [60,60,60,20,20,20,20,20,20,20,20,20];
		
		var marginXRate =  parseFloat((_currentBounds.nex - _currentBounds.swx)/r[_getCurrentLevel()-3]);
		var marginYRate =  parseFloat((_currentBounds.ney - _currentBounds.swy)/r[_getCurrentLevel()-3]);
		
		_marginBounds.swx = _currentBounds.swx - marginXRate;
		_marginBounds.swy = _currentBounds.swy - marginYRate;
		_marginBounds.nex = _currentBounds.nex + marginXRate;
		_marginBounds.ney = _currentBounds.ney + marginYRate;
	}
	
	/** 
	 * @private 
	 * @function _setLocationBounds 
	 * @desc 레벨별로  서버에 쿼리할 bound를 설정한다
	 */
	function _setLocationBounds() {
		
		var r = [0.5,0.5,2,4,4,4,4,4,4,4,4,4];
		
		var locationXRate =  parseFloat((_marginBounds.nex - _marginBounds.swx)/r[_getCurrentLevel()-3] /*6*/);
		var locationYRate =  parseFloat((_marginBounds.ney - _marginBounds.swy)/r[_getCurrentLevel()-3]);
		
		_locationBounds.swx = _marginBounds.swx - locationXRate;
		_locationBounds.swy = _marginBounds.swy - locationYRate;
		_locationBounds.nex = _marginBounds.nex + locationXRate;
		_locationBounds.ney = _marginBounds.ney + locationYRate;
	}
	
	function _getCurrentLevel() {
		var _currentLevel = -1;
		
		switch(_venderStr) {
		case 'daum' :
			_currentLevel = _venderMap.getLevel();
			break;
		case 'naver' :
			_currentLevel = _venderMap.getZoom();
			break;
		}
		
		return _currentLevel;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getCurrentLevel 
	 * @desc 현재 보이는 지도의 줌레벨.
	 *  	 daum  zoom : [14 ~ 1]
	 * 		 naver zoom : [1 ~ 14]
	 * @return {number}
	 */
	maps.getCurrentLevel = _getCurrentLevel;
	
	/** 
	 * @private 
	 * @function _getColorByGongsiWeight 
	 * @param {object} weight
	 * @param {number} weight.colorV 스펙트럼으로 표시할 보정값
	 * @param {number} weight.minV   쿼리요청한 boundary 안에서 공시지가 최소값
	 * @param {number} weight.maxV   쿼리요청한 boundary 안에서 공시지가 최대값
	 * @param {number} weight.value  공시지가
	 * @param {number} weight.type	 공시지가 (0)
	 * @desc  공시지가 스펙트럼 값
	 * 		  RGB               |     colorV
	 * 		  R 255 G   0 B   0 |       1020
	 * 		  R 255 G 255 B   0 |        765
	 * 		  R   0 G 255 B   0	|		 510
	 *  	  R   0 G 255 B 255 |		 255
	 *  	  R   0 G   0 B 255 |  		   0
	 * @return {number}
	 */
	function _getColorByGongsiWeight(weight) {
		var color = '';
		var v = weight.colorV;
		if(v >= 1020) {
			color = 'rgb(255,0,0)';
		}
		else {
			if(v >= 765 && v < 1020) {
				color = 'rgb(255,' + (1020-v) + ',0)';
			}
			else if(v >= 510 && v < 765) {
				color = 'rgb(' + (v-510) + ',255,0)';
			}
			else if(v >= 255 && v < 510) {
				color = 'rgb(0,255,' + (510-v) + ')';
			}
			else {
				color = 'rgb(0,' + v + ',255)';
			}
		}
		
		return color;
	}
	
	/** 
	 * @private 
	 * @function _drawRectangle 
	 * @param {number} swy 극남
	 * @param {number} swx 극서
	 * @param {number} ney 극북
	 * @param {number} nex 극동
	 * @param {object} css cell style
	 * @param {number} css.strokeWeight
	 * @param {number} css.strokeColor
	 * @param {number} css.strokeOpacity
	 * @param {number} css.fillColor
	 * @param {number} css.fillOpacity
	 * @param {object} cellData cell click시 보여줄 데이터
	 * @param {boolean} triggerable cell을 만들고나서 바로 info창이 열리게 할지 여부
	 * @desc  공시지가 스펙트럼 값
	 */
	function _drawRectangle(swy, swx, ney, nex, css, cellData, triggerable) {
		var rec = null;
		
		switch(_venderStr) {
		case 'daum'  :
			break;
		case 'naver' :
			rec = new _vender.Rectangle({
			    map: (_isOffCell()) ? null : _venderMap,
			    bounds: new _vender.LatLngBounds(
		    		new _vender.LatLng(swy, swx),
		    		new _vender.LatLng(ney, nex) 
			    ),
			    strokeWeight: (css && css.strokeWeight != undefined) ? css.strokeWeight : 0, 
			    strokeColor:  (css && css.strokeColor != undefined) ? css.strokeColor : '#5347AA',
			    strokeOpacity: (css && css.strokeOpacity != undefined) ? css.strokeOpacity : 0.5,
			    fillColor: (css && css.fillColor != undefined) ? css.fillColor : 'rgb(255,051,000)',
			    fillOpacity: (css && css.fillOpacity != undefined) ? css.fillOpacity : 0.1,
			    clickable: true
			});
			
			rec.data = cellData;
			
			_venderEvent.addListener(rec, 'click', function(e) {
				var r = e.overlay;
				
				/** cell center 구하기 */
				var xcDiff = parseFloat((r.data.location[2] - r.data.location[0])/2).toFixed(11);
				var ycDiff = parseFloat((r.data.location[3] - r.data.location[1])/2).toFixed(11);
				var xc = r.data.location[0] + parseFloat(xcDiff);
				var yc = r.data.location[1] + parseFloat(ycDiff);
				var location = new _vender.LatLng(yc, xc);
				/** */
				
				hotplace.dom.openInfoWindowForCell(_venderMap, location, _vender, _venderEvent, {'weight' : r.data.weight[0]},{
					'open' : function(win, obj) {
						console.log(obj);
					},
				});
				         
				hotplace.ajax({
					url: 'sample/celldetail',
					method: 'GET',
					//async: false,
					dataType: 'json',
					data: {},
					loadEl: '#dvCellDetail',
					success: function(data, textStatus, jqXHR) {
						//hotplace.dom.createChart('canvas');
					},
					error:function() {
						
					}
				});
			});
			
			if(triggerable)	_venderEvent.trigger(rec, 'click');
			
			break;
		}
		
		return rec;
	}
	
	/** 
	 * @private
	 * @function _commXY 
	 * @param {object} data	 지도에 보여줄 좌표정보
	 * @param {number} startIdx marginbound의 극서에 가장 가까운 좌표의 index의 값
	 * @param {function} callback
	 * @desc  margin bound 범위내에 있는 좌표 찾은후 넘겨받은 callback에 파라미터로 넘겨줌
	 */
	function _commXY(data, startIdx, callback) {
		var len = data.length;
		
		var boundMX = _marginBounds.nex;
		var boundmY = _marginBounds.swy;
		var boundMY = _marginBounds.ney;
		var drawedCnt = 0;
		
		var id = '';
		
		for(var i = startIdx; i < len; i++) {
			
			if(data[i].location[0] > boundMX) break;
			var y = data[i].location[1];

			if(y >= boundmY && y <= boundMY) {
				
				id = data[i]['id'];
				
				if(!id /*|| !logMap[id]*/ ){
					data[i]['id'] = hotplace.createUuid();
					//logMap[data[i]['id']] = true;
					drawedCnt++;
					
					callback(data[i]);
					
				}
			}
		}
		
		console.log("drawedCnt ==> " + drawedCnt);
	}
	
	/** 
	 * @private
	 * @function _createMarkers 
	 * @param {number} level  현재 줌레벨
	 * @param {number} startIdx marginbound의 극서에 가장 가까운 좌표의 index의 값
	 * @param {hotplace.maps.MarkerTypes} markerType
	 * @desc  margin bound 범위내에 있는 좌표 찾은후 넘겨받은 callback에 파라미터로 넘겨줌
	 */
	function _createMarkers(level, startIdx, markerType, listeners, options) {
		var markerData;
		
		switch(markerType) {
		case _markerTypes.GYEONGMAE :
			markerData = hotplace.database.getLevelData(level, _markerTypes.GYEONGMAE);
			break;
		case _markerTypes.GONGMAE :
			markerData = hotplace.database.getLevelData(level, _markerTypes.GONGMAE);
			break;
		}
		
		_commXY(markerData,
				startIdx,
				function(data) {
					maps.getMarker(markerType, data, listeners, options);
				}
		);
	}
	
	
	/** 
	 * @private 
	 * @function _createCells 
	 * @param {number} level  현재 줌레벨
	 * @param {number} startIdx marginbound의 극서에 가장 가까운 좌표의 index의 값
	 * @desc  margin bound 범위내에 있는 좌표의 cell을 그린다.
	 */
	function _createCells(level, startIdx) {
		var colorFn;
		var currCellType = _getActiveCellType();
		
	    switch(currCellType) {
		case _cellTypes.GONGSI :
			colorFn = _getColorByGongsiWeight;
			break;
		default :
			colorFn = _getColorByHpWeight;
			break;
		}
		  
		_commXY(hotplace.database.getLevelData(level, currCellType),
				/*hotplace.database.getLevelLogMap(level),*/
				startIdx,
				function(data) {
					//weight 50점 밑으로는 만들지 않는다
					/*if(Math.ceil(data.weight[0].colorV) <= 50) {
						_notDrawedCells.push(data);
						return;
					}*/
					
					_cells.push(
						_drawRectangle(
							  data.location[1],
							  data.location[0],
							  data.location[3],
							  data.location[2], 
							  {
								  fillColor: colorFn(data.weight[0]),
								  fillOpacity : 0.5
							  },
							  data
						)
					);
				}
		);
	}
	
	/** 
	 * @private 
	 * @function _removeAllCells
	 * @param {boolean} isDetach - detach 여부 
	 * @desc  cell전부를 지도에서 제거한다.
	 */
	function _removeAllCells(isDetach) {
		for(var i=_cells.length-1; i>=0; i--) {
			_cells[i].setMap(null);
		}
		
		//단순히 맵에서만 제거할 것이 아니면
		if(!isDetach) _cells = [];
		
	}
	
	/** 
	 * @private 
	 * @function _restoreAllCells 
	 * @desc  detach한 cell을 다시 지도에 붙인다.
	 */
	function _restoreAllCells() {
		for(var i=_cells.length-1; i>=0; i--) {
			_cells[i].setMap(_venderMap);
		}
	}
	
	function _destroyMarkers(isRadiusExcept) {
		for(var type in _markers) {
			if(type == 'RADIUS_SEARCH' && isRadiusExcept) continue;
			_destroyMarkerType(type);
		}
	}
	
	function _destroyMarkerType(type) {
		var marker = _markers[type];
		if(marker) {
			var arr = marker.m;
			var arrCircle = marker.c; 
			var len = arr.length;
			var lenCircle = (arrCircle) ? arrCircle.length : 0;
			
			for(var m=0; m<len; m++) {
				arr[m].setMap(null);
			}
			
			for(var c=0; c<lenCircle; c++) {
				arrCircle[c].setMap(null);
			}
			
			arr = [];
			if(arrCircle) arrCircle = [];  
		}
		else {
			throw new Error(type + 'is not exist');
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyMarkers 
	 * @desc  마커를 전부 삭제함
	 */
	maps.destroyMarkers = _destroyMarkers;
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyMarkerType 
	 * @param {hotplace.maps.MarkerTypes} type
	 * @desc  해당 타입의 마커를 삭제함
	 */
	maps.destroyMarkerType = _destroyMarkerType;
	
	
	/** 
	 * @private 
	 * @function _convertEventObjToCustomObj 
	 * @param {string} eventName 벤더별 벤더이벤트 전부
	 * @param {object} obj 벤더 리스너 param 
	 * @desc  벤더별 이벤트 리스너 파라미터를 공통화 함
	 */
	function _convertEventObjToCustomObj(eventName, obj) {
		var returnObj;
		var latlng;
		
		switch(eventName) {
		case 'zoom_changed' :
			_setCurrentBounds();
			returnObj = _getCurrentLevel();
			break;
		case 'zoom_start': //daum
			returnObj = _venderMap.getLevel();
			break;
		case 'zooming' :   //naver
			returnObj = _venderMap.getZoom();
			break;
		case 'dragend' : 
			_setCurrentBounds();
			returnObj = _currentBounds;
			break;
		case 'click' : 
			returnObj = (_venderStr == 'naver') ? {x:obj.latlng.x, y:obj.latlng.y} : {x:obj.latLng.gb, y:obj.latLng.hb};
			break;
		case 'tilesloaded' :
			returnObj = {};
			break;
		case 'idle' :
			returnObj = {};
			break;
		}
		
		return returnObj;
	}
	
	/** 
	 * @private 
	 * @function _initJiJeokDoLayer 
	 * @desc  벤더별 지적도 초기화 함
	 */
	function _initJiJeokDoLayer() {
		
		//지적편집도
		if(_venderStr == 'naver') {
			_vender._cadastralLayer = new _vender.CadastralLayer();
		}
	}
	
	/** 
	 * @private 
	 * @function _showCellLayer 
	 * @desc  cellType에 해당하는 cell layer를 보여줌
	 */
	function _showCellLayer() {
		var db = hotplace.database;
		var currentLevel = _getCurrentLevel();
		
		if(!db.hasData(currentLevel, _getActiveCellType())) return;
		var startIdx = db.getStartXIdx(_getActiveCellType(), _marginBounds.swx, currentLevel);
		
		_createCells(currentLevel, startIdx);
	}
	
	function _createMarkerClick(map, marker, win) {
		hotplace.gyeongmae.markerClick(map, marker, win);
	}
	
	/** 
	 * @private 
	 * @function _showMarkers 
	 * @desc  활성화시킨 marker group 보여주기 
	 */
	function _showMarkers(markerType) {
		var db = hotplace.database;
		var currentLevel = _getCurrentLevel();
		
		if(!db.hasData(currentLevel, markerType/*_markerTypes.GYEONGMAE*/)) return;
		var startIdx = db.getStartXIdx(markerType/*_markerTypes.GYEONGMAE*/, _marginBounds.swx, currentLevel);
		
		_createMarkers(currentLevel, startIdx, markerType/*_markerTypes.GYEONGMAE*/, {
			click : function(map, marker, win) {
				_createMarkerClick(map, marker, win);
			}
		}, {
			hasInfoWindow: true,
			isAjaxContent: true,
			radius:0,
			icon: _markers[markerType].icon/*'blink.gif'*/,
		});
	}
	
	/** 
	 * @private 
	 * @function _initLayers 
	 * @param {number} level 줌레벨
	 * @desc  hotplace.maps.showCellLayer가 호출될 때 동작함
	 */
	function _initLayers(level) {
		_removeAllCells();
		_setLocationBounds();
		_notDrawedCells = [];
		hotplace.dom.closeInfoWindowForCell();
		hotplace.database.initLevel(level);
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function isActiveSalesView 
	 * @returns {boolean}
	 * @desc  현재 레벨이 물건보기 활성화 레벨인지 여부
	 */
	maps.isActiveSalesView = function() {
		return _getCurrentLevel() >= hotplace.config.salesViewLevel;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyMarkerWindow 
	 * @param {hotplace.maps.MarkerTypes} markerType 마커타입
	 * @desc  해당 마커타입의 infoWindow 삭제
	 */
	maps.destroyMarkerWindow = function(markerType) {
		if(markerType) {
			var len = _infoWindowsForMarker[markerType].length;
			if(len > 0) {
				for(var i=0; i<len; i++) {
					_infoWindowsForMarker[markerType][i].close();
				}
				
				_infoWindowsForMarker[markerType] = [];
			}
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function setLevel 
	 * @param {number} level 줌레벨
	 * @desc  줌레벨 설정
	 */
	maps.setLevel = function(level) {
		switch(_venderStr) {
		case 'naver' :
			_venderMap.setZoom(level);
			break;
		case 'daum' :
			_venderMap.setLevel(level);
			break;
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getClickedCell 
	 * @param {object} latlng
	 * @param {number} latlmg.x 경도
	 * @param {number} latlmg.y 위도
	 * @desc  맵 클릭시 클릭지점의 cell이 생성이 안되었을때 동적으로 생성함
	 * @deprecated
	 */
	maps.getClickedCell = function(latlng) {
		
		var len = _notDrawedCells.length;
		var swx = 0, swy = 0, nex = 0, ney = 0;
		
		for(var x=0; x<len; x++) {
			swx = _notDrawedCells[x].location[0];
			nex = _notDrawedCells[x].location[2];
			swy = _notDrawedCells[x].location[1];
			ney = _notDrawedCells[x].location[3];
			
			if(latlng.x >= swx && latlng.x <= nex) {
				if(latlng.y >= swy && latlng.y <= ney) {
					_cells.push(_drawRectangle(
							swy, swx, ney, nex, 
						  {
							  fillColor: 'rgba(255,255,255,0.0)',
							  fillOpacity : 0.1
						  },
						  _notDrawedCells[x],
						  true
					));
					
					_notDrawedCells.slice(x,1);
					break;
				}
			}
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getVender 
	 * @returns {object} - (ex. naver.maps, daum.maps)
	 * @desc  맵 벤더객체를 가져옴  
	 */
	maps.getVender = function() {
		return _vender;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getVenderMap 
	 * @returns {object} - (ex. naver.maps.Map, daum.maps.Map)
	 * @desc  벤더의 맵 객체를 가져옴 
	 */
	maps.getVenderMap = function() {
		return _venderMap;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getCurrentLevel 
	 * @returns {number} - from 3 to 13
	 * @desc  맵의 현재 줌레벨을 가져옴 
	 */
	maps.getCurrentLevel = function() {
		return _getCurrentLevel();
	}
	
	/** 
	 * @memberof hotplace.maps
	 * @name event 
	 * @type {object}
	 * @property {listener} addListener 
	 * @desc  event listener 
	 */
	maps.event = {
		/** 
		 * @typedef {function} listener
		 * @param {string} eventName - 이벤트 명
		 * @param {function} callback
		 */
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
			
			if(eventName == 'zoom_start') {
				eventName = (_venderStr == 'naver') ? 'zooming' : 'zoom_start';
			}
			
			_fnListener(_venderMap, eventName, function(e) {
				return function(obj) {
					var convertedObj = _convertEventObjToCustomObj(e, obj);
					callback(_venderMap, convertedObj);
				}
				
			}(eventName));
			
		},
	};
	
	/** 
	 * @memberof hotplace.maps 
	 * @function init 
	 * @param {string} venderStr - (naver|daum)
	 * @param {object} mapOptions
	 * @param {number} mapOptions.X 경도
	 * @param {number} mapOptions.Y 위도
	 * @param {object} listeners 이벤트 리스너 객체
	 * @param {function} listeners.eventName 이벤트 리스너
	 * @param {function} afterInit init완료후 실행할 함수
	 */
	maps.init = function(venderStr, mapOptions, listeners, afterInit) {
		if(_initCalled) throw new Error('init 함수는 이미 호출 되었습니다');
		
		if(hotplace.isSupport(venderStr, _venders)) {
			_venderStr = venderStr;
			_initCalled = true;
			
			switch(venderStr) {
			case 'naver' :
				_vender = naver.maps;
				_venderEvent = _vender.Event;
				
				var registry = new naver.maps.MapTypeRegistry();
				
				_venderMap = new _vender.Map(_container, {
				 	center: new _vender.LatLng(mapOptions.Y, mapOptions.X), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
			        zoom: mapOptions.level, //지도의 초기 줌 레벨
			        mapTypes: registry,
			        mapTypeControl: true,
			        mapTypeControlOptions: {
			        	style: _vender.MapTypeControlStyle.DROPDOWN
			        },
			        minZoom: mapOptions.minZoom || 3,
			        //maxZoom: mapOptions.maxZoom || 13
				});
				
				_venderMap.mapTypes.set(naver.maps.MapTypeId.NORMAL, naver.maps.NaverMapTypeOption.getNormalMap());
				_venderMap.mapTypes.set(naver.maps.MapTypeId.TERRAIN, naver.maps.NaverMapTypeOption. getTerrainMap());
				_venderMap.mapTypes.set(naver.maps.MapTypeId.HYBRID, naver.maps.NaverMapTypeOption.getHybridMap());
				
				break;
			case 'daum' :
				_vender = daum.maps;
				_venderEvent = daum.maps.event;
				_venderMap = new _vender.Map(_container, {
					center: new _vender.LatLng(mapOptions.Y, mapOptions.X),
					level: mapOptions.level
				});
				
				break;
			}
			
			_setCurrentBounds();
			_initJiJeokDoLayer();
			
			if(listeners) {
				for(var eventName in listeners) {
					maps.event.addListener(eventName, listeners[eventName]);
				}
			}
			
			if(afterInit) afterInit(_venderMap);
		}
		else {
			throw new Error('[' + venderStr + '는(은) 지원하지 않습니다](supported : naver, daum');
		}
	}

	/** 
	 * @memberof hotplace.maps 
	 * @function panToBounds 
	 * @param {number} lat - 위도
	 * @param {number} lng - 위도
	 * @param {function} moveAfterFn - 지도 위치이동 후 실행할 함수
	 */
	maps.panToBounds = function(lat, lng, moveAfterFn) {
		
		if(_venderStr == 'naver') {
			_venderMap.morph(new _vender.LatLng(lat, lng), hotplace.config.addrSearchPanLevel, {duration: 100});
		}
		else if(_venderStr == 'daum') {
			/*_venderMap.panTo(new _vender.LatLngBounds(
	                new _vender.LatLng(lat - size, lng - size),
	                new _vender.LatLng(lat + size, lng + size)
	        ));*/
		}
		
		moveAfterFn();
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function getMarker
	 * @param {string}  markerType 마커타입
	 * @param {number}  lat 경도좌표
	 * @param {number}  lng 위도좌표
	 * @param {object}  listeners 마커이벤트 핸들러
	 * @param {object}  options 옵션
	 * @param {boolean} options.hasInfoWindow 클릭시 infoWindow 사용여부
	 * @param {string}  options.infoWinFormName 
	 * @param {number}  options.radius 마커주위 반경 (0일경우 표시안함) 
	 * @param {object}  options.datas 
	 * @desc 해당지점에 마커를 그리고 옵션값에 따라 해당지점을 중심으로 원을 그림 
	 */
	maps.getMarker = function(markerType, data, listeners, options) {
		var newMarker, newInfoWindow;
		
		newMarker = new _vender.Marker({
		    position: new _vender.LatLng(data.location[1], data.location[0]),
		    map: _venderMap,
		});
		
		newMarker._data = data;
		
		if(options.icon) {
			newMarker.setOptions('icon', {
		        content: '<img src="'+ hotplace.getContextUrl() +'resources/img/marker/' + options.icon + '" alt="" ' +
                		 'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
                		 '-webkit-user-select: none; position: absolute; width: 22px; height: 33px; left: 0px; top: 0px;">',
                size: new _vender.Size(22, 33),
                anchor: new _vender.Point(11, 33)
			});
		}
		
		_markers[markerType].m.push(newMarker);
		
		if(options.hasInfoWindow) {
			var winContent = {anchorSkew: true};
			
			//로컬정보로 윈도우 창 정보를 설정할 지 여부
			if(!options.isAjaxContent) {
				var tForm = hotplace.dom.getTemplate(options.infoWinFormName);
	            winContent.content = tForm({datas: options.datas.params});
	        } 
			 
			newInfoWindow = new _vender.InfoWindow(winContent);
			
			_infoWindowsForMarker[markerType].push(newInfoWindow);
		}
		
		if(listeners) {
			for(var eventName in listeners) {
				_venderEvent.addListener(newMarker, eventName, function($$eventName, $$newInfoWindow) {
					return function(obj) {
						
						listeners[$$eventName](_venderMap, newMarker, $$newInfoWindow);
					}
				}(eventName, newInfoWindow));
			}
		}
		
		if(options.radius) {
			var radiusSearchCircle = new _vender.Circle({
			    map: _venderMap,
			    center:  new _vender.LatLng(data.location[1], data.location[0]),
			    radius: options.radius,
			    fillColor: 'rgba(250,245,245)',
			    fillOpacity: 0,
			    clickable: true,
			    zIndex: 30000000
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'click', function(e) {
				hotplace.dom.insertFormInmodal('radiusSearchResultForm');
				hotplace.dom.openModal(options.datas.params.address + ' 일대 (반경: ' + options.radius + 'm)');
				
				$("#example-table").tabulator({
				    height:600, // set height of table
				    fitColumns:true, //fit columns to width of table (optional)
				    columns:[ //Define Table Columns
				        {title:"지번", field:"name", width:300},
				        {title:"소유구분", field:"age", align:"left", formatter:"progress", width:150},
				        {title:"지목", field:"col", width:150},
				        {title:"면적", field:"dob", sorter:"date", align:"center", width:150},
				    ],
				    rowClick:function(e, row){ //trigger an alert message when the row is clicked
				        alert("Row " + row.getData().id + " Clicked!!!!");
				    },
				});
				
				var tabledata = [
	                 {id:1, name:"서울시 강남구 도곡동 963", age:"12", col:"red", dob:""},
	                 {id:2, name:"서울시 강남구 도곡동 964", age:"1", col:"blue", dob:"14/05/1982"},
	                 {id:3, name:"서울시 강남구 도곡동 965", age:"42", col:"green", dob:"22/05/1982"},
	                 {id:4, name:"서울시 강남구 도곡동 966", age:"125", col:"orange", dob:"01/08/1980"},
	                 {id:5, name:"서울시 강남구 도곡동 967", age:"16", col:"yellow", dob:"31/01/1999"},
	             ];
				
				setTimeout(function() {
					$("#example-table").tabulator("setData", tabledata);
				}, 1000);
				
				
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'mouseover', function(e) {
				radiusSearchCircle.setOptions({
		            fillOpacity: 0.5
		        });
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'mouseout', function(e) {
				radiusSearchCircle.setOptions({
		            fillOpacity: 0
		        });
			});
			
			_markers[markerType].c.push(radiusSearchCircle);
		}
	},
	
	/**
	 * @memberof hotplace.maps 
	 * @function appendCell
	 * @desc 마우스로 드래그시 화면밖에 있다가 안으로 들어왔을때 안그려진 cell을 찾아 그린다.
	 */
	maps.appendCell = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(db.hasData(_currentLevel, _getActiveCellType())) {
			var startIdx = db.getStartXIdx(_getActiveCellType(), _marginBounds.swx, _currentLevel);
			_createCells(_currentLevel, startIdx);
		}
	};
	
	/**
	 * @memberof hotplace.maps 
	 * @function appendMarker
	 * @desc 마우스로 드래그시 화면밖에 있다가 안으로 들어왔을때 안그려진 marker를 찾아 그린다.
	 */
	maps.appendMarker = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(db.hasData(_currentLevel, _markerTypes.GYEONGMAE)) {
			var startIdx = db.getStartXIdx(_markerTypes.GYEONGMAE, _marginBounds.swx, _currentLevel);
			_createMarkers(_currentLevel, startIdx, _markerTypes.GYEONGMAE, {
				click : function(map, marker, win) {
					_createMarkerClick(map, marker, win);
				}
			}, {
				hasInfoWindow: true,
				isAjaxContent: true,
				radius:0,
				icon: 'blink.gif',
			});
		}
	};
	
	/**
	 * @memberof hotplace.maps 
	 * @function isInLocationBounds
	 * @desc 현재 화면이 location bounds범위안에 있는지 여부  
	 * @param {object} bnds
	 * @param {number} bnds.swx - 보이는 화면 극서좌표
	 * @param {number} bnds.nex - 보이는 화면 극동좌표
	 * @param {number} bnds.swy - 보이는 화면 극남좌표
	 * @param {number} bnds.ney - 보이는 화면 극북좌표
	 * @return {boolean} - location bound 안에 있으면 true 
	 */
	maps.isInLocationBounds = function(bnds) {
		return !(_locationBounds.swx > bnds.swx || 
				 _locationBounds.nex < bnds.nex ||
				 _locationBounds.swy > bnds.swy ||
				 _locationBounds.ney < bnds.ney);
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function showCellLayer
	 * @param {function} callback
	 * @param {boolean} isMaskTran multi ajax사용여부 
	 * @desc celltype의 cell layer를 보여준다  
	 */
	maps.showCellLayer = function(callback, isMaskTran) {
		
		if(_isOffCell()) return;
		
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(_venderMap) {
			
			//location
			//캐쉬구현(보류)
			if(false/*db.isCached(_currentLevel)*/) {
				//_showCellsLayer();
			}
			else {
				_initLayers(_currentLevel);
				
				var adjustLevel = (_currentLevel >=3 && _currentLevel <=5) ? _currentLevel + 1 : _currentLevel;
				hotplace.getPlainText('locationbounds', {
					level: adjustLevel/*_currentLevel*/,
					 swx : _locationBounds.swx,
					 nex : _locationBounds.nex,
					 swy : _locationBounds.swy,
					 ney : _locationBounds.ney,
					 year: hotplace.dom.getShowCellYear() + '01'
				}, function(json) {
					try {
						db.setLevelData(_currentLevel, _getActiveCellType(), json.datas);
						_showCellLayer();
						if(callback) callback();
					}
					catch(e) {
						throw e;
					}
				}, 
				true,
				isMaskTran);
			}
		}
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function showMarkers
	 * @param {function} callback
	 * @param {boolean} isMaskTran multi ajax사용여부 
	 * @desc marker type의 marker를 보여준다  
	 */
	maps.showMarkers = function(callback, isMaskTran) {
		var currentLevel = _getCurrentLevel(),
		    activeMarkers = maps.getActiveMarkers(),
		    activeMarkerCnt = activeMarkers.length,
		    url = '';
		
		//active level 비교
		if(maps.isActiveSalesView() && activeMarkerCnt > 0) {
			//_destroyMarkerType(_markerTypes.GYEONGMAE);
			_destroyMarkers(true);
			_setLocationBounds();
			if(_venderMap) {
				
				for(var k=0; k<activeMarkerCnt; k++) {
					url = _markers[activeMarkers[k]].url;
					
					(function(x) {
						hotplace.getPlainText(url, {
							 swx : _locationBounds.swx,
							 nex : _locationBounds.nex,
							 swy : _locationBounds.swy,
							 ney : _locationBounds.ney
						}, function(json) {
							try {
								hotplace.database.setLevelData(currentLevel, _markerTypes[activeMarkers[x]], json);
								_showMarkers(_markerTypes[activeMarkers[x]]);
								if(callback) callback();
								console.log(json);
							}
							catch(e) {
								throw e;
							}
						},
						true,
						isMaskTran);
					}(k));
					
					
				}
				
				
			}
		}
		else {
			
		}
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function showJijeokLayer
	 * @desc 맵벤더의 지적도 layer를 보여준다
	 * @param {('on'|'off')} onoff 지적도를 보여줄 버튼 switch 상태
	 * @param {object} $btn - jquery button object
	 */
	maps.showJijeokLayer = function(onOff, $btn) {
		  
		if(onOff == 'on') {
			if(_venderStr == 'naver') {
				_vender._cadastralLayer.setMap(null);
			}
			else if(_venderStr == 'daum') {
				_venderMap.removeOverlayMapTypeId(_vender.MapTypeId.USE_DISTRICT);
			}
			
			$btn.data('switch', 'off');
		}
		else if(onOff == 'off') {
			if(_venderStr == 'naver') {
				_vender._cadastralLayer.setMap(_venderMap);
			}
			else if(_venderStr == 'daum') {
				_venderMap.addOverlayMapTypeId(_vender.MapTypeId.USE_DISTRICT);
			}
			
			$btn.data('switch', 'on');
		}
	}
}(
	hotplace.maps = hotplace.maps || {},
	jQuery	
));

/**
 * @namespace hotplace.dom
 * */
(function(dom, $) {
	
	var _loadEl;
	var _loadTxt = '로딩 중입니다';
	var _loadEndCount = 0;
	
	/**
	 * @private
	 * @typedef {object} loadEffects
	 * @desc load mask type
	 * {@link https://github.com/vadimsva/waitMe/blob/gh-pages/index.html waitMe}
	 */
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
	
	/**
	 * @private
	 * @desc 맵 메인화면의 메뉴버튼을 모아놓은 DIV
	 */
	var _btnMapDiv = $('#mapButtons');
	
	/**
	 * @private
	 * @type {object}
	 * @desc javascript template engine handlebar를 통해 서버에서 가져온 html을 저장
	 */
	var _templates = {};
	
	/**
	 * @private
	 * @type {object}
	 * @desc cell layer의 한 cell을 클릭했을때 나타나는 infoWindow
	 */
	var _infoWindowForCell = null;
	
	/**
	 * @private
	 * @desc cell layer에 기본적으로 표시할 데이터 연도 
	 */
	var _showCellYear = 2017;
	
	
	/**
	 * @private
	 * @function _runWaitMe
	 * @param {object} loadEl loadmask를 적용할 jquery 객체
	 * @param {number} num loadmask style 선택(1|2|3)
	 * @param {loadEffects} effect loadmask effect type
	 * @param {string} msg 로딩 메시지
	 * @desc open source waitMe 설정
	 * {@link https://github.com/vadimsva/waitMe/blob/gh-pages/index.html waitMe}
	 */
	function _runWaitMe(loadEl, num, effect, msg){
		
		var fontSize = '';
		var maxSize = '';
		var loadTxt = msg || '로딩 중입니다';
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
		
		_loadEl = loadEl;
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
	
	/**
	 * @private
	 * @function _makeInfoWindowForCell
	 * @param {object} vender 맵 벤더객체
	 * @param {object} venderEvent 맵 벤더이벤트객체
	 * @param {*} data handlebars를 통해 template에 전달할 데이터
	 * @param {object} listeners 리스너 객체
	 * @param {function} listeners.eventName 리스너
	 * @returns {object} infoWindow
	 * @desc cell layer의 한 cell을 클릭했을때 나타나는 infoWindow를 생성함
	 *       생성후 전역변수 _infoWindowForCell에 저장
	 */
	function _makeInfoWindowForCell(vender, venderEvent, data, listeners) {
		var template = dom.getTemplate('cellForm');
		
		_infoWindowForCell = new vender.InfoWindow({
	        content: template(data),
	        borderWidth: 1
	        //zIndex: 1000
	    });
		
		_infoWindowForCell.setOptions('zIndex', 1000);
		
		if(listeners) {
			for(var eventName in listeners) {
				venderEvent.addListener(_infoWindowForCell, eventName, function($$eventName, $$infoWindowForCell) {
					return function(obj) {
						
						listeners[$$eventName]($$infoWindowForCell, obj);
					}
				}(eventName, _infoWindowForCell));
			}
		}
		
		
		
		return _infoWindowForCell;
	}
	
	/**
	 * @private
	 * @function _bindModalCloseEvent
	 * @param {function} closeFn close event handler
	 * @desc modal창이 닫힐때 handler 등록
	 *       생성후 전역변수 _infoWindowForCell에 저장
	 */
	function _bindModalCloseEvent(closeFn) {
		$('#containerModal').on('hidden.bs.modal', closeFn || function () {});
	}
	
	var _layer = {};
	
	
	/**
	 * @memberof hotplace.dom
	 * @function openLayer
	 * @param {string} targetId 해당레이어를 나오게 할 버튼 id값
	 * @param {object} options 맵 벤더이벤트객체
	 * @param {number} options.top 레이어의 top위치
	 * @desc 맵의 메뉴버튼을 눌렀을때 보여질 레이어를 생성함
	 *       생성후 전역변수 _infoWindowForCell에 저장
	 */
	dom.openLayer = function(targetId, options) {
		
		if(!_layer[targetId]) _layer[targetId] = $('#'+targetId);
		
		//var $close = $layer.find('.close');
		var width = _layer[targetId].outerWidth();
		var ypos = options.top;
		var xpos = options.left;
		var marginLeft = 0;
		
		if(xpos==undefined){
			xpos = '50%';
			marginLeft = -(width/2);
		}
		
		if(!_layer[targetId].is(':visible')){
			_layer[targetId].css({'top':ypos+'px','left':xpos,'margin-left':marginLeft})
		    	  .show();
		}
		
		/*$close.bind('click',function(){
			if($layer.is(':visible')){
				$layer.hide();
			}
			
			return false;
		});*/
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeLayer
	 * @param {string} targetId 해당레이어를 사라지게 할 버튼 id값
	 * @desc 맵의 메뉴버튼을 눌렀을때 보이고 있는 레이어를 감춤
	 */
	dom.closeLayer = function(targetId) {
		if(_layer[targetId].is(':visible')){
			_layer[targetId].hide();
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openInfoWindowForCell
	 * @param {object} 
	 * @param {object} location 맵벤더 LatLng 객체
	 * @param {object} vender 맵벤더 객체(naver.maps, daum.maps)
	 * @param {object} venderEvent 맵벤더 이벤트객체
	 * @param {*} data handlebars를 통해 template에 전달할 데이터
	 * @param {object} listeners 리스너 객체
	 * @param {function} listeners.eventName 리스너
	 * @desc cell 정보를 보여줄 infoWindow를 생성하고 open한다
	 */
	dom.openInfoWindowForCell = function(map, location, vender, venderEvent, data, listeners) {
		_infoWindowForCell = _makeInfoWindowForCell(vender, venderEvent, data, listeners);
		_infoWindowForCell.open(map, location);
		
		//event handler가 걸려있는지 확인
		var ev = $._data(document.getElementById('btnCellClose'), 'events');
		if(!ev || !ev.click) {
			$('#btnCellClose').on('click', function(e) {
				dom.closeInfoWindowForCell();
			});
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeInfoWindowForCell
	 * @desc cell 정보를 나타내는 infoWindow를 닫은후 제거한다.
	 */
	dom.closeInfoWindowForCell = function() {
		if(_infoWindowForCell) {
			_infoWindowForCell.close();
			_infoWindowForCell = null;
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function initTooltip
	 * @param {string} selectorClass tootip을 적용할 class 값
	 * @desc open source tooltipster 설정
	 * {@link https://github.com/louisameline/tooltipster-follower tooltipster}
	 */
	dom.initTooltip = function(selectorClass, options) {
		var target = {
			theme: 'tooltipster-borderless',
			trigger: 'custom',
			side: 'top',
			functionBefore: function(instance, helper) {
				return true;
			}
		};
		
		$.extend(target, options);
		// first on page load, initialize all tooltips
		$('.' + selectorClass).tooltipster(target);
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openTooltip
	 * @param {string} selector  tooltip을 open할 jquery selector
	 * @desc 해당 셀렉터의 tooltipster open
	 */
	dom.openTooltip = function(selector) {
		$(selector).tooltipster('open');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeTooltip
	 * @param {string} selector  tooltip을 close할 jquery selector
	 * @desc 해당 셀렉터의 tooltipster close
	 */
	dom.closeTooltip = function(selector) {
		$(selector).tooltipster('close');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeAllTooltip
	 * @param {string} CLASS  tooltip을 close할 jquery class selector
	 * @desc 해당 셀렉터의 모든 tooltipster close
	 */
	dom.closeAllTooltip = function(CLASS) {
		$(CLASS).each(function(index) {
			$(this).tooltipster('close');
		})
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openModal
	 * @param {string} title  modal창 헤더부분에 표시할 title
	 * @param {string} modalSize modal창 사이즈('bigsize'|'fullsize') 
	 * @param {function} closeFn modal창 close handler
	 * @desc 모달창 open
	 */
	dom.openModal = function(title, modalSize, closeFn) {
		$('#spModalTitle').text(title);
		
		if(!modalSize) modalSize = 'fullsize';
		
		$('#containerModal > .modal-dialog').removeClass('modal-fullsize modal-bigsize');
		$('#containerModal > .modal-content').removeClass('modal-fullsize modal-bigsize'); 
		
		$('#containerModal > .modal-dialog').addClass('modal-' + modalSize);
		$('#containerModal > .modal-content').addClass('modal-' + modalSize);
		
		
		$('#containerModal').modal('show');
		_bindModalCloseEvent(closeFn);
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function createChart
	 * @desc chart 생성
	 */
	dom.createChart = function() {
		hotplace.chart.showEchartBar();
		hotplace.chart.showEchartScatter();
		hotplace.chart.showEchartPie();
		hotplace.chart.showEchartLine();  
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showMask
	 * @param {string} loadEl loadmask element selector  
	 * @desc waitMe mask show
	 */
	dom.showMask = function(loadEl, msg) {
		if(loadEl) {
			loadEl = $(loadEl);
		}
		else {
			loadEl = $('body');
		}
		_runWaitMe(loadEl, 1, _loadEffects.timer, msg);
	};
	
	dom.showMaskTransaction = function(count, loadEl, msg) {
		_loadEndCount = count || 0;
		dom.showMask(loadEl, msg);
	}
	
	dom.hideMaskTransaction = function() {
		--_loadEndCount;
		if(_loadEndCount == 0) {
			dom.hideMask();
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideMask
	 * @desc waitMe mask hide
	 */
	dom.hideMask = function() {
		_loadEl.waitMe('hide');
	};
	
	/**
	 * @memberof hotplace.dom
	 * @function getTemplate
	 * @param {string} name 저장할 template의 키값
	 * @returns {object} - Handlebars.compile() 결과값
	 * @desc waitMe mask hide
	 */
	dom.getTemplate = function(name) {
		if(_templates[name] === undefined) {
			var url = 'resources/templates/';
			
			hotplace.ajax({
				url : url + name + '.handlebars',
				async : false,
				dataType : 'html',
				method : 'GET',
				activeMask : false,
				success : function(data, textStatus, jqXHR) {
					_templates[name] = Handlebars.compile(data);
				},
				error: function() {
					throw new Error('html template error')
				}
			});
			
		}
		
		return _templates[name];
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function insertFormInmodal
	 * @param {string} name 서버에서 가져올 handlebars 파일명, 태그(<)로 시작하면 jquery로 dom에 붙인다 
	 * @returns {object} - Handlebars.compile() 결과값
	 * @desc 모달창 body부분에 html을 삽입한다
	 */
	dom.insertFormInmodal = function(name) {
		
		var elContent = $('#dvModalContent');
		if(($.trim(name)).indexOf('<') == 0) {/*html 직접입력*/
			elContent.html(name);
		}
		else {
			var tForm = dom.getTemplate(name);
			elContent.html(tForm());
		}
	}
	
	
	
	/**
	 * @memberof hotplace.dom
	 * @function getSelectOptions
	 * @param {Array.<string[]>} data htnl select option value,text 
	 * @param {string} title 서버에서 가져올 handlebars 파일명, 태그(<)로 시작하면 jquery로 dom에 붙인다 
	 * @returns {string} - html select option string
	 * @desc select box의 option string을 구한다
	 */
	dom.getSelectOptions = function(data, title) {
		var len = data.length;
		var html = '<option value="">- ' + title + '  -</option>';
		for(var i=0; i < len; i++) {
			html += '<option value="' + data[i][0] + '">' + data[i][1] + '</option>'; 
		}
		
		return html;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function addButtonInMap
	 * @param {object} params 
	 * @param {string} params.id 생성할 button id
	 * @param {string} params.glyphicon bootstrap glyphicon name 
	 * @param {string} params.attr 추가할 버튼 속성
	 * @param {string} params.clazz 추가할 버튼 class
	 * @param {function} params.callback 버튼 클릭이벤트 리스너
	 * @desc 지도에 메뉴 버튼을 생성함
	 */
	dom.addButtonInMap = function(params) {
		
		var template = function(disabled){
			
			return disabled ? '<button id="{0}" type="button" disabled class="button button-disabled {3} {4} {5}" {1}>{2}</button>' :
				              '<button id="{0}" type="button" class="button {3} {4} {5}" {1}>{2}</button>';
		}
		
		if(params) {
			var len = params.length;
			var btns = '';
			
			for(var i=0; i<len; i++) {
				if(params[i].glyphicon){
					btns += template(params[i].disabled).format(params[i].id, params[i].attr || '', params[i].title || '', 'glyphicon', 'glyphicon-' + params[i].glyphicon, params[i].clazz || '');
				}
				else {
					btns += template(params[i].disabled).format(params[i].id, params[i].attr || '', params[i].title || '', params[i].clazz || '');
				}
			}
			
			if(btns) {
				_btnMapDiv.html(btns);
				
				//event handler
				for(var i=0; i<len; i++) {
					$('#' + params[i].id).on('click', params[i].callback);
				}
			}
		}
	}
	
	dom.captureToCanvas = function() {
	    var nodesToRecover = [];
	    var nodesToRemove = [];
	    var targetElem = $('#map');
	    //var els =  document.getElementsByTagName('svg')[0]
		//var elsLen = els.length;
	    var svgElem = targetElem.find('svg\\:svg');

	    svgElem.each(function(index, node) {
	        var parentNode = node.parentNode;
	        var svg = parentNode.innerHTML;

	        var canvas = document.createElement('canvas');

	        canvg(canvas, svg);

	        nodesToRecover.push({
	            parent: parentNode,
	            child: node
	        });
	        parentNode.removeChild(node);

	        nodesToRemove.push({
	            parent: parentNode,
	            child: canvas
	        });

	        parentNode.appendChild(canvas);
	    });
	    
	    hotplace.ajax({
	    	url: 'sample/naverForm',
	    	method: 'GET',
	    	dataType: 'html',
	    	success: function(data) {
	    		console.log(data);
	    		var d = $('#test2');
	    		d.html(data)
	    		console.log(d);
	    		html2canvas(d, {
	    			allowTaint: true,
	    			taintTest: false,
	    			useCORS: true,
	    			profile: true,
	    			onrendered: function(canvas) {
	    				//$('body').append(canvas);
	    				console.log(canvas)
	    				var img = canvas.toDataURL('image/png');
	    				d.html('');
	    				$('#ii').attr('src', img)
	    			}
	    		});
	    	}
	    });
	    
		/*html2canvas(targetElem, {
			allowTaint: true,
			taintTest: false,
			useCORS: true,
			profile: true,
			onrendered: function(canvas) {
				$('body').append(canvas);
			}
		});*/
		
	}
	
	/**
	 * @private
	 * @function _workSpinner
	 * @param {object} $txt spinner의 textbox jquery object
	 * @param {string} upDown spinner updown('up'|'down')
	 * @desc spinner up/down 동작 컨트롤
	 */
	function _workSpinner($txt, upDown, fnStr) {
		var step, 
		    viewVal = 0,
		    dataVal = 0,
		    suffix = $txt.data('suffix'),
		    min = $txt.data('min'),
		    max = $txt.data('max'),
		    type = $txt.data('type'),
		    curVal = parseFloat($txt.data('value'));
		
		// min max가 0일 경우 step안에 있는 값만 허용
		if(min == '0' && max == '0') {
			step = $txt.data('step');
			
			//초기 index 설정
			var idx = $txt.data('index');
			
			if(idx == undefined) {
				for(var i=0; i<step.length; i++) {
					if(step[i] == curVal) {
						$txt.data('index', idx = i)
						break;
					}
				}
			}
			
			if(idx == undefined) throw new Error(curVal + '값은 step에 없습니다.');
			
			if(upDown == 'up') {
				if(idx == step.length - 1) return;
				dataVal = step[++idx]; 
			}
			else {
				if(idx == 0) return;
				dataVal = step[--idx];
			}
			
			$txt.data('index', idx);
		}
		else {
			var strStep = $txt.data('step');
			var fractionDigits = strStep.toString().getDecimalCount();
			step = parseFloat(strStep);
			if(upDown == 'up') {
				var nextVal = curVal + step;
				if(max == undefined || nextVal <= parseFloat(max)) {
					if(fractionDigits > -1) {
						dataVal = nextVal.toFixed(fractionDigits) 
					}
					else {
						dataVal = nextVal;
					}
				}
				else  {
					dataVal = max;
				}
			}
			else {
				var prevVal = curVal - step;
				if(min == undefined || prevVal >= parseFloat(min)) {
					if(fractionDigits > -1) {
						dataVal = prevVal.toFixed(fractionDigits);
					}
					else {
						dataVal = prevVal;
					}
				}
				else  {
					dataVal = min;
				}
			}
		}
		
		$txt.data('value', dataVal);
		switch(type) {
		case 'money' :
			viewVal = dataVal.toString().money() + suffix;
			break;
		default :
			viewVal = dataVal + suffix;
			break;
		}
		
	    $txt.val(viewVal);
	    hotplace.calc.profit[fnStr]();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function viewProfit
	 * @param {string} addr 주소
	 * @desc 수지분석 폼 보기
	 * {@link https://github.com/simeydotme/jQuery-ui-Slider-Pips jQuery-ui-slider-pips} 
	 */
	dom.viewProfit = function(params) {
		var tForm = dom.getTemplate('profitForm');
		
		console.log(params)
		$('#dvModalContent').html(tForm(params));
		
		//txt tooltip 
		hotplace.dom.initTooltip('txtProfitTooltip',{trigger: 'hover'});
		
		//수지분석 상세보기 collapse
		$('#detailView').on('click', function() {
			if($(this).hasClass('glyphicon-chevron-up')) {
				$(this).removeClass('glyphicon-chevron-up');
				$(this).addClass('glyphicon-chevron-down');
				
				$('tr.collapse.out').each(function(idx) {
					$(this).removeClass('out');
					$(this).addClass('in');
				});
			}
			else {
				$(this).removeClass('glyphicon-chevron-down');
				$(this).addClass('glyphicon-chevron-up');
				
				$('tr.collapse.in').each(function(idx) {
					$(this).removeClass('in');
					$(this).addClass('out');
				});
			}
		});
		
		//수지분석 토지이용규제 변경 내역 보기
		$('#btnViewLandLimit').on('click', function(e) {
			if(!e.currentTarget.secondCall) {
				
				e.currentTarget.secondCall = true;
				dom.initTooltip('profitTooltip',{side: 'left'});
				//$(this).trigger('click');
			}
			
			var onOff = $(this).data('switch');
			if(onOff == 'off') {
				hotplace.dom.openTooltip('#btnViewLandLimit');
				$(this).data('switch', 'on');
				$(this).html(' 토지이용규제 변경내역닫기');
				$(this).removeClass('glyphicon-folder-close');
				$(this).addClass('glyphicon-folder-open');
			}
			else {
				hotplace.dom.closeTooltip('#btnViewLandLimit');
				$(this).data('switch', 'off');
				$(this).html(' 토지이용규제 변경내역보기');
				$(this).removeClass('glyphicon-folder-open');
				$(this).addClass('glyphicon-folder-close');
			}
		});
		
		var stepYangdose2 = $('#stepYangdose2');
		
		//매입주체 
		$('input[name="radioOwn"]').on('click', function(e) {
			var targetId = e.target.id;
			//개인 (양도세 세율)
			if(id == 'radioPrivate') {
				
			}
			else {
				
			}
			
		});
		
		
		//재산세 checkbox (주택)
		$('#chkJaesanse').on('change', function() {
			var $txtJaesanseH1 = $('#txtJaesanseH1');
			var $txtJaesanseH2 = $('#txtJaesanseH2');
			var $txtJaesanseH3 = $('#txtJaesanseH3');
			var $WJaesanse2    = $('#WJaesanse2');
			var $stepOwnTerm   = $('#stepOwnTerm');
			
			if($(this).is(':checked')) {
				$txtJaesanseH1.prop('disabled', false);
				$txtJaesanseH2.prop('disabled', false);
				$txtJaesanseH3.prop('disabled', false);
				$WJaesanse2.prop('disabled', false);
			}
			else {
				$txtJaesanseH1.prop('disabled', true);
				$txtJaesanseH2.prop('disabled', true);
				$txtJaesanseH3.prop('disabled', true);
				$WJaesanse2.prop('disabled', true);
			}
			
			hotplace.calc.profit.calcJaesanse2(false, true);
		});
		
		//양도세 비사업용 체크 
		$('#chkYangdose').on('click', function() {
			hotplace.calc.profit.calcYangdose();
		});
		
		hotplace.validation.numberOnly('#txtJaesanseH1', function() {
			hotplace.calc.profit.calcJaesanse2();
		});
		
		hotplace.validation.numberOnly('#stepYangdose', function($this) {
			var step = hotplace.calc.profit.makeStep($this.data('value'), hotplace.config.yangdoseStepPercent);
			$this.data('step', step);
			hotplace.calc.profit.calcYangdose();
		});
		
		hotplace.validation.numberOnly('#stepGeonchugGongsa', function($this) {
			hotplace.calc.profit.calcGeonchugGongsa();
		});
		
		hotplace.validation.numberOnly('#stepTomogGongsa', function($this) {
			hotplace.calc.profit.calcTomogGongsa();
		});
		
		hotplace.validation.numberOnly('#stepPojangGongsa', function($this) {
			hotplace.calc.profit.calcPojangGongsa();
		});
		
		hotplace.validation.numberOnly('#stepInibGongsa', function($this) {
			hotplace.calc.profit.calcInibGongsa();
		});
		
		//spinner
		$('#tbProfit .spinner .btn:first-of-type').on('click', function() {
			var parentDv = $(this).parent();
			_workSpinner(parentDv.parent().children('input:first-child'), 'up', parentDv.data('fn'));
		});
		
		$('#tbProfit .spinner .btn:last-of-type').on('click', function() {
			var parentDv = $(this).parent();
			_workSpinner($(this).parent().parent().children('input:first-child'), 'down', parentDv.data('fn'));
		});
		
		hotplace.calc.profit.initCalc(params);
		dom.openModal('수지 분석(소재지: ' + params.address + ')', 'fullsize', function() {
			try {
				//닫힐때 토지 이용규제 tooltip이 열려있으면 tooltip을 닫는다.
				dom.closeTooltip('.profitTooltip');
			}
			catch(e) {} //툴팁을 한번도 open 하지 않은 상태에서 close하면 error 발생
		});
		/*var sliderTooltip = function(target, html, defaultV) {
			
			return function(event, ui) {
				console.log(event);
				console.log(ui);
				var v = (ui.value == undefined) ? defaultV : ui.value;
			    var tooltip = '<div style="display:none" class="tooltip"><div class="tooltip-inner">' + html + '(선택값: <span id="sp_' + target + '">' + v + '</span>) </div></div>';
			    $('#' + target + ' .ui-slider-handle').html(tooltip); //attach tooltip to the slider handle
			}
		}
		
		var event = function(target) { 
			return {
				mouseout: function() {
					$('#' + target +' .tooltip').hide();
				},
				mouseover: function() {
					$('#' + target +' .tooltip').show();
				},
				//label을 클릭했을때 발생 
				click: function(event) {
					var data = $(event.target).data('value');
					console.log(data);
					$('#sp_' + target).text(data);
				}
			};
		}
		
		var profitToolHtml = {
			stepPurchase:        '<div style="width:150px">최근 1년간 반경 1km이내 유사조건 물건의 실거래가 평균</div>',
			stepOwnTerm:         '<div><pre>한글</pre></div>',
			stepOtherAssetRatio: '<div style="width:150px">담보 가능여부와  매입주체의 신용도에 따라 대출규모 상이</div>',
			stepFinancialCost:   '<div style="width:150px">매입주체의 신용도에 따라 설정</div>',
			stepAcquisitionTax:  '<div style="width:300px">1.토지(농지외): 4.6%(취득세4%,농특세0.2%,교육세0.4%)<br/>' + 
								 '2.농지(전,답,과수원,목장용지): 3.4%(취득세 3.0% + 농특세 0.2% + 교육세 0.2%)</div>',
			stepPropertyTax:	 '<div style="width:300px">' +
								 '1.산식: 공시지가×요율×보유기간<br/>' +
								 '2.요율<br/>' + 
								 ' 1)주택: 3억원 초과시 57만원 + 3억원 초과금액의 0.4%<br/>' +
								 ' 2)일반 건축물: 0.25%<br/>' +
								 ' 3)특별시, 광역시내 건축물: 0.5%<br/>' +
								 ' 4)토지(농지): 0.07%<br/>' +
								 ' 5)토지(공장용지): 0.2%' +
								 '</div>',
			stepTransferTax:     '<div style="width:300px">' +
		    					 '1. 개인(양도세)<br/>' +
		    					 '  1)1년 미만: 50%(비사업용은 60%)<br/>' +
		    					 '  2)2년 미만: 40%(비사업용은 50%)<br/>' +
		    					 '  3)2년 이상: 기본세율<br/>' +
		    					 '  4)기본 세율<br/>' +
		    					 '    - 1200만원이하: 6%<br/>' +
		    					 '    - 1200만원초과 ~ 4600만원이하: 15%<br/>' +
		    					 '    - 4600만원초과 ~ 8800만원이하: 24%<br/>' +
		    					 '    - 8800만원초과 ~ 1억5천만원이하: 35%<br/>' +
		    					 '    - 1억5천만원초과 ~ 5억원이하: 38%<br/>' +
		    					 '    - 5억원초과: 40%<br/>' +
		    					 '2. 비사업토지는 토지 등 양도소득에 대한 법인세 10% 추가<br/>' +
		    					 '</div>',
		    stepCorporateTax:	 '<div style="width:300px">' +
		    					 '1. 법인세<br/>' +
		    					 ' 1)2억원 이하: 10%<br/>' +
		    					 ' 2)2억 초과 ~ 200억 이하: 20%<br/>' +
		    					 ' 3)200억 초과: 22%<br/>' +
		    					 '2. 비사업용 토지는 토지 등 양도소득에 대한 법인세 10% 추가<br/>' +
		    					 '</div>',
		    stepCivilWorksFee:   '<div style="width:150px">' +
		    					 '일반적인 기준: 15만원/3.3㎡<br/>' +
		    					 '</div>',
		    stepBuildingWorksFee:'<div style="width:150px">' +
		    					 '일반적인 기준: 450만원/3.3㎡<br/>' +
		    					 '</div>',
		    stepLicenseCost: 	 '<div style="width:150px">' +
		    					 '인허가 이행 여부에 따라 설정(매입가의 5% 적용)' +
		    					 '</div>',
		    stepDevBudamgeum:    '<div style="width:300px">' +
		    					 '1. 산식: 개발이익×25%<br/>' +
		    					 '2. 개발이익 = (종료시점지가 - 개시시점지가) - 개발비용 - 정상지가 상승분<br/>' +
		    					 '3. 부과대상 <br/>' +
		    					 '</div>',
		    stepFarmConserve:    '<div style="width:300px">' +
		    					 '1. 산식: 공시지가의 30%<br/>' +
		    					 '2. 산식에 따른 산출금액이 50천원/㎡을 초과할 경우, 50천원/㎡ 적용 <br/>' +
		    					 '3. 도로, 철도 등 주요산업 시설이나 농어업용 시설을 설치하는 경우에는 부담금 감면  <br/>' +
		    					 '</div>',
		    stepForestResource:  '<div style="width:300px">' +
		    					 '1. 산식: 산지전용면적×(단위면적당 금액 + 공시지가의 1%)<br/>' +
		    					 '2. 단위면적당 금액<br/>' +
		    					 ' 1)준보전산지: 4,010원/㎡<br/>' +
		    					 ' 2)보전산지: 5,210원/㎡<br/>' +
		    					 ' 3)산지전용 제한지역: 8,020원/㎡<br/>' +
		    					 '</div>',
		    stepBondPurchase:    '<div style="width:150px">4.5% 기준</div>',
		    stepGeunJeoDang:	 '<div style="width:150px">' +
		    					 '1. 산식: 대출금액의 130% × 요율<br/>' +
		    					 '2. 요율: 0.4% 적용'+
		    					 '</div>',
		    stepDeungGi: 		 '<div style="width:150px">공사비의 3.2% 내용</div>',
		    stepManageFee: 		 '<div style="width:150px">운영 수입의  50% 내용</div>',
		    stepSaleFee: 		 '<div style="width:150px">법정 수수료 = 매각금액의 0.9%이하</div>',
		    stepResolveMoney:    '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		    stepLandFee:		 '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		    stepBuildingFee:     '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		    stepEquipmentFee:    '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		};
		
		//매입가격
		$('#stepPurchase')
		.slider({min: -10, max: 200, values: [100], step: 10, change: function(event,ui) {
			 $('#txtPurchase').val(ui.value);
		}, create:sliderTooltip('stepPurchase', profitToolHtml.stepPurchase, 100), slide: sliderTooltip('stepPurchase', profitToolHtml.stepPurchase)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(21);
			x[0] = '-10%', x[6] = '50%', x[11] = '100%', x[16] = '150%', x[21] = '200%';
			return x
		}()})
		.on(event('stepPurchase'));
		
		//$('#stepPurchase .ui-slider-handle').on(event('stepPurchase'));
		
		//보유기간
		$('#stepOwnTerm')
		.slider({min: 0, max: 10, values: [0,5], step: 1,  range: true, change: function(event,ui){
	        console.log(ui);
	        $('#resultTotalInvestmentPrice').val(ui.value);
	    }, create:sliderTooltip('stepOwnTerm', profitToolHtml.stepOwnTerm), slide: sliderTooltip('stepOwnTerm', profitToolHtml.stepOwnTerm)})
		.slider('pips',{rest: 'label', labels: false, prefix: '', suffix: '년'})
		//.on(event('stepOwnTerm'));
		
		//타인자본비율
		$('#stepOtherAssetRatio')
		.slider({min: 0, max: 100, values: [70], step: 10, change:function() {
			
		}, create:sliderTooltip('stepOtherAssetRatio', profitToolHtml.stepOtherAssetRatio, 70), slide: sliderTooltip('stepOtherAssetRatio', profitToolHtml.stepOtherAssetRatio)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: '%'})
		.on(event('stepOtherAssetRatio'));
		
		
		//대출 금리
		$('#stepFinancialCost')	
		.slider({min: 0, max: 20, values: [5], step: 0.5,  change: function(event,ui){
	        $('#txtFinancialCost').val(ui.value);
	    }, create:sliderTooltip('stepFinancialCost', profitToolHtml.stepFinancialCost, 5), slide: sliderTooltip('stepFinancialCost', profitToolHtml.stepFinancialCost)})
		.slider('pips',{labels: function() {
			var x = new Array(40);
			x[0] = '0%', x[10] = '5.0%', x[20] = '10.0%', x[30] = '15.0%', x[40] = '20.0%';
			return x
		}(), rest: 'label'})
		.on(event('stepFinancialCost'));
		
		//취득세
		$('#stepAcquisitionTax')	
		.slider({min: 0, max: 10, values: [5], step: 0.5, change: function(event,ui){
	        $('#txtAcquisitionTax').val(ui.value);
	    },create:sliderTooltip('stepAcquisitionTax', profitToolHtml.stepAcquisitionTax, 5.0), slide: sliderTooltip('stepAcquisitionTax', profitToolHtml.stepAcquisitionTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '2.5%', x[10] = '5.0%', x[15] = '7.5%', x[20] = '10.0%';
			return x
		}()})
		.on(event('stepAcquisitionTax'));
		
		//재산세
		$('#stepPropertyTax')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtPropertyTax').val(ui.value);
	    }, create:sliderTooltip('stepPropertyTax', profitToolHtml.stepPropertyTax, 100), slide: sliderTooltip('stepPropertyTax', profitToolHtml.stepPropertyTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepPropertyTax'));
		
		//양도세
		$('#stepTransferTax')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtTransferTax').val(ui.value);
	    }, create:sliderTooltip('stepTransferTax', profitToolHtml.stepTransferTax, 100), slide: sliderTooltip('stepTransferTax', profitToolHtml.stepTransferTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepTransferTax'));
		
		//법인세
		$('#stepCorporateTax')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtCorporateTax').val(ui.value);
	    }, create:sliderTooltip('stepCorporateTax', profitToolHtml.stepCorporateTax, 100), slide: sliderTooltip('stepCorporateTax', profitToolHtml.stepCorporateTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepCorporateTax'));
		
		//토목 공사비
		$('#stepCivilWorksFee')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtCivilWorksFee').val(ui.value);
	    }, create:sliderTooltip('stepCivilWorksFee', profitToolHtml.stepCivilWorksFee, 100), slide: sliderTooltip('stepCivilWorksFee', profitToolHtml.stepCivilWorksFee)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepCivilWorksFee'));
		
		//건축 공사비
		$('#stepBuildingWorksFee')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtBuildingWorksFee').val(ui.value);
	    }, create:sliderTooltip('stepBuildingWorksFee', profitToolHtml.stepBuildingWorksFee, 100), slide: sliderTooltip('stepBuildingWorksFee', profitToolHtml.stepBuildingWorksFee)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepBuildingWorksFee'));
		
		//인허가 비용
		$('#stepLicenseCost')	
		.slider({min: 0, max: 19, values: [10], step: 1, change: function(event,ui){
			var val;
			if(ui.value > 10) {
				val = (((ui.value) % 10) + 1) * 1000;
			}
			else {
				val = (ui.value) * 100;
			}
	        $('#txtLicenseCost').val(val);
	    }, create:sliderTooltip('stepLicenseCost', profitToolHtml.stepLicenseCost, 10), slide: sliderTooltip('stepLicenseCost', profitToolHtml.stepLicenseCost)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(9);
			x[0] = '0', x[5] = '5백만', x[10] = '1천만', x[14] = '5천만', x[19] = '1억';
			return x
		}()})
		.on(event('stepLicenseCost'));
		
		//개발부담금
		$('#stepDevBudamgeum')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtDevBudamgeum').val(ui.value);
	    }, create:sliderTooltip('stepDevBudamgeum', profitToolHtml.stepDevBudamgeum), slide: sliderTooltip('stepDevBudamgeum', profitToolHtml.stepDevBudamgeum)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepDevBudamgeum'));
		
		//농지보전 부담금
		$('#stepFarmConserve')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtFarmConserve').val(ui.value);
	    }, create:sliderTooltip('stepFarmConserve', profitToolHtml.stepFarmConserve), slide: sliderTooltip('stepFarmConserve', profitToolHtml.stepFarmConserve)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepFarmConserve'));
		
		//대체산림자원 조성비 
		$('#stepForestResource')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtForestResource').val(ui.value);
	    }, create:sliderTooltip('stepForestResource', profitToolHtml.stepForestResource), slide: sliderTooltip('stepForestResource', profitToolHtml.stepForestResource)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepForestResource'));
		
		//채권 매입비
		$('#stepBondPurchase')	
		.slider({min: 0, max: 9, values: [4.5], step: 0.5, change: function(event,ui){
	        $('#txtBondPurchase').val(ui.value);
	    }, create:sliderTooltip('stepBondPurchase', profitToolHtml.stepBondPurchase, 4.5), slide: sliderTooltip('stepBondPurchase', profitToolHtml.stepBondPurchase)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(19);
			x[0] = '0%', x[4] = '2.0%', x[9] = '4.5%', x[14] = '7.0%', x[18] = '9.0%';
			return x
		}()})
		.on(event('stepBondPurchase'));
		
		//근저당 설정비
		$('#stepGeunJeoDang')	
		.slider({min: 0, max: 0.8, values: [0.4], step: 0.1, change: function(event,ui){
	        $('#txtGeunJeoDang').val(ui.value);
	    }, create:sliderTooltip('stepGeunJeoDang', profitToolHtml.stepGeunJeoDang, 0.4), slide: sliderTooltip('stepGeunJeoDang', profitToolHtml.stepGeunJeoDang)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: ['0', '0.1%','0.2%','0.3%','0.4%','0.5%','0.6%','0.7%','0.8%'], prefix: '', suffix: ''})
		.on(event('stepGeunJeoDang'));
		
		//보존등기비
		$('#stepDeungGi')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtDeungGi').val(ui.value);
	    }, create:sliderTooltip('stepDeungGi', profitToolHtml.stepDeungGi), slide: sliderTooltip('stepDeungGi', profitToolHtml.stepDeungGi)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepDeungGi'));
		
		//운영비
		$('#stepManageFee')	
		.slider({min: 0, max: 100, values: [50], step: 10, change: function(event,ui){
	        $('#txtManageFee').val(ui.value);
	    }, create:sliderTooltip('stepManageFee', profitToolHtml.stepManageFee, 50), slide: sliderTooltip('stepManageFee', profitToolHtml.stepManageFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepManageFee'));
		
		//매각 수수료
		$('#stepSaleFee')	
		.slider({min: 0, max: 1.8, values: [0.9], step: 0.1, change: function(event,ui){
	        $('#txtSaleFee').val(ui.value);
	    }, create:sliderTooltip('stepSaleFee', profitToolHtml.stepSaleFee, 0.9), slide: sliderTooltip('stepSaleFee', profitToolHtml.stepSaleFee)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(19);
			x[0] = '0%', x[3] = '0.3%', x[6] = '0.6%', x[9] = '0.9%', x[12] = '1.2%', x[15] = '1.5%', x[18] = '1.8%';
			return x
		}()})
		.on(event('stepSaleFee'));
		
		//예비비
		$('#stepResolveMoney')	
		.slider({min: 0, max: 20, values: [10], step: 1, change: function(event,ui){
	        $('#txtResolveMoney').val(ui.value);
	    }, create:sliderTooltip('stepResolveMoney', profitToolHtml.stepResolveMoney, 10), slide: sliderTooltip('stepResolveMoney', profitToolHtml.stepResolveMoney)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(21);
			x[0] = '0%', x[5] = '5%', x[10] = '10%', x[15] = '15%', x[20] = '20%';
			return x
		}()})
		.on(event('stepResolveMoney'));
		
		//수입발생기간
		$('#stepIncomeOccurTerm')	
		.slider({min: 0, max: 10, values: [0, 2], step: 1, range: true, change: function(event,ui){
	        $('#txtIncomeOccurTerm').val(ui.value);
	    }})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: '년'});
		
		//연간수입 금액
		$('#stepIncomeYear')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtIncomeOccurTerm').val(ui.value);
	    }})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		//토지매도 가격
		$('#stepLandFee')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtLandFee').val(ui.value);
	    }, create:sliderTooltip('stepLandFee', profitToolHtml.stepLandFee), slide: sliderTooltip('stepLandFee', profitToolHtml.stepLandFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepLandFee'));
		
		//건물매도 가격
		$('#stepBuildingFee')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtLandFee').val(ui.value);
	    }, create:sliderTooltip('stepBuildingFee', profitToolHtml.stepBuildingFee), slide: sliderTooltip('stepBuildingFee', profitToolHtml.stepBuildingFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepBuildingFee'));
		
		//설비매도 가격
		$('#stepEquipmentFee')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtEquipmentFee').val(ui.value);
	    }, create:sliderTooltip('stepEquipmentFee', profitToolHtml.stepEquipmentFee), slide: sliderTooltip('stepEquipmentFee', profitToolHtml.stepEquipmentFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepEquipmentFee'));*/
		

		//dom.initTooltip('ui-slider-handle', {trigger:'hover'});
	}
	
	var _yearRangeMode = 'manual';
	
	/**
	 * @memberof hotplace.dom
	 * @function enableYearRangeDiv
	 * @param {boolean} enabled 타임시리얼 DIV 활성화 여부
	 * @desc 타임시리얼 DIV 활성화 여부
	 */
	dom.enableYearRangeDiv = function(enabled) {
		var dv = $('#dvYearRange');
		var autoBtn = $('#btnAutoYear');
		dv.rangeSlider({enabled:enabled});
		
		if(enabled) {
			autoBtn.removeAttr('disabled');
		}
		else {
			autoBtn.prop('disabled', true);
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showYearRangeDiv
	 * @param {number} mx 보여줄 최근연도
	 * @param {number} mn 보여줄 지난연도
	 * @desc 타임시리얼 bar DIV
	 * {@link http://ghusse.github.io/jQRangeSlider/documentation.html jQRangeSlider} 
	 */
	dom.showYearRangeDiv = function(mx, mn) {
		var max = 2017, min = 2011, i = 0, step = 1;
		var range = max - min - 1;
		var el = $('#dvYearRange');
		
		/*
		 * Auto
		 * */
		var runFn = hotplace.maps.showCellLayer;
		var callback = function() {
			i++;
			if(i<=range) {
				setTimeout(function() {
					el.rangeSlider('scrollRight', step);
				}, 2000);
			}
			else {
				i = 0;
				_yearRangeMode = 'manual';
				$('#btnAutoYear').bootstrapToggle('off');
				dom.removeBodyAllMask();
			}
		};
		
		el.rangeSlider({
			arrows: false,
			//enabled: false,
			bounds: {min: min, max: max},
			defaultValues: {min: max-1, max: max},
			step: 1,
			range:{min:1, max:1},
			formatter: function(val) {
				if(val == max) {
					val = '오늘'; 
				}
				else {
					val = (max - val) + '년전';
				}
				return val;
			}
		});
		
		el.on('userValuesChanged', function(e, data){
			_showCellYear = data.values.max;
			
			dom.addBodyAllMask();
			setTimeout(function() {
				if(_yearRangeMode == 'auto') {
					runFn(callback);
				}
				else {
					runFn();
					dom.removeBodyAllMask();
				}
			}, 100);
		});
		
		el.show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showAutoYearRangeDiv
	 * @param {number} mx 보여줄 최근연도
	 * @param {number} mn 보여줄 지난연도
	 * @desc 타임시리얼 자동재생 button DIV
	 */
	dom.showAutoYearRangeDiv = function() {
		
		var el = $('#dvAutoYearRange');
		
		$('#btnAutoYear').bootstrapToggle({
			size:'mini'
		});
		
		$('#btnAutoYear').on('change', function() {
			if($(this).prop('checked')) {
				_yearRangeMode = 'auto';
				$('#dvYearRange').rangeSlider('scrollLeft', 100);
			}
			else {
				_yearRangeMode == 'auto';
			}
		});
		
		el.show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function getShowCellYear
	 * @returns {number} 보이는 cell의 데이터 연도
	 * @desc 보이는 cell의 데이터 연도를 가져온다
	 */
	dom.getShowCellYear = function() {
		return _showCellYear;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideYearRangeDiv
	 * @desc 타임시리얼 bar DIV 를 감춘다.
	 */
	dom.hideYearRangeDiv = function() {
		var el = $('#dvYearRange');
		el.hide();
		el.rangeSlider('destroy');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function addBodyAllMask
	 * @desc body위에 사용자의 action을 차단할 목적으로 mask를 씌운다
	 */
	dom.addBodyAllMask = function() {
		$('#dimScreen').show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function removeBodyAllMask
	 * @desc body위에 사용자의 action을 차단할 목적의 mask를 제거한다
	 */
	dom.removeBodyAllMask = function() {
		$('#dimScreen').hide();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function loadScript
	 * @param {string} url - script 경로
	 * @param {function} loadFn - script onload handler
	 * @desc 스크립트를 동적으로 로딩한다
	 */
	dom.loadScript = function(url, loadFn) {
		var script = document.createElement('script');
		
		if(loadFn) 	script.onload = loadFn;
		script.src = hotplace.getContextUrl() + url;
		document.body.appendChild(script);
	}
	
}(
	hotplace.dom = hotplace.dom || {},
	jQuery
));


/**
 * @namespace hotplace.database
 */
(function(db, $) {
	
	var _db = {};
	
	/**
	 * @memberof hotplace.database
	 * @function getStartXIdx
	 * @param {string} dataType
	 * @param {number} boundswx 바운드의 극서값 
	 * @param {number} level 현재 화면 줌레벨
	 * @param {number} sIdx 극서로 정렬된 배열 pivot 시작값
	 * @param {number} eIdx 극서로 정렬된 배열 pivot 마지막값
	 * @desc 현재  margin이 적용된  화면의 시작점에서 시작할 데이터 index
	 */
	db.getStartXIdx = function(dataType, boundswx, level, sIdx, eIdx) {
		var result;
		var data = _db[level][dataType];
		sIdx = (sIdx == undefined) ? 0 : sIdx;
		eIdx = (eIdx == undefined) ? data.length - 1 : eIdx;
		
		var range = eIdx-sIdx;
		var cIdx = sIdx + Math.floor(range/2);
		var idxValue = data[cIdx].location[0];
		
		if(idxValue == boundswx) return cIdx;
		
		//5개 범위 안에 있으면 그만 찾고 시작점을 반환
		if(range < 5) return sIdx;
		
		//왼쪽에 있슴
		if(idxValue > boundswx) {
			result = db.getStartXIdx(dataType, boundswx, level, 0, cIdx);
		}
		else {//오른쪽에 있슴
			result = db.getStartXIdx(dataType, boundswx, level, cIdx, eIdx);
		}
		
		//console.log('result ==> ' + result);
		return result;
	}
	
	/**
	 * @memberof hotplace.database
	 * @function setLevelData
	 * @param {number} level
	 * @param {string} dataType
	 * @param {object} data 데이터값
	 * @desc 레벨의 dataType의 data를 저장한다
	 */
	db.setLevelData = function (level, dataType, data) {
		if(!_db[level]) _db[level] = {};
		_db[level][dataType] = data;
	}
	
	/**
	 * @memberof hotplace.database
	 * @function getLevelData
	 * @param {number} level
	 * @param {string} dataType
	 * @desc 레벨의 dataType의 data를 저장한다
	 */
	db.getLevelData = function(level, dataType) {
		 return (_db[level]) ? _db[level][dataType] : null;
	}
	
	/**
	 * @memberof hotplace.db
	 * @function hasData
	 * @param {number} level
	 * @param {string} dataType
	 * @returns {boolean} 해당 레벨에 데이터가 있는지 체크
	 * @desc 해당 레벨에 데이터가 있는지 체크
	 */
	db.hasData = function(level, dataType) {
		if(_db[level] && _db[level][dataType] && _db[level][dataType].length > 0) return true;
		return false;
	}
	
	
	/**
	 * @memberof hotplace.database
	 * @function initLevel
	 * @param {number} level
	 * @param {string} dataType
	 * @desc 레벨의 특정 데이터 타입 또는 전체 데이터를 지운다.
	 */
	db.initLevel = function(level, dataType) {
		if(dataType) {
			if(_db[level] && _db[level][dataType]) _db[level][dataType];
		}
		else {
			if(_db[level]) _db[level] = null;
		}
	}
}(
	hotplace.database = hotplace.database || {},
	jQuery
));

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


/**
 * @namespace hotplace.chart
 */
(function(chart, $){

	/**
	 * @private
	 * @type {object}
	 * @desc echart theme config
	 */
	 var _echartTheme = {
             color: [
                     '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                     '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
             ],   

             title: {
                     itemGap: 8,
                     textStyle: {
                             fontWeight: 'normal',
                             color: '#408829'
                     }    
             },   

             dataRange: {
                     color: ['#1f610a', '#97b58d']
             },   

             toolbox: {
                     color: ['#408829', '#408829', '#408829', '#408829']
             },   

             tooltip: {
                     backgroundColor: 'rgba(0,0,0,0.5)',
                     axisPointer: {
                             type: 'line',
                             lineStyle: {
                                     color: '#408829',
                                     type: 'dashed'
                             },   
                             crossStyle: {
                                     color: '#408829'
                             },   
                             shadowStyle: {
                                     color: 'rgba(200,200,200,0.3)'
                             } 
                     }
             },
             dataZoom: {
                 dataBackgroundColor: '#eee',
                 fillerColor: 'rgba(64,136,41,0.2)',
                 handleColor: '#408829'
	         },
	         grid: {
	                 borderWidth: 0
	         },

	         categoryAxis: {
	                 axisLine: {
	                         lineStyle: {
	                                 color: '#408829'
	                         }
	                 },
	                 splitLine: {
	                         lineStyle: {
	                                 color: ['#eee']
	                         }
	                 }
	         }, 
	         valueAxis: {
                 axisLine: {
                         lineStyle: {
                                 color: '#408829'
                         }
                 },
                 splitArea: {
                         show: true,
                         areaStyle: {
                                 color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                         }
                 },
                 splitLine: {
                         lineStyle: {
                                 color: ['#eee']
                         }
                 }
	         },
	         timeline: {
	                 lineStyle: {
	                         color: '#408829'
	                 },
	                 controlStyle: {
	                         normal: {color: '#408829'},
	                         emphasis: {color: '#408829'}
	                 }
	         },
	         k: {
                 itemStyle: {
                         normal: {
                                 color: '#68a54a',
                                 color0: '#a9cba2',
                                 lineStyle: {
                                         width: 1,
                                         color: '#408829',
                                         color0: '#86b379'
                                 }
                         }
                 }
	         },
	         map: {
	                 itemStyle: {
	                         normal: {
	                                 areaStyle: {
	                                         color: '#ddd'
	                                 },
	                                 label: {
	                                         textStyle: {
	                                                 color: '#c12e34'
	                                         }
	                                 }
	                         },
	                         emphasis: {
	                                 areaStyle: {
	                                         color: '#99d2dd'
	                                 },
	                                 label: {
	                                         textStyle: {
	                                                 color: '#c12e34'
	                                         }
	                                 }
	                         }
	                 }
	         },
	         force: {
                 itemStyle: {
                         normal: {
                                 linkStyle: {
                                         strokeColor: '#408829'
                                 }
                         }
                 }
	         },
	         chord: {
	                 padding: 4,
	                 itemStyle: {
	                         normal: {
	                                 lineStyle: {
	                                         width: 1,
	                                         color: 'rgba(128, 128, 128, 0.5)'
	                                 },
	                                 chordStyle: {
	                                         lineStyle: {
	                                                 width: 1,
	                                                 color: 'rgba(128, 128, 128, 0.5)'
	                                         }
	                                 }
	                         },
	                         emphasis: {
	                                 lineStyle: {
	                                         width: 1,
	                                         color: 'rgba(128, 128, 128, 0.5)'
	                                 },
	                                 chordStyle: {
	                                         lineStyle: {
	                                                 width: 1,
	                                                 color: 'rgba(128, 128, 128, 0.5)'
	                                         }
	                                 }
	                         }
	                 }
	         },
	         gauge: {
                 startAngle: 225,
                 endAngle: -45,
                 axisLine: {
                         show: true,
                         lineStyle: {
                                 color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                                 width: 8
                         }
                 },
                 axisTick: {
                         splitNumber: 10,
                         length: 12,
                         lineStyle: {
                                 color: 'auto'
                         }
                 },
                 axisLabel: {
                         textStyle: {
                                 color: 'auto'
                         }
                 },
                 splitLine: {
                         length: 18,
                         lineStyle: {
                                 color: 'auto'
                         }
                 },
                 pointer: {
                         length: '90%',
                         color: 'auto'
                 },
                 title: {
                         textStyle: {
                                 color: '#333'
                         }
                 },
                 detail: {
                         textStyle: {
                                 color: 'auto'
                         }
                 }
	         },
	         textStyle: {
                 fontFamily: 'Arial, Verdana, sans-serif'
	         }
	 };
	/**
	 * @memberof hotplace.chart
	 * @function showEchartBar
	 * @desc echart bar
	 * {@link https://ecomfe.github.io/echarts-doc/public/en/index.html echart}
	 */
	chart.showEchartBar = function() {
		if ($('#mainb').length){
			var echartBar = echarts.init(document.getElementById('mainb'), _echartTheme);

			echartBar.setOption({
				title: {
					text: 'Graph title',
					subtext: 'Graph Sub-text'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['sales', 'purchases']
				},
				toolbox: {
					show: false
				},
				calculable: false,
				xAxis: [{
					type: 'category',
					data: ['1?', '2?', '3?', '4?', '5?', '6?', '7?', '8?', '9?', '10?', '11?', '12?']
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'sales',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
					markPoint: {
						data: [{
							type: 'max',
							name: '???'
						}, {
							type: 'min',
							name: '???'
						}]
					},
					markLine: {
						data: [{
							type: 'average',
							name: '???'
						}]
					}
				}, {
					name: 'purchases',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
					markPoint: {
						data: [{
							name: 'sales',
							value: 182.2,
							xAxis: 7,
							yAxis: 183,
						}, {
							name: 'purchases',
							value: 2.3,
							xAxis: 11,
							yAxis: 3
						}]
					},
					markLine: {
						data: [{
							type: 'average',
							name: '???'
						}]
					}
				}]
			});
		}
	};
	
	/**
	 * @memberof hotplace.chart
	 * @function showEchartScatter
	 * @desc echart scatter
	 * {@link https://ecomfe.github.io/echarts-doc/public/en/index.html echart}
	 */
	chart.showEchartScatter = function() {
		if ($('#echart_scatter').length ){ 
			var echartScatter = echarts.init(document.getElementById('echart_scatter'), _echartTheme);

			echartScatter.setOption({
				title: {
					text: 'Scatter Graph',
					subtext: 'Heinz  2003'
				},
				tooltip: {
					trigger: 'axis',
					showDelay: 0,
					axisPointer: {
						type: 'cross',
						lineStyle: {
							type: 'dashed',
							width: 1
						}
					}
				},
				legend: {
				  data: ['Data2', 'Data1']
				},
				toolbox: {
					show: true,
					feature: {
						saveAsImage: {
							show: true,
							title: "Save Image"
						}
					}
				},
				xAxis: [{
					type: 'value',
					scale: true,
					axisLabel: {
						formatter: '{value} cm'
					}
				}],
				yAxis: [{
					type: 'value',
					scale: true,
					axisLabel: {
						formatter: '{value} kg'
					}
				}],
				series: [{
					name: 'Data1',
					type: 'scatter',
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							if (params.value.length > 1) {
								return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
							}
							else {
								return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
							}
						}
					},
					data: [
					       [161.2, 51.6], [167.5, 59.0], [159.5, 49.2],	[157.0, 63.0], [155.8, 53.6], [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
					       [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0], [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
					       [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0], 
					       [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8], [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
					       [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3], [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
					       [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3], [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
					       [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0], [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
					       [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5], [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
					       [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8], [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
					       [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2], [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
					       [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4], [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
					       [166.8, 56.6], [172.7, 105.2],[163.5, 51.8],	[169.4, 63.4], [167.8, 59.0], [159.5, 47.6], [167.6, 63.0],	[161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
					       [162.2, 50.2], [161.3, 60.2], [149.5, 44.8],	[157.5, 58.8], [163.2, 56.4], [172.7, 62.0], [155.0, 49.2],	[156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
					       [162.8, 58.0], [167.0, 59.8], [160.0, 54.8],	[160.0, 43.2], [168.9, 60.5], [158.2, 46.4], [156.0, 64.4],	[160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
					       [167.6, 57.8], [156.0, 54.6], [162.1, 59.2],	[173.4, 52.7], [159.8, 53.2], [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
					       [160.0, 59.5], [168.9, 56.8], [165.1, 64.1],	[162.6, 50.0], [165.1, 72.3], [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
					       [170.2, 55.9], [158.8, 55.5], [172.7, 69.5],	[167.6, 76.4], [162.6, 61.4], [167.6, 65.9], [156.2, 58.6],	[175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
					       [160.0, 55.9], [165.1, 59.1], [182.9, 81.8],	[166.4, 70.7], [165.1, 56.8], [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
					       [172.7, 75.9], [168.9, 55.0], [161.3, 57.3],	[167.6, 55.0], [165.1, 65.5], [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
					       [165.1, 62.7], [168.9, 56.6], [162.6, 53.9],	[164.5, 63.2], [176.5, 73.6], [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
					       [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0], [157.5, 63.6], [162.6, 54.5],	[152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
					       [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1], [161.3, 70.5], [167.6, 52.7],	[167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
					       [152.4, 67.3], [168.9, 63.0], [170.2, 73.6],	[175.2, 62.3], [175.2, 57.7], [160.0, 55.4], [165.1, 104.1],[174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
					       [167.6, 64.5], [167.6, 72.3], [167.6, 61.4],	[154.9, 58.2], [162.6, 81.8], [175.3, 63.6], [171.4, 53.4],	[157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
					       [174.0, 73.6], [162.6, 61.4], [174.0, 55.5],	[162.6, 63.6], [161.3, 60.9], [156.2, 60.0], [149.9, 46.8],	[169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
					       [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8], [176.5, 71.8], [164.4, 55.5],	[160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
				    ],
				    markPoint: {
				    	data: [{
				    		type: 'max',
				    		name: 'Max'
				    	}, {
				    		type: 'min',
				    		name: 'Min'
				    	}]
				    },
				    markLine: {
				    	data: [{
				    		type: 'average',
				    		name: 'Mean'
				    	}]
				   }
				}, {
					name: 'Data2',
					type: 'scatter',
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							if(params.value.length > 1) {
								return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
							}
							else {
								return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
							}
						}
					},
					data: [
					       [174.0, 65.6], [175.3, 71.8], [193.5, 80.7],[186.5, 72.6],[187.2, 78.8], [181.5, 74.8],[184.0, 86.4],[184.5, 78.4],[175.0, 62.0], [184.0, 81.6],
					       [180.0, 76.6], [177.8, 83.6], [192.0, 90.0],[176.0, 74.6],[174.0, 71.0], [184.0, 79.6],[192.7, 93.8],[171.5, 70.0],[173.0, 72.4], [176.0, 85.9],
					       [176.0, 78.8], [180.5, 77.8], [172.7, 66.2],[176.0, 86.4],[173.5, 81.8], [178.0, 89.6],[180.3, 82.8],[180.3, 76.4],[164.5, 63.2], [173.0, 60.9],
					       [183.5, 74.8], [175.5, 70.0], [188.0, 72.4],[189.2, 84.1],[172.8, 69.1], [170.0, 59.5],[182.0, 67.2],[170.0, 61.3],[177.8, 68.6], [184.2, 80.1],
					       [186.7, 87.8], [171.4, 84.7], [172.7, 73.4],[175.3, 72.1],[180.3, 82.6], [182.9, 88.7],[188.0, 84.1],[177.2, 94.1],[172.1, 74.9], [167.0, 59.1],
					       [169.5, 75.6], [174.0, 86.2], [172.7, 75.3],[182.2, 87.1],[164.1, 55.2], [163.0, 57.0],[171.5, 61.4],[184.2, 76.8],[174.0, 86.8], [174.0, 72.2],
					       [177.0, 71.6], [186.0, 84.8], [167.0, 68.2],[171.8, 66.1],[182.0, 72.0], [167.0, 64.6],[177.8, 74.8],[164.5, 70.0],[192.0, 101.6],[175.5, 63.2],
					       [171.2, 79.1], [181.6, 78.9], [167.4, 67.7],[181.1, 66.0],[177.0, 68.2], [174.5, 63.9],[177.5, 72.0],[170.5, 56.8],[182.4, 74.5], [197.1, 90.9],
					       [180.1, 93.0], [175.5, 80.9], [180.6, 72.7],[184.4, 68.0],[175.5, 70.9], [180.6, 72.5],[177.0, 72.5],[177.1, 83.4],[181.6, 75.5], [176.5, 73.0],
					       [175.0, 70.2], [174.0, 73.4], [165.1, 70.5],[177.0, 68.9],[192.0, 102.3],[176.5, 68.4],[169.4, 65.9],[182.1, 75.7],[179.8, 84.5], [175.3, 87.7],
					       [184.9, 86.4], [177.3, 73.2], [167.4, 53.9],[178.1, 72.0],[168.9, 55.5], [157.2, 58.4],[180.3, 83.2],[170.2, 72.7],[177.8, 64.1], [172.7, 72.3],
					       [165.1, 65.0], [186.7, 86.4], [165.1, 65.0],[174.0, 88.6],[175.3, 84.1], [185.4, 66.8],[177.8, 75.5],[180.3, 93.2],[180.3, 82.7], [177.8, 58.0],
					       [177.8, 79.5], [177.8, 78.6], [177.8, 71.8],[177.8, 116.4],[163.8, 72.2],[188.0, 83.6],[198.1, 85.5],[175.3, 90.9],[166.4, 85.9], [190.5, 89.1],
					       [166.4, 75.0], [177.8, 77.7], [179.7, 86.4],[172.7, 90.9],[190.5, 73.6], [185.4, 76.4],[168.9, 69.1],[167.6, 84.5],[175.3, 64.5], [170.2, 69.1],
					       [190.5, 108.6],[177.8, 86.4], [190.5, 80.9],[177.8, 87.7],[184.2, 94.5], [176.5, 80.2],[177.8, 72.0],[180.3, 71.4],[171.4, 72.7], [172.7, 84.1],
					       [172.7, 76.8], [177.8, 63.6], [177.8, 80.9],[182.9, 80.9],[170.2, 85.5], [167.6, 68.6],[175.3, 67.7],[165.1, 66.4],[185.4, 102.3],[181.6, 70.5],
					       [172.7, 95.9], [190.5, 84.1], [179.1, 87.3],[175.3, 71.8],[170.2, 65.9], [193.0, 95.9],[171.4, 91.4],[177.8, 81.8],[177.8, 96.8], [167.6, 69.1],
					       [167.6, 82.7], [180.3, 75.5], [182.9, 79.5],[176.5, 73.6],[186.7, 91.8], [188.0, 84.1],[188.0, 85.9],[177.8, 81.8],[174.0, 82.5], [177.8, 80.5],
					       [171.4, 70.0], [185.4, 81.8], [185.4, 84.1],[188.0, 90.5],[188.0, 91.4], [182.9, 89.1],[176.5, 85.0],[175.3, 69.1],[175.3, 73.6], [188.0, 80.5],
					       [188.0, 82.7], [175.3, 86.4], [170.5, 67.7],[179.1, 92.7],[177.8, 93.6], [175.3, 70.9],[182.9, 75.0],[170.8, 93.2],[188.0, 93.2], [180.3, 77.7],
					       [177.8, 61.4], [185.4, 94.1], [168.9, 75.0],[185.4, 83.6],[180.3, 85.5], [174.0, 73.9],[167.6, 66.8],[182.9, 87.3],[160.0, 72.3], [180.3, 88.6],
					       [167.6, 75.5], [186.7, 101.4],[175.3, 91.1],[175.3, 67.3],[175.9, 77.7], [175.3, 81.8],[179.1, 75.5],[181.6, 84.5],[177.8, 76.6], [182.9, 85.0],
					       [177.8, 102.5],[184.2, 77.3], [179.1, 71.8],[176.5, 87.9],[188.0, 94.3], [174.0, 70.9],[167.6, 64.5],[170.2, 77.3],[167.6, 72.3], [188.0, 87.3],
					       [174.0, 80.0], [176.5, 82.3], [180.3, 73.6],[167.6, 74.1],[188.0, 85.9], [180.3, 73.2],[167.6, 76.3],[183.0, 65.9],[183.0, 90.9], [179.1, 89.1],
					       [170.2, 62.3], [177.8, 82.7], [179.1, 79.1],[190.5, 98.2],[177.8, 84.1], [180.3, 83.2],[180.3, 83.2]
				    ],
				    markPoint: {
				    	data: [{
				    		type: 'max',
				    		name: 'Max'
				    	}, {
				    		type: 'min',
				    		name: 'Min'
				    	}]
				    },
				    markLine: {
				    	data: [{
				    		type: 'average',
				    		name: 'Mean'
				    	}]
				    }
				}]
			});
		} 
	};
	
	/**
	 * @memberof hotplace.chart
	 * @function showEchartPie
	 * @desc echart pie
	 * {@link https://ecomfe.github.io/echarts-doc/public/en/index.html echart}
	 */
	chart.showEchartPie = function _echartPie() {
		if ($('#echart_mini_pie').length ){ 
			var dataStyle = {
				normal: {
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			};
			
			var placeHolderStyle = {
				normal: {
					color: 'rgba(0,0,0,0)',
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				},
				emphasis: {
					color: 'rgba(0,0,0,0)'
				}
			};

			var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie'), _echartTheme);

			echartMiniPie .setOption({
				title: {
					text: 'Chart #2',
					subtext: 'From ExcelHome',
					sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
					x: 'center',
					y: 'center',
					itemGap: 20,
					textStyle: {
						color: 'rgba(30,144,255,0.8)',
						fontFamily: '微软雅黑',
						fontSize: 35,
						fontWeight: 'bolder'
					}
				},
				tooltip: {
					show: true,
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					x: 170,
					y: 45,
					itemGap: 12,
					data: ['68%Something #1', '29%Something #2', '3%Something #3'],
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: true
						},
						dataView: {
							show: true,
							title: "Text View",
							lang: ["Text View",	"Close", "Refresh"],
							readOnly: false
						},
						restore: {
							show: true,
							title: "Restore"
						},
						saveAsImage: {
							show: true,
							title: "Save Image"
						}
					}
				},
				series: [{
					name: '1',
					type: 'pie',
					clockWise: false,
					radius: [105, 130],
					itemStyle: dataStyle,
					data: [{
						value: 68,
						name: '68%Something #1'
					}, {
						value: 32,
						name: 'invisible',
						itemStyle: placeHolderStyle
					}]
				}, {
					name: '2',
					type: 'pie',
					clockWise: false,
					radius: [80, 105],
					itemStyle: dataStyle,
					data: [{
						value: 29,
						name: '29%Something #2'
					}, {
						value: 71,
						name: 'invisible',
						itemStyle: placeHolderStyle
					}]
				}, {
					name: '3',
					type: 'pie',
					clockWise: false,
					radius: [25, 80],
					itemStyle: dataStyle,
					data: [{
						value: 3,
						name: '3%Something #3'
					}, {
						value: 97,
						name: 'invisible',
						itemStyle: placeHolderStyle
					}]
				}]
			});
		} 
	};
	
	/**
	 * @memberof hotplace.chart
	 * @function showEchartLine
	 * @desc echart line
	 * {@link https://ecomfe.github.io/echarts-doc/public/en/index.html echart}
	 */
	chart.showEchartLine = function _echartLine() {
		if ($('#echart_line').length ){ 
			var echartLine = echarts.init(document.getElementById('echart_line'), _echartTheme);

			echartLine.setOption({
				title: {
					text: 'Line Graph',
					subtext: 'Subtitle'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					x: 220,
					y: 40,
					data: ['Intent', 'Pre-order', 'Deal']
				},
				toolbox: {
					show: true,
					feature: {
						magicType: {
							show: true,
							title: {
								line: 'Line',
								bar: 'Bar',
								stack: 'Stack',
								tiled: 'Tiled'
							},
							type: ['line', 'bar', 'stack', 'tiled']
						},
						restore: {
							show: true,
							title: "Restore"
						},
						saveAsImage: {
							show: true,
							title: "Save Image"
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'Deal',
					type: 'line',
					smooth: true,
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default'
							}
						}
					},
					data: [10, 12, 21, 54, 260, 830, 710]
				}, {
					name: 'Pre-order',
					type: 'line',
					smooth: true,
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default'
							}
						}
					},
					data: [30, 182, 434, 791, 390, 30, 10]
				}, {
					name: 'Intent',
					type: 'line',
					smooth: true,
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default'
							}
						}
					},
					data: [1320, 1132, 601, 234, 120, 90, 20]
				}]
			});
		} 
	};        
}(
	hotplace.chart = hotplace.chart || {},
	jQuery
));


/**
 * @namespace hotplace.test
 * */
(function(test, $) {
	/*
	 *  테스트 용도
	 * */
	/**************************************************************************************************/
	var _testMarker = {};
	
	
	test.showMarker = function() {
		var vender = hotplace.maps.getVender();
		var venderMap = hotplace.maps.getVenderMap();
		var level = hotplace.maps.getCurrentLevel();
		var datas = hotplace.database.getLevelData(level);

		console.log(datas);
		if(datas == null) return;
		
		if(!_testMarker[level]) _testMarker[level] = []; 
		if(_testMarker[level].length == 0) {
			for(var i=0; i<datas.length; i++) {
				_testMarker[level].push(new vender.Marker({
				    position: new vender.LatLng(datas[i].location[1], datas[i].location[0]),
				    map: venderMap
				}));
			}
		}
		else {
			$.each(_testMarker[level], function(idx, value) {
				value.setMap(venderMap);
			});
		}
	}
	
	test.hideMarker = function() {
		var level = hotplace.maps.getCurrentLevel();
		if(!_testMarker[level]) return;
		
		$.each(_testMarker[level], function(idx, value) {
			value.setMap(null);
		});
	}
	
	test.initMarker = function(level) {
		test.hideMarker();
		_testMarker[level] = [];
	}
	
	/*test.initMarkerButton = function(selector) {
		selector = selector || '#btnTest';
		
		var sw = $(selector).data('switch');
		if(sw == 'on') {
			$(selector).trigger('change');
		}
		
	}*/
	
	/**
	 * @memberof hotplace.test
	 * @function searchRadius
	 * @desc 반경검색 테스트 실행
	 */
	test.searchRadius = function() {
		hotplace.maps.panToBounds(37.539648921, 127.152615967, function() {
			hotplace.maps.getMarker(hotplace.maps.MarkerTypes.RADIUS_SEARCH,{location:[127.152615967, 37.539648921]}, {
				'click' : function(map, newMarker, newInfoWindow) {
					 if(newInfoWindow.getMap()) {
						 newInfoWindow.close();
				     }
					 else {
						 newInfoWindow.open(map, newMarker);
				     }
				}
			}, {
				hasInfoWindow: true,
				isAjaxContent: false,
				infoWinFormName: 'pinpointForm',
				radius: 500,
				datas: {
					params : $.extend({address:'서울특별시 강동구 길동  15-1'}, {defaultValue:hotplace.calc.profit.defaultValue}, {
						jimok: '전',
						valPerPyeung:21000000,
						area: 132,
						gongsi: 4040000,
						limitChange:'Y'
					})
				},
				//icon:'test.gif'
				
			});
		});
	}
	
	test.marker = function() {
		hotplace.maps.panToBounds(37.539648921, 127.152615967, function() {
			hotplace.maps.showMarkers();
		});
	}
	
}(
	hotplace.test = hotplace.test || {},
	jQuery
));

/**
 * @namespace hotplace.calc
 */
(function(calc, $) {
	/**
	 * @memberof hotplace.calc
	 * @name profit
	 * @type {object} 
	 * @property {object} defaultValue
	 * @property {string} defaultValue.own - 매입(보유)주체 ('gaein' | 'beobin')
	 * @property {number} defaultValue.ownTerm - 보유기간 (0 - 10년)
	 * @property {number} defaultValue.otherAssetRatio - 타인자본비율(0 - 100%)   
	 * 
	 * @property {function} initCalc 				로딩시 기본적으로 수행하는 연산 초기화
	 * @property {function} calcOwnTerm				보유기간 연산함수  
	 * @property {function} calcPurchase 			매입금액 연산함수
	 * @property {function} calcMyeongdobi 			명도비 연산함수
	 * @property {function} calcAcceptLandUse 		토지사용승낙 연산함수
	 * @property {function} calcDaechulIja 			대출이자 연산함수
	 * @property {function} calcChwideugse 			취득세 연산함수
	 * @property {function} calcJaesanse 			재산세 연산함수
	 * @property {function} calcYangdose 			양도세 연산함수
	 * @property {function} calcGeonchugGongsa		건축공사비 연산함수  
	 * @property {function} calcTomogGongsa			토목공사비 연산함수
	 * @property {function} calcPojangGongsa		포장공사비 연산함수
	 * @property {function} calcInibGongsa  		인입공사비 연산함수
	 * @property {function} calcAcceptGaebal  		개발행위허가 연산함수
	 * @property {function} calcGamri  		    	감리비 연산함수
	 * @property {function} calcCheuglyang	    	측량비 연산함수
	 * @property {function} calcEvalueGamjeung  	감정평가비 연산함수
	 * @property {function} calcSplitPilji      	필지분할비 연산함수
	 * @property {function} calcDevBudam			개발부담금 연산함수
	 * @property {function} calcFarmBudam  			농지보전부담금 연산함수
	 * @property {function} calcAlterSanrim  		대체산림자원조성비 연산함수
	 * @property {function} calcPurchaseChaegwon	채권매입비 연산함수
	 * @property {function} calcSetGeunjeodang      근저당설정비 연산함수
	 * @property {function} calcPreserveDeunggi     보존등기비 연산함수
	 * @property {function} calcManagement          운영비 연산함수
	 * @property {function} calcSellSusulyo         매각수수료 연산함수
	 * @property {function} calcPreparation         예비비 연산함수
	 * @property {function} calcIncomeSellBuilding  수입>매각>건물 연산함수
	 * @property {function} calcIncomeSellSeolbi    수입>매각>설비 연산함수
	 * @property {function} calcIncomeSellLand  	수입>매각>토지 연산함수
	 * @property {function} calcIncomeManageImdae	수입>운영>임대 연산함수
	 */
	calc.profit = function() {
		/**
		 * @private
		 * @property {object} defaultValue 
		 * @property {string} own - 매입(보유)주체 ('gaein' | 'beobin')
		 * @property {number} ownTerm - 보유기간 (0 - 10년)
		 * @property {number} otherAssetRatio - 타인자본비율(0 - 100%)    
		 */
		var defaultValue = {
			own: 'gaein',
			ownTerm:2,
			otherAssetRatio:70,
			myeongdobi:0,
			acceptLandUse:0,
			daechulIja:5.0,
			chwideugse:4.6,
			jaesanse:0.07,
		}
		
		/**
		 * @private
		 * @function onChangeOwn
		 * @desc 매입(보유)주체 event
		 */
		function onBindOwn() {
			$(document).on('click', 'input[type="radio"][name="radioOwn"]', function(e) {
				own = $(this).val();
			});
		}
		
		var data = null;
		var moneyUnit = 1;
		/**
		 * @private 
		 * @function initCalc
		 * @desc 로딩시 기본적으로 수행하는 연산 초기화
		 */
		function initCalc(params) {
			/*data = params;
			var $txtPurchase = $('#txtPurchase');
			var area = $txtPurchase.data('value');
			//var pyeung = Math.round(area * 0.3025);
			var val = (pyeung * data.valPerPyeung)/moneyUnit;
			$txtPurchase.val(pyeung + '㎡');
			$txtPurchase.data('value', pyeung);*/
			
			calc.profit.calcPurchase();
			calc.profit.calcYangdose(true);
			calc.profit.calcGeonchugGongsa(true);
			calc.profit.calcTomogGongsa(true);
			calc.profit.calcPojangGongsa(true);
			calc.profit.calcInibGongsa(true);
		}
		
		/**
		 * @private 
		 * @function makeStep
		 * @returns {number} 입력값의 백분율 값
		 * @desc 입력값의 백분율 값으로 spinner의 step값을 설정
		 */
		function makeStep(value, percent) {
			value = value.toString();
			var len = value.length;
			var s = value.slice(0,1);
			
			for(var i=0; i<len-1; i++) {
				s += '0';
			}
			
			return Math.round(parseInt(s) * 0.01 * percent);
		}
		
		/**
		 * @private 
		 * @function calcJichoolRatio
		 * @desc 비율
		 */
		function calcJichoolRatio(sum) {
			//매입금액 비율
			$('#ratioPurchase').text((parseFloat($('#WPurchase').data('value'))/sum) * 100);
			//명도비 비율
			$('#ratioMyeongdobi').text((parseFloat($('#WMyeongdobi').data('value'))/sum) * 100);
			//토지사용승낙 비율
			$('#ratioAcceptLandUse').text((parseFloat($('#WAcceptLandUse').data('value'))/sum) * 100);
			//토지비 비율
			$('#ratioTojibi').text((parseFloat($('#WTojibi').data('value'))/sum) * 100);
			//대출이자
			$('#ratioDaechulIja').text((parseFloat($('#WDaechulIja').data('value'))/sum) * 100);
			//취득세
			$('#ratioChwideugse').text((parseFloat($('#WChwideugse').data('value'))/sum) * 100);
		}
		
		/**
		 * @private 
		 * @function calcTojibi
		 * @desc 토지비 (매입금액, 명도비, 토지사용승낙)
		 */
		function calcTojibi(changedEl) {
			console.log('토지비 (매입금액, 명도비, 토지사용승낙)');
			
			var $$1 = $('#WPurchase').data('value');
			var $$2 = $('#WMyeongdobi').data('value');
			var $$3 = $('#WAcceptLandUse').data('value');
			var $$r = parseFloat($$1) + parseFloat($$2) + parseFloat($$3);
			
			var $WTojibi = $('#WTojibi');
			$WTojibi.data('value', $$r)
			$WTojibi.val($$r.toString().money());
			calcJichool();
		}
		

		
		/**
		 * @private 
		 * @function calcJesegeum
		 * @desc 제세금 (취득세,재산세,양도세)
		 */
		function calcJesegeum() {
			console.log('제세금 (취득세,재산세,양도세)');
			
			var $$1 = $('#WChwideugse').data('value');
			var $$2 = $('#WJaesanse').data('value');
			var $$2_1 = $('#WJaesanse2').data('value');
			var $$3 = $('#WYangdose').data('value');
			var $$r = parseFloat($$1) + parseFloat($$2) + parseFloat($$2_1) + parseFloat($$3);
			
			var $WJesegeum = $('#WJesegeum');
			$WJesegeum.data('value', $$r)
			$WJesegeum.val($$r.toString().money());
			
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcGongsabi
		 * @desc 공사비 (건축공사비, 토목공사비, 포장공사비, 인입공사비)
		 */
		function calcGongsabi() {
			console.log('공사비 (건축공사비, 토목공사비, 포장공사비, 인입공사비)');
			
			var $$1 = $('#WGeonchugGongsa').data('value');
			var $$2 = $('#WTomogGongsa').data('value');
			var $$3 = $('#WPojangGongsa').data('value');
			var $$4 = $('#WInibGongsa').data('value');
			
			var $$r = $$1 + $$2 + $$3 + $$4;
			
			var $WGongsabi = $('#WGongsabi');
			$WGongsabi.data('value', $$r);
			$WGongsabi.val($$r.toString().money());
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcInheogabi
		 * @desc 인허가비 (개발행위, 감리비, 측량비, 감정평가, 필지분할)
		 */
		function calcInheogabi() {
			console.log('인허가비 (개발행위, 감리비, 측량비, 감정평가, 필지분할)');
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcBudamgeum
		 * @desc 부담금 (개발부담금, 농지보전부담금, 대체산림자원조성비)
		 */
		function calcBudamgeum() {
			console.log('부담금 (개발부담금, 농지보전부담금, 대체산림자원조성비)');
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcSaeobgyeongbi
		 * @desc 사업경비(채권매입비, 근저당설정비, 보존등기비, 운영비, 매각수수료, 예비비)
		 */
		function calcSaeobgyeongbi() {
			console.log('사업경비(채권매입비, 근저당설정비, 보존등기비, 운영비, 매각수수료, 예비비)');
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcJichool
		 * @desc 지출합계(토지비, 제세금, 공사비, 인허가비, 부담금, 사업경비)
		 */
		function calcJichool() {
			console.log('지출합계(토지비, 금융비용, 제세금, 공사비, 인허가비, 부담금, 사업경비)');
			
			//토지비
			var WTojibi = $('#WTojibi').data('value');
			//대출이자
			var WDaechulIja = $('#WDaechulIja').data('value');
			//제세금
			var WJesegeum = $('#WJesegeum').data('value');
			//공사비
			var WGongsabi = $('#WGongsabi').data('value');
			//인허가비
			var WInheogabi = $('#WInheogabi').data('value');
			//부담금
			var WBudamgeum = $('#WBudamgeum').data('value');
			//사업경비
			var WSaeobgyeongbi = $('#WSaeobgyeongbi').data('value');
			
			var $WJichool = $('#WJichool');
			var $$r = parseFloat(WTojibi) + parseFloat(WDaechulIja) + parseFloat(WJesegeum) + 
					  parseFloat(WGongsabi) + parseFloat(WInheogabi) + parseFloat(WBudamgeum) + parseFloat(WSaeobgyeongbi);
			
			$WJichool.data('value', $$r);
			$WJichool.val($$r.toString().money());
			
			calcJichoolRatio($$r);
			calcMaechool();
		}
		
		/**
		 * @private 
		 * @function calcIncomeSell
		 * @desc 수입>매각(건물,설비,토지)
		 */
		function calcIncomeSell() {
			console.log('수입>매각(건물,설비,토지)');
			calcIncome();
		}
		
		/**
		 * @private 
		 * @function calcIncomeManage
		 * @desc 수입>운영(임대)
		 */
		function calcIncomeManage() {
			console.log('수입>운영(임대)');
			calcIncome();
		}
		
		/**
		 * @private 
		 * @function calcIncome
		 * @desc 수입합계
		 */
		function calcIncome() {
			console.log('수입합계');
			calcMaechool();
		}
		
		/**
		 * @private 
		 * @function calcMymoney
		 * @desc 자기자본 총액 (매입금액 + 명도비 + 토지사용승낙 + 취득세 + 공사비 + 개발행위허가 + 부담금 + 
		 *          		채권매입비 + 근저당설정비 + 보존등기비)
		 */
		function calcMymoney() {
			console.log('자기자본 총액');
			//매입금액의 30%
			var purchase30 = parseFloat($('#WPurchase').data('value') || 0) * 0.3;
			//명도비
			var myeongdobi = parseFloat($('#WMyeongdobi').data('value') || 0);
			//토지사용승낙
			var acceptLandUse = parseFloat($('#WAcceptLandUse').data('value') || 0);
			//취득세
			var chwideugse = parseFloat($('#WChwideugse').data('value') || 0);
			//건축공사비
			var geonchugGongsa = parseFloat($('#WGeonchugGongsa').data('value') || 0);
			//토목공사비
			var tomogGongsa = parseFloat($('#WTomogGongsa').data('value') || 0);
			//포장공사비
			var pojangGongsa = parseFloat($('#WPojangGongsa').data('value') || 0);
			//인입공사비
			var inibGongsa = parseFloat($('#WInibGongsa').data('value') || 0);
			//개발행위허가
			var acceptGaebal = parseFloat($('#WAcceptGaebal').data('value') || 0);
			//개발부담금
			var devBudam = parseFloat($('#WDevBudam').data('value') || 0);
			//농지보전부담금
			var farmBudam = parseFloat($('#WFarmBudam').data('value') || 0);
			//대체산림자원조성비
			var alterSanrim = parseFloat($('#WAlterSanrim').data('value') || 0);
			//채권매입비
			var purchaseChaegwon = parseFloat($('#WPurchaseChaegwon').data('value') || 0);
			//근저당설정비
			var setGeunjeodang = parseFloat($('#WSetGeunjeodang').data('value') || 0);
			//보존등기비
			var preserveDeunggi = parseFloat($('#WPreserveDeunggi').data('value') || 0);
			
			var sum = 0;
				sum += purchase30  + myeongdobi   + acceptLandUse;
			    sum += chwideugse;
			    sum += geonchugGongsa + tomogGongsa + pojangGongsa + inibGongsa;
			    sum += acceptGaebal;
			    sum += devBudam + farmBudam + alterSanrim;
			    sum += purchaseChaegwon + setGeunjeodang + preserveDeunggi;
			sum = Math.round(sum) + '';
			    
			$('#WMymoney').val(sum.money());
		}
		
		/**
		 * @private 
		 * @function calcMaechool
		 * @desc 매출이익 (수입-지출)
		 */
		function calcMaechool() {
			console.log('매출이익 (수입-지출)');
		}
		
		return {
			init: function() {
				onBindOwn();
			},
			initCalc: initCalc,
			makeStep: makeStep,
			defaultValue: defaultValue,
			calcOwnTerm: function() {
				hotplace.calc.profit.calcJaesanse(true);
				hotplace.calc.profit.calcJaesanse2(true);
				hotplace.calc.profit.calcYangdose();
			},
			calcOtherAssetRatio: function() {
				console.log('타인자본비율');
				hotplace.calc.profit.calcDaechulIja(true);
			},
			calcPurchase: function(initFn) {
				console.log('매입금액');
				//if(initFn) initFn();
				
				var $$1 = $('#txtPurchase').data('value');
				var $$2 = $('#stepPurchase').data('value');
				var $$r = parseFloat($$1) * parseFloat($$2);
				
				var $WPurchase = $('#WPurchase');
				$WPurchase.data('value', $$r);
				$WPurchase.val($$r.toString().money());
				
				//명도비 : 매입금액 * 비율
				hotplace.calc.profit.calcMyeongdobi(true);
				//토지승낙비 : 매입금액 * 비율
				hotplace.calc.profit.calcAcceptLandUse(true);
				//대출이자 : 매입가 * 타인자본비율
				hotplace.calc.profit.calcDaechulIja(true);
				//취득세 : 매입가 * 비율
				hotplace.calc.profit.calcChwideugse(true);
				//재산세
				hotplace.calc.profit.calcJaesanse(true);
				
				calcMymoney();//자기자본
				calcTojibi();
			},
			calcMyeongdobi: function(isSet) {
				console.log('명도비');
				
				var $txtMyeongdobi = $('#txtMyeongdobi');
				
				if(isSet) {
					var WPurchase = $('#WPurchase').data('value');
					$txtMyeongdobi.data('value', WPurchase);
					$txtMyeongdobi.val(WPurchase.toString().money());
				}
				
				var $stepMyeongdobi = $('#stepMyeongdobi');
				
				var $$1 = $txtMyeongdobi.data('value');
				var $$2 = $stepMyeongdobi.data('value');
				var $$r = parseFloat($$1) * (0.01 * parseFloat($$2));
				
				var $WMyeongdobi = $('#WMyeongdobi');
				$WMyeongdobi.data('value', $$r);
				$WMyeongdobi.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcTojibi();
			},
			calcAcceptLandUse: function(isSet) {
				console.log('토지사용승낙');
				
				var $txtAcceptLandUse = $('#txtAcceptLandUse');
				
				if(isSet) {
					var WPurchase = $('#WPurchase').data('value');
					$txtAcceptLandUse.data('value', WPurchase);
					$txtAcceptLandUse.val(WPurchase.toString().money());
				}
				
				var $stepAcceptLandUse = $('#stepAcceptLandUse');
				
				var $$1 = $txtAcceptLandUse.data('value');
				var $$2 = $stepAcceptLandUse.data('value');
				var $$r = parseFloat($$1) * (0.01 * parseFloat($$2));
				
				var $WAcceptLandUse = $('#WAcceptLandUse');
				$WAcceptLandUse.data('value', $$r);
				$WAcceptLandUse.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcTojibi();
			},
			calcDaechulIja: function(isSet) {
				console.log('대출이자(매입가 X 타인자본 비율)');
				
				var $txtDaechulIja = $('#txtDaechulIja');
				
				if(isSet) {
					//매입가
					var _$$1 = $('#WPurchase').data('value');
					var _$$2 = $('#stepOtherAssetRatio').data('value');
					var _$$r = parseFloat(_$$1) * (0.01 * parseFloat(_$$2));
					
					$txtDaechulIja.data('value', _$$r);
					$txtDaechulIja.val(_$$r.toString().money());
				}
				
				var $stepDaechulIja = $('#stepDaechulIja');
				
				var $$1 = $txtDaechulIja.data('value');
				var $$2 = $stepDaechulIja.data('value');
				var $$r = Math.round(parseFloat($$1) * (0.01 * parseFloat($$2)));
				
				var $WDaechulIja = $('#WDaechulIja');
				$WDaechulIja.data('value', $$r);
				$WDaechulIja.val($$r.toString().money());
				calcJichool();
			},
			calcChwideugse: function(isSet) {
				console.log('취득세(매입가 X 비율)');
				
				var $txtChwideugse = $('#txtChwideugse');
				
				if(isSet) {
					var WPurchase = $('#WPurchase').data('value');
					$txtChwideugse.data('value', WPurchase);
					$txtChwideugse.val(WPurchase.toString().money());
				}
				
				var $stepChwideugse = $('#stepChwideugse');
				
				var $$1 = $txtChwideugse.data('value');
				var $$2 = $stepChwideugse.data('value');
				var $$r = parseFloat($$1) * (0.01 * parseFloat($$2));
				
				var $WChwideugse = $('#WChwideugse');
				$WChwideugse.data('value', $$r);
				$WChwideugse.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcJesegeum();
			},
			calcJaesanse: function(isSet) {
				console.log('재산세');
				
				//주택외
				var $txtJaesanseT1 = $('#txtJaesanseT1');
				var $txtJaesanseT2 = $('#txtJaesanseT2');
				var $stepJaesanseT3 = $('#stepJaesanseT3');
				
				if(isSet) {
					//매입가
					var _$$1 = $('#WPurchase').data('value');
					var _$$2 = $('#stepOwnTerm').data('value');
					
					$txtJaesanseT1.data('value', _$$1);
					$txtJaesanseT1.val(_$$1.toString().money());
					
					$txtJaesanseT2.data('value', _$$2);
					$txtJaesanseT2.val($('#stepOwnTerm').val());
				}
				
				var $$1 = $txtJaesanseT1.data('value');
				var $$2 = $txtJaesanseT2.data('value');
				var $$3 = $stepJaesanseT3.data('value');
				var $$r = Math.round(parseFloat($$1) * parseFloat($$2) * (0.01 * parseFloat($$3)));
				
				var $WJaesanse = $('#WJaesanse');
				$WJaesanse.data('value', $$r);
				$WJaesanse.val($$r.toString().money());
				
				calcJesegeum();
			},
			calcJaesanse2: function(isSet, isInit) {
				
				var $txtJaesanseH1 = $('#txtJaesanseH1');
				var $txtJaesanseH2 = $('#txtJaesanseH2');
				var $txtJaesanseH3 = $('#txtJaesanseH3');
				var $stepOwnTerm = $('#stepOwnTerm');
				
				if(isSet) {
					$txtJaesanseH2.data('value', $stepOwnTerm.data('value'));
					$txtJaesanseH2.val($stepOwnTerm.val());
				}
				
				if(isInit) {
					$txtJaesanseH1.val('0');
					$txtJaesanseH1.data('value', '0');
					$txtJaesanseH2.val($stepOwnTerm.val());
					$txtJaesanseH2.data('value', $stepOwnTerm.data('value'));
					$txtJaesanseH3.val('0');
					$txtJaesanseH3.data('value', '0');
				}
				
				var $$1 = parseFloat($txtJaesanseH1.data('value'));
				var $$2 = parseFloat($txtJaesanseH2.data('value'));
				var $$3 = 0;
				var $$r = 0;
				
				//6천만원 이하 0.1%
				if($$1 <= 60000000) {
					$$3 = Math.round($$1 * 0.001);
				}
				else if($$1 > 60000000 && $$1 <= 150000000) {
					$$3 = Math.round(60000 + ($$1 - 60000000) * 0.0015);
				}
				else if($$1 > 150000000 && $$1 <= 300000000) {
					$$3 = Math.round(195000 + ($$1 - 150000000) * 0.0025);
				}
				else {
					$$3 = Math.round(570000 + ($$1 - 300000000) * 0.004);
				}
				
				$$r = Math.round($$2 * $$3);
				
				$txtJaesanseH3.data('value', $$3);
				$txtJaesanseH3.val($$3.toString().money());
				
				var $WJaesanse2 = $('#WJaesanse2');
				$WJaesanse2.data('value', $$r);
				$WJaesanse2.val($$r.toString().money());
				calcJesegeum();
			},
			calcYangdose: function(isSet) {
				console.log('양도세');
				var $stepYangdose = $('#stepYangdose');
				var $stepYangdose2 = $('#stepYangdose2');
				var $WYangdose = $('#WYangdose');
				
				if(isSet) {
					var $WPurchase = $('#WPurchase');
					var _$$1 = $WPurchase.data('value');
					
					$stepYangdose.data('value', _$$1);
					$stepYangdose.val($WPurchase.val() + $stepYangdose.data('suffix'));
					
					$stepYangdose.data('step', makeStep(_$$1, hotplace.config.yangdoseStepPercent));
				}
				
				var $$1 = parseInt($stepYangdose.data('value')); 
				var $$2 = 0;
				var isNonSaeob = $('#chkYangdose').is(':checked');
				
				//개인
				if($('#radioPrivate').is(':checked')) {
					//보유기간
					var term = parseFloat($('#stepOwnTerm').data('value'));
					if(term < 1) {
						$$2 = isNonSaeob ? 60 : 50;
					}
					else if(term >=1 && term < 2) {
						$$2 = isNonSaeob ? 50 : 40;
					}
					else {
						if($$1 <= 12000000) {
							$$2 = isNonSaeob ? 16 : 6;
						}
						else if($$1 > 12000000 && $$1 <= 46000000) {
							$$2 = isNonSaeob ? 25 : 15;
						}
						else if($$1 > 46000000 && $$1 <= 88000000) {
							$$2 = isNonSaeob ? 34 : 24;
						}
						else if($$1 > 88000000 && $$1 <= 150000000) {
							$$2 = isNonSaeob ? 45 : 35;
						}
						else if($$1 > 150000000 && $$1 <= 500000000) {
							$$2 = isNonSaeob ? 48 : 38;
						}
						else {
							$$2 = isNonSaeob ? 50 : 40;
						}
					}
				}
				else {//법인
					if($$1 <= 200000000) {
						$$2 = isNonSaeob ? 20 : 10;
					}
					else if($$1 > 200000000 && $$1 <= 20000000000) {
						$$2 = isNonSaeob ? 30 : 20;
					}
					else {
						$$2 = isNonSaeob ? 32 : 22;
					}
				}
				
				$stepYangdose2.data('value', $$2);
				$stepYangdose2.val($$2 + $stepYangdose2.data('suffix'));
				
				var $$r = Math.round($$1 * 0.01 * $$2);
				$WYangdose.data('value', $$r);
				$WYangdose.val($$r.toString().money());
				calcJesegeum();
			},
			calcGeonchugGongsa: function(isSet) {
				console.log('건축공사비');
				var $txtGeonchugGongsa = $('#txtGeonchugGongsa');
				var $stepGeonchugGongsa = $('#stepGeonchugGongsa');
				var $WGeonchugGongsa = $('#WGeonchugGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtGeonchugGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 4500000;
					$txtGeonchugGongsa.data('value', _$$1);
					$txtGeonchugGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtGeonchugGongsa.data('value'));
				var $$2 = parseInt($stepGeonchugGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WGeonchugGongsa.data('value', $$r);
				$WGeonchugGongsa.val($$r.toString().money());
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcTomogGongsa: function(isSet) {
				console.log('토목공사비');
				
				var $txtTomogGongsa = $('#txtTomogGongsa');
				var $stepTomogGongsa = $('#stepTomogGongsa');
				var $WTomogGongsa = $('#WTomogGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtTomogGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 1500000;
					$txtTomogGongsa.data('value', _$$1);
					$txtTomogGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtTomogGongsa.data('value'));
				var $$2 = parseInt($stepTomogGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WTomogGongsa.data('value', $$r);
				$WTomogGongsa.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcPojangGongsa: function(isSet) {
				console.log('포장공사비');
				
				var $txtPojangGongsa = $('#txtPojangGongsa');
				var $stepPojangGongsa = $('#stepPojangGongsa');
				var $WPojangGongsa = $('#WPojangGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtPojangGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 1500000;
					$txtPojangGongsa.data('value', _$$1);
					$txtPojangGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtPojangGongsa.data('value'));
				var $$2 = parseInt($stepPojangGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WPojangGongsa.data('value', $$r);
				$WPojangGongsa.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcInibGongsa: function(isSet) {
				console.log('인입공사비');
				
				var $txtInibGongsa = $('#txtInibGongsa');
				var $stepInibGongsa = $('#stepInibGongsa');
				var $WInibGongsa = $('#WInibGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtInibGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 1500000;
					$txtInibGongsa.data('value', _$$1);
					$txtInibGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtInibGongsa.data('value'));
				var $$2 = parseInt($stepInibGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WInibGongsa.data('value', $$r);
				$WInibGongsa.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcAcceptGaebal: function() {
				console.log('개발행위허가');
				calcMymoney();//자기자본
				calcInheogabi();
			},
			calcGamri: function() {
				console.log('감리비');
				calcInheogabi();
			},
			calcCheuglyang: function() {
				console.log('측량비');
				calcInheogabi();
			},
			calcEvalueGamjeung: function() {
				console.log('감정평가');
				calcInheogabi();
			},
			calcSplitPilji: function() {
				console.log('필지분할');
				calcInheogabi();
			},
			calcDevBudam: function() {
				console.log('개발부담금');
				calcMymoney();//자기자본
				calcBudamgeum();
			},
			calcFarmBudam: function() {
				console.log('농지보전부담금');
				calcMymoney();//자기자본
				calcBudamgeum();
			},
			calcAlterSanrim: function() {
				console.log('대체산림자원조성비');
				calcMymoney();//자기자본
				calcBudamgeum();
			},
			calcPurchaseChaegwon: function() {
				console.log('채권매입비');
				calcMymoney();//자기자본
				calcSaeobgyeongbi();
			},
			calcSetGeunjeodang: function() {
				console.log('근저당 설정비');
				calcMymoney();//자기자본
				calcSaeobgyeongbi();
			},
			calcPreserveDeunggi: function() {
				console.log('보존등기비');
				calcMymoney();//자기자본
				calcSaeobgyeongbi();
			},
			calcManagement: function() {
				console.log('운영비');
				calcSaeobgyeongbi();
			},
			calcSellSusulyo: function() {
				console.log('매각수수료');
				calcSaeobgyeongbi();
			},
			calcPreparation: function() {
				console.log('예비비');
				calcSaeobgyeongbi();
			},
			calcIncomeSellBuilding: function() {
				console.log('수입>매각>건물');
				calcIncomeSell();
			},
			calcIncomeSellSeolbi: function() {
				console.log('수입>매각>설비');
				calcIncomeSell();
			},
			calcIncomeSellLand: function() {
				console.log('수입>매각>토지');
				calcIncomeSell();
			},
			calcIncomeManageImdae: function() {
				console.log('수입>운영>임대');
				calcIncomeManage();
			},
			calcGyeongsang: function() {
				
			}
		}
	}();
}(
	hotplace.calc = hotplace.calc || {},
	jQuery
));

/**
 * @namespace hotplace.report 
 * https://brunch.co.kr/@ourlove/60
 * @desc printThis jquery library
 */
(function(report, $) {
	
	function send(type, cfg) {
		var form = document.createElement('form');
		form.action = hotplace.getContextUrl() + 'download/' + type;
		form.method = 'POST';
		form.target = '_self';
		
		var input = document.createElement('input');
		input.type = 'hidden';
	    input.name = 'json';
	    input.value = JSON.stringify(cfg);
	   
	    form.appendChild(input);
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
	}
	
	report.PDF = {
		profit : function() {
			send('pdf', {
					fileName:'profitFormPdf',
					cssName: 'profitPdf',
					docName: '수지분석',
					address: '서울시 강남구 도곡동 963',
					jimok: '전',
					valPerPyeung:'21,000',
					area: '132',
					gongsi: '4,040,000',
					limitChange:'Y'
					
			});
		}
	}

}(
	hotplace.report = hotplace.report || {},
	jQuery
));

/*
 * AGPL 등 몇몇 예외적인 라이선스를 제외하고는 자사의 서버에 설치하여 '서비스' 형태로 사용되는 공개SW는 배포로 보지 않기 때문에 공개SW 라이선스 의무사항의 적용을 받지 않습니다.
      다만, 해당 제품을 배포(무상 배포, 유상 판매)할 경우에는 의무사항의 적용을 받게 되므로 이 경우에는 다음과 같은 MIT 라이선스 의무사항을 준수하셔야 합니다.

   1. 소스코드의 저작권 관련 사항 삭제 금지
   2. MIT 라이선스 전문(영문) 포함
   3. 보증의 부인
   4. 책임의 제한

      그외에 MIT 라이선스는 수정내용의 고지 의무가 없으므로 수정된 내용을 별도 고지할 필요는 없으며, 소스코드 공개 의무 또한 없습니다.
 * */

/*
 * 다음지도 
 * 표기     |  축척
   10m  |  1:475
   20m  |  1:950
   30m  |  1:1,900
   50m  |  1:3,800
  100m  |  1:7,600
  250m  |  1:15,200
  500m  |  1:30,400
   1km  |  1:60,800
   2km  |  1:121,600
   4km  |  1:243,200
   8km  |  1:486,400
  16km  |  1:972,800
  32km  |  1:1,945,600
  64km  |  1:3,891,200
 128km  |  1:7,782,400
 
var mapContainer = document.getElementById('map');
var mapOption = { 
    center: new daum.maps.LatLng(33.450701, 126.570667),
    level: 1
};  

var map = new daum.maps.Map(mapContainer, mapOption);
var proj = map.getProjection();

// 지도 중심 좌표를 중심으로 하는 사각형을 구하려고 함
// center에 지도 중심 말고 원하는 좌표를 넣으면 됨
var center = map.getCenter();
var level = map.getLevel();

// 지도 레벨 마다 화면좌표 1px당 m값을 구할 수 있으므로
// 지도 중심의 좌표를 화면좌표로 투영시켜
// 화면좌표 기준으로 계산할 예정
var centerPoint = proj.pointFromCoords(center);

// 3레벨에서 1px이 1m
var scale = 1 / Math.pow(2, level - 3);

// 구하고자 하는 사각형 한 변의 길이: 25미터
var len = 25;

// 12.5m의 화면좌표 값
var pixelForHalfLen = len / 2 * scale;

var swPoint = new daum.maps.Point(
    			centerPoint.x - pixelForHalfLen,
    			centerPoint.y + pixelForHalfLen);
var nwPoint = new daum.maps.Point(
    			centerPoint.x + pixelForHalfLen,
    			centerPoint.y - pixelForHalfLen);

// 화면좌표를 다시 지도의 좌표계 좌표로 변환
var sw = proj.coordsFromPoint(swPoint);
var ne = proj.coordsFromPoint(nwPoint);

var rectangleBounds = new daum.maps.LatLngBounds(sw, ne);

var rectangle = new daum.maps.Rectangle({
    map: map,
    bounds: rectangleBounds
});
 * */
