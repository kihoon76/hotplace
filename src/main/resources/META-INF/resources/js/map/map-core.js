/*
 * jsDoc 설치방법
 * npm install -g jsdoc
 * http://usejsdoc.org/
 * */
(function(hotplace, $) {
	var _version = '1.0';
	var ROOT_CONTEXT = $('body').data('url');
	
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
    
	function _s4() {
		return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	}
    
	hotplace.isSupport = function(target, array) {
		return $.inArray(target, array) > -1;
	}
	
	hotplace.ajax = function(params) {
		var dom = hotplace.dom;
		
		$.ajax(ROOT_CONTEXT + params.url, {
			async: (params.async == null)? true : params.async,
			beforeSend: function(xhr) {
				var activeMask = (params.activeMask == undefined) ? true : params.activeMask; //전체설정 이후 마스크 개별설정
				if(activeMask) dom.showMask(params.loadEl, params.loadMsg);
				
				if(params.beforeSend && typeof params.beforeSend === 'function') {
					params.beforeSend();
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
					if(activeMask) dom.hideMask();
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
				if(activeMask) dom.hideMask();
			},
			timeout: params.timeout || 300000
		});
	}
	
	hotplace.getPlainText = function(url, param, cbSucc, isActiveMask) {
			
		hotplace.ajax({
			url: url,
			method: 'GET',
			dataType: 'text',
			data: param || {},
			activeMask: (isActiveMask != undefined) ? isActiveMask : true,
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				//console.log('data count : ' + jo.datas.length);
				cbSucc(jo);
			},
			error:function() {
				
			}
		});
		
	}
	
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
	
	hotplace.createUuid = function() {
		 return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
	}
}(
	window.hotplace = window.hotplace || {},
	jQuery	
));

(function(maps, $) {
	var _venderStr = '';
	var _container = document.getElementById('map');
	var _vender = null;
	var _venderMap = null;
	var _venderEvent = null;
	var _initCalled = false;
	
	var _events = ['zoom_changed', 'bounds_changed', 'dragend', 'zoom_start', 'click', 'tilesloaded', 'idle'];
	var _vender = ['naver', 'daum'];
	var _currentBounds = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 };  //화면에 보이는 bounds
	var _marginBounds  = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 };  //실제로 cell을 그릴 bounds
	var _locationBounds = {'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0};	  //서버로 부터 받은 좌표계 bounds
	
	var _cellTypes = {GONGSI:'GONGSI'};
	
	var _cells = [];
	var _notDrawedCells = [];    //weight값 제한으로 화면에서 그리지않은 cell들
	
	var _markerTypes = {
		RADIUS_SEARCH: 'RADIUS_SEARCH',
	};
	
	maps.MarkerType = _markerTypes;
	/**
	 * 
	 * */
	var _markers = {
		RADIUS_SEARCH : {
			m: [],	//marker
			c: []   //circle
		}    
	};
	
	var _infoWindowsForMarker = {
		RADIUS_SEARCH : []
	};
	
	var _bndNmBnd = []; //bound와 margin bound
	
	var _heatMapLayer = null;
	var _heatMapDatas = [];
	
	var _templateInfoWndowForCell = null;
	/*
	 * daum  zoom : [14 ~ 1]
	 * naver zoom : [1 ~ 14]
	 * */
	
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
		
		//var r = [2,2,2,2,2,2,2,2,2,2,2,2];
		
		var marginXRate =  parseFloat((_currentBounds.nex - _currentBounds.swx)/8);
		var marginYRate =  parseFloat((_currentBounds.ney - _currentBounds.swy)/8);
		
		_marginBounds.swx = _currentBounds.swx - marginXRate;
		_marginBounds.swy = _currentBounds.swy - marginYRate;
		_marginBounds.nex = _currentBounds.nex + marginXRate;
		_marginBounds.ney = _currentBounds.ney + marginYRate;
	}
	
	function _setLocationBounds() {
		/*var bnds = null;
		var curBounds = null;
		
		switch(_venderStr) {
		case 'daum' :
			bnds = _venderMap.getBounds();
			curBounds = {
				swx : bnds.ba,
				swy : bnds.ha,
				nex : bnds.fa,
				ney : bnds.ga
			};
			break;
		case 'naver' :
			bnds = _venderMap.getBounds();
			curBounds = {
				swx : bnds._sw.x,
				swy : bnds._sw.y,
				nex : bnds._ne.x,
				ney : bnds._ne.y
			};
			break;
		}*/
		//_setCurrentBounds();
		
		var r = [0.5,0.5,1,0.3,2,2,2,2,2,2,2,2];
		
		var locationXRate =  parseFloat((_marginBounds.nex - _marginBounds.swx)/6);
		var locationYRate =  parseFloat((_marginBounds.ney - _marginBounds.swy)/6);
		
		/*_locationBounds.swx = _currentBounds.swx - locationRate;
		_locationBounds.swy = _currentBounds.swy - locationRate;
		_locationBounds.nex = _currentBounds.nex + locationRate;
		_locationBounds.ney = _currentBounds.ney + locationRate;*/
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
		
		/*
		 * R 255 G 0   B 0  1020
		 * R 255 G 255 B 0   765
		 * R   0 G 255 B 0	 510
		 * R   0 G 255 B 255 255
		 * R   0 G   0 B 255   0
		 * */
		
		return color;
	}
	
	/*
	 * data = {weight:[], location:[125.06666666667(극서), 33.83652712959(극남), 125.35460495018(극동), 34.06720077312(극북)]},...
	 * */
	function _drawRectangle(swy, swx, ney, nex, css, cellData, triggerable) {
		var rec = null;
		
		switch(_venderStr) {
		case 'daum'  :
			break;
		case 'naver' :
			rec = new _vender.Rectangle({
			    map: _venderMap,
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
				var xcDiff = parseFloat((r.data.location[2] - r.data.location[0])/2).toFixed(11);
				var ycDiff = parseFloat((r.data.location[3] - r.data.location[1])/2).toFixed(11);
				
				var xc = r.data.location[0] + parseFloat(xcDiff);
				var yc = r.data.location[1] + parseFloat(ycDiff);
				var location = new _vender.LatLng(yc, xc);
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
						//var jo = $.parseJSON(data);
						//console.log('data count : ' + jo.datas.length);
						//cbSucc(jo);
						hotplace.dom.createChart('canvas');
					},
					error:function() {
						
					}
				});
			});
			
			if(triggerable)	_venderEvent.trigger(rec, 'click')
			
			break;
		}
		
		return rec;
	}
	
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
	
	function _createMarkers(level, startIdx, markerType) {
		var markerData;
		/*switch(markerType) {
		case _markerType.GONGSI :
			markerData = hotplace.database.getGongsiLevelData(level);
			break;
		}*/
		
		_commXY(markerData,
				startIdx,
				function(data) {
					maps.getMarker(markerType, lat, lng, {}, {
						hasInfoWindow: false,
						radius:0
					});
				}
		);
	}
	
	function _createCells(level, startIdx, cellType) {
		var colorFn;
	    switch(cellType) {
		case _cellTypes.GONGSI :
			colorFn = _getColorByGongsiWeight;
			break;
		default :
			colorFn = _getColorByGongsiWeight;
			break;
		}
		  
		_commXY(hotplace.database.getLevelData(level),
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
	
	/*
	 * 한 레벨에서 그린  Rectangle 삭제
	 */
	function _removeAllCells() {
		for(var i=_cells.length-1; i>=0; i--) {
			if(_cells[i]){
				_cells[i].setMap(null);
				delete _cells[i]; 
			}
		}
	}
	
	/*
	 * zoom_change 시 한 레벨에서 그린  marker 삭제
	 */
	function _destroyMarkers () {
		for(var type in _markers) {
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
	
	//벤더별 벤더이벤트 전부 
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
	
	function _initJiJeokDoLayer() {
		
		//지적편집도
		if(_venderStr == 'naver') {
			_vender._cadastralLayer = new _vender.CadastralLayer();
		}
	}
	
	function _showCellLayer(cellType) {
		var db = hotplace.database;
		var currentLevel = _getCurrentLevel();
		
		if(!db.hasData(currentLevel)) return;
		var startIdx = db.getStartXIdx(_marginBounds.swx, currentLevel);
		
		_createCells(currentLevel, startIdx, cellType);
	}
	
	function _showGongsiLayer() {
		var db = hotplace.database;
		var currentLevel = _getCurrentLevel();
		
		if(!db.hasGongsiData(currentLevel)) return;
		var startIdx = db.getStartXIdx(_marginBounds.swx, currentLevel);
		
		_createMarkers(currentLevel, startIdx);
	}
	
	function _initLayers(level) {
		_removeAllCells();
		_setLocationBounds();
		_notDrawedCells = [];
		hotplace.dom.closeInfoWindowForCell();
		hotplace.database.initLevel(level);
	}
	
	maps.destroyMarkers = _destroyMarkers;
	maps.destroyMarkerType = _destroyMarkerType;
	
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
	
	maps.getVender = function() {
		return _vender;
	}
	
	maps.getVenderMap = function() {
		return _venderMap;
	}
	
	maps.getCurrentLevel = function() {
		return _getCurrentLevel();
	}
	
	maps.event = {
		addListener : function(eventName, callback, target) {
			
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
	
	maps.init = function(venderStr, mapOptions, listeners, afterInit) {
		if(_initCalled) throw new Error('init 함수는 이미 호출 되었습니다');
		
		if(hotplace.isSupport(venderStr, _vender)) {
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

	maps.panToBounds = function(lat, lng, size, moveAfterFn) {
		
		if(_venderStr == 'naver') {
			_venderMap.morph(new _vender.LatLng(lat, lng), 10, {duration: 100});
		}
		else if(_venderStr == 'daum') {
			_venderMap.panTo(new _vender.LatLngBounds(
	                new _vender.LatLng(lat - size, lng - size),
	                new _vender.LatLng(lat + size, lng + size)
	        ));
		}
		
		moveAfterFn();
	}
	
	/**
	 * @param {string}  markerType 마커타입
	 * @param {number}  lat 경도좌표
	 * @param {number}  lng 위도좌표
	 * @param {object}  listeners 마커이벤트 핸들러
	 * @param {object}  options 옵션
	 * @param {boolean} options.hasInfoWindow 클릭시 infoWindow 사용여부
	 * @param {string}  options.infoWinFormName 
	 * @param {number}  options.radius 마커주위 반경 (0일경우 표시안함) 
	 * @param {object}  options.datas  
	 */
	maps.getMarker = function(markerType, lat, lng, listeners, options) {
		var newMarker, newInfoWindow;
		
		newMarker = new _vender.Marker({
		    position: new _vender.LatLng(lat, lng),
		    map: _venderMap
		});
		
		_markers[markerType].m.push(newMarker);
		
		if(options.hasInfoWindow) {
			var tForm = hotplace.dom.getTemplate(options.infoWinFormName);
			
			newInfoWindow = new _vender.InfoWindow({
				content: tForm({address: options.datas.content})
		    });
			
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
			    center:  new _vender.LatLng(lat, lng),
			    radius: options.radius,
			    fillColor: 'rgba(250,245,245)',
			    fillOpacity: 0,
			    clickable: true,
			    zIndex: 30000000
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'click', function(e) {
				hotplace.dom.insertFormInmodal('radiusSearchResultForm');
				hotplace.dom.openModal(options.datas.content + ' 일대 (반경: ' + options.radius + 'm)');
				
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
	
	maps.drawBounds = function() {
		if(_bndNmBnd.length != 0) {
			_bndNmBnd[0].setMap(null);
			_bndNmBnd[1].setMap(null);
			_bndNmBnd[2].setMap(null);
			_bndNmBnd = [];
		}
		
		_bndNmBnd.push(_drawRectangle(_currentBounds.swy, _currentBounds.swx, _currentBounds.ney, _currentBounds.nex,{
		    strokeColor: '#5347AA',
		    strokeWeight: 2,
		    fillColor: '#BBBBBB',
		    fillOpacity: 0.1,
		}));
		
		_bndNmBnd.push(_drawRectangle(_marginBounds.swy, _marginBounds.swx, _marginBounds.ney, _marginBounds.nex,{
		    strokeColor: '#5347AA',
		    strokeWeight: 2,
		    fillColor: '#EEEEEE',
		    fillOpacity: 0.1,
		}));
		
		_setLocationBounds();
		_bndNmBnd.push(_drawRectangle(_locationBounds.swy, _locationBounds.swx, _locationBounds.ney, _locationBounds.nex,{
		    strokeColor: '#5347AA',
		    strokeWeight: 2,
		    fillColor: '#CCCCCC',
		    fillOpacity: 0.1,
		}));
		
	},
	
	maps.appendCell = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(db.hasData(_currentLevel)) {
			var startIdx = db.getStartXIdx(_marginBounds.swx, _currentLevel);
			_createCells(_currentLevel, startIdx);
		}
	};
	
	/*maps.appendGongsi = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(db.hasGongsiData(_currentLevel)) {
			var startIdx = db.getStartXIdx(_marginBounds.swx, _currentLevel);
			_createMarker(_currentLevel, startIdx);
		}
	}*/
	 
	maps.isInLocationBounds = function(bnds) {
		return !(_locationBounds.swx > bnds.swx || 
				 _locationBounds.nex < bnds.nex ||
				 _locationBounds.swy > bnds.swy ||
				 _locationBounds.ney < bnds.ney);
	}
	
	maps.showCellLayer = function(cellType, callback) {
		
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(_venderMap) {
			
			//location
			//캐쉬구현
			if(false/*db.isCached(_currentLevel)*/) {
				//_showCellsLayer();
			}
			else {
				_initLayers(_currentLevel);
				
				hotplace.getPlainText('locationbounds', {
					level: _currentLevel,
					 swx : _locationBounds.swx,
					 nex : _locationBounds.nex,
					 swy : _locationBounds.swy,
					 ney : _locationBounds.ney,
					 year: hotplace.dom.getShowCellYear() + '01'
				}, function(json) {
					try {
						db.setLevelData(_currentLevel, json.datas);
						//console.log(json.datas);
						if(!cellType) {
							cellType = _cellTypes.GONGSI;
						}
						else if(typeof(cellType) === 'function'){
							callback = cellType;
						}
						
						_showCellLayer(cellType || _cellTypes.GONGSI);
						if(callback) callback();
					}
					catch(e) {
						throw e;
					}
				});
			}
		}
	}
	
	maps.showGongsiLayer = function() {
		
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(_venderMap) {
			
			//location
			//캐쉬구현
			if(false/*db.isCached(_currentLevel)*/) {
				//_showCellsLayer();
			}
			else {
				_initLayers(_currentLevel);
				
				hotplace.getPlainText('gongsi', {
					level: _currentLevel,
					 swx : _locationBounds.swx,
					 nex : _locationBounds.nex,
					 swy : _locationBounds.swy,
					 ney : _locationBounds.ney
				}, function(json) {
					try {
						db.setGongsiLevelData(_currentLevel, json.datas);
						console.log(json.datas);
						_showGongsiLayer();
						
					}
					catch(e) {
						throw e;
					}
				});
			}
		}
	}
	
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

(function(dom, $) {
	
	var _loadEl;
	var _loadTxt = '로딩 중입니다';
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
	
	var _btnMapDiv = $('#mapButtons');
	var _loadmask = false;
	var _templates = {};
	var _infoWindowForCell = null;
	var _showCellYear = 2017;
	/*
	 * //https://github.com/vadimsva/waitMe/blob/gh-pages/index.html
	 * */
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
	
	
	function _makeInfoWndowForCell(vender, venderEvent, data, listeners) {
		var template = dom.getTemplate('cellForm');
		
		_infoWindowForCell = new vender.InfoWindow({
	        content: template(data),
	        borderWidth: 1,
	        zIndex: 1000
	    });
		
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
	
	var _layer = {};
	
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
	
	dom.closeLayer = function(targetId) {
		if(_layer[targetId].is(':visible')){
			_layer[targetId].hide();
		}
	}
	
	dom.openInfoWindowForCell = function(map, location, vender, venderEvent, data, listeners) {
		_infoWindowForCell = _makeInfoWndowForCell(vender, venderEvent, data, listeners);
		_infoWindowForCell.open(map, location);
		
		//event handler가 걸려있는지 확인
		var ev = $._data(document.getElementById('btnCellClose'), 'events');
		if(!ev || !ev.click) {
			$('#btnCellClose').on('click', function(e) {
				dom.closeInfoWindowForCell();
			});
		}
	}
	
	dom.closeInfoWindowForCell = function() {
		if(_infoWindowForCell) {
			_infoWindowForCell.close();
			_infoWindowForCell = null;
		}
	}
	
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
	
	dom.openTooltip = function(selector) {
		$(selector).tooltipster('open');
	}
	
	dom.closeTooltip = function(selector) {
		$(selector).tooltipster('close');
	}
	
	dom.closeAllTooltip = function(CLASS) {
		$(CLASS).each(function(index) {
			$(this).tooltipster('close');
		})
	}
	
	dom.openModal = function(title, modalSize) {
		$('#spModalTitle').text(title);
		
		if(!modalSize) modalSize = 'fullsize';
		
		$('#containerModal .modal-dialog').removeClass('modal-fullsize modal-bigsize');
		$('#containerModal .modal-content').removeClass('modal-fullsize modal-bigsize'); 
		
		$('#containerModal .modal-dialog').addClass('modal-' + modalSize);
		$('#containerModal .modal-content').addClass('modal-' + modalSize);
		
		
		$('#containerModal').modal('show');
	}
	
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
	
	
	function _echartBar() {
		 if ($('#mainb').length ){
			  
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
	}
	
	function _echartPie() {
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
					  lang: [
						"Text View",
						"Close",
						"Refresh",
					  ],
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
	}
	
	function _echartScatter() {
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
					  } else {
						return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
					  }
					}
				  },
				  data: [
					[161.2, 51.6],
					[167.5, 59.0],
					[159.5, 49.2],
					[157.0, 63.0],
					[155.8, 53.6],
					[170.0, 59.0],
					[159.1, 47.6],
					[166.0, 69.8],
					[176.2, 66.8],
					[160.2, 75.2],
					[172.5, 55.2],
					[170.9, 54.2],
					[172.9, 62.5],
					[153.4, 42.0],
					[160.0, 50.0],
					[147.2, 49.8],
					[168.2, 49.2],
					[175.0, 73.2],
					[157.0, 47.8],
					[167.6, 68.8],
					[159.5, 50.6],
					[175.0, 82.5],
					[166.8, 57.2],
					[176.5, 87.8],
					[170.2, 72.8],
					[174.0, 54.5],
					[173.0, 59.8],
					[179.9, 67.3],
					[170.5, 67.8],
					[160.0, 47.0],
					[154.4, 46.2],
					[162.0, 55.0],
					[176.5, 83.0],
					[160.0, 54.4],
					[152.0, 45.8],
					[162.1, 53.6],
					[170.0, 73.2],
					[160.2, 52.1],
					[161.3, 67.9],
					[166.4, 56.6],
					[168.9, 62.3],
					[163.8, 58.5],
					[167.6, 54.5],
					[160.0, 50.2],
					[161.3, 60.3],
					[167.6, 58.3],
					[165.1, 56.2],
					[160.0, 50.2],
					[170.0, 72.9],
					[157.5, 59.8],
					[167.6, 61.0],
					[160.7, 69.1],
					[163.2, 55.9],
					[152.4, 46.5],
					[157.5, 54.3],
					[168.3, 54.8],
					[180.3, 60.7],
					[165.5, 60.0],
					[165.0, 62.0],
					[164.5, 60.3],
					[156.0, 52.7],
					[160.0, 74.3],
					[163.0, 62.0],
					[165.7, 73.1],
					[161.0, 80.0],
					[162.0, 54.7],
					[166.0, 53.2],
					[174.0, 75.7],
					[172.7, 61.1],
					[167.6, 55.7],
					[151.1, 48.7],
					[164.5, 52.3],
					[163.5, 50.0],
					[152.0, 59.3],
					[169.0, 62.5],
					[164.0, 55.7],
					[161.2, 54.8],
					[155.0, 45.9],
					[170.0, 70.6],
					[176.2, 67.2],
					[170.0, 69.4],
					[162.5, 58.2],
					[170.3, 64.8],
					[164.1, 71.6],
					[169.5, 52.8],
					[163.2, 59.8],
					[154.5, 49.0],
					[159.8, 50.0],
					[173.2, 69.2],
					[170.0, 55.9],
					[161.4, 63.4],
					[169.0, 58.2],
					[166.2, 58.6],
					[159.4, 45.7],
					[162.5, 52.2],
					[159.0, 48.6],
					[162.8, 57.8],
					[159.0, 55.6],
					[179.8, 66.8],
					[162.9, 59.4],
					[161.0, 53.6],
					[151.1, 73.2],
					[168.2, 53.4],
					[168.9, 69.0],
					[173.2, 58.4],
					[171.8, 56.2],
					[178.0, 70.6],
					[164.3, 59.8],
					[163.0, 72.0],
					[168.5, 65.2],
					[166.8, 56.6],
					[172.7, 105.2],
					[163.5, 51.8],
					[169.4, 63.4],
					[167.8, 59.0],
					[159.5, 47.6],
					[167.6, 63.0],
					[161.2, 55.2],
					[160.0, 45.0],
					[163.2, 54.0],
					[162.2, 50.2],
					[161.3, 60.2],
					[149.5, 44.8],
					[157.5, 58.8],
					[163.2, 56.4],
					[172.7, 62.0],
					[155.0, 49.2],
					[156.5, 67.2],
					[164.0, 53.8],
					[160.9, 54.4],
					[162.8, 58.0],
					[167.0, 59.8],
					[160.0, 54.8],
					[160.0, 43.2],
					[168.9, 60.5],
					[158.2, 46.4],
					[156.0, 64.4],
					[160.0, 48.8],
					[167.1, 62.2],
					[158.0, 55.5],
					[167.6, 57.8],
					[156.0, 54.6],
					[162.1, 59.2],
					[173.4, 52.7],
					[159.8, 53.2],
					[170.5, 64.5],
					[159.2, 51.8],
					[157.5, 56.0],
					[161.3, 63.6],
					[162.6, 63.2],
					[160.0, 59.5],
					[168.9, 56.8],
					[165.1, 64.1],
					[162.6, 50.0],
					[165.1, 72.3],
					[166.4, 55.0],
					[160.0, 55.9],
					[152.4, 60.4],
					[170.2, 69.1],
					[162.6, 84.5],
					[170.2, 55.9],
					[158.8, 55.5],
					[172.7, 69.5],
					[167.6, 76.4],
					[162.6, 61.4],
					[167.6, 65.9],
					[156.2, 58.6],
					[175.2, 66.8],
					[172.1, 56.6],
					[162.6, 58.6],
					[160.0, 55.9],
					[165.1, 59.1],
					[182.9, 81.8],
					[166.4, 70.7],
					[165.1, 56.8],
					[177.8, 60.0],
					[165.1, 58.2],
					[175.3, 72.7],
					[154.9, 54.1],
					[158.8, 49.1],
					[172.7, 75.9],
					[168.9, 55.0],
					[161.3, 57.3],
					[167.6, 55.0],
					[165.1, 65.5],
					[175.3, 65.5],
					[157.5, 48.6],
					[163.8, 58.6],
					[167.6, 63.6],
					[165.1, 55.2],
					[165.1, 62.7],
					[168.9, 56.6],
					[162.6, 53.9],
					[164.5, 63.2],
					[176.5, 73.6],
					[168.9, 62.0],
					[175.3, 63.6],
					[159.4, 53.2],
					[160.0, 53.4],
					[170.2, 55.0],
					[162.6, 70.5],
					[167.6, 54.5],
					[162.6, 54.5],
					[160.7, 55.9],
					[160.0, 59.0],
					[157.5, 63.6],
					[162.6, 54.5],
					[152.4, 47.3],
					[170.2, 67.7],
					[165.1, 80.9],
					[172.7, 70.5],
					[165.1, 60.9],
					[170.2, 63.6],
					[170.2, 54.5],
					[170.2, 59.1],
					[161.3, 70.5],
					[167.6, 52.7],
					[167.6, 62.7],
					[165.1, 86.3],
					[162.6, 66.4],
					[152.4, 67.3],
					[168.9, 63.0],
					[170.2, 73.6],
					[175.2, 62.3],
					[175.2, 57.7],
					[160.0, 55.4],
					[165.1, 104.1],
					[174.0, 55.5],
					[170.2, 77.3],
					[160.0, 80.5],
					[167.6, 64.5],
					[167.6, 72.3],
					[167.6, 61.4],
					[154.9, 58.2],
					[162.6, 81.8],
					[175.3, 63.6],
					[171.4, 53.4],
					[157.5, 54.5],
					[165.1, 53.6],
					[160.0, 60.0],
					[174.0, 73.6],
					[162.6, 61.4],
					[174.0, 55.5],
					[162.6, 63.6],
					[161.3, 60.9],
					[156.2, 60.0],
					[149.9, 46.8],
					[169.5, 57.3],
					[160.0, 64.1],
					[175.3, 63.6],
					[169.5, 67.3],
					[160.0, 75.5],
					[172.7, 68.2],
					[162.6, 61.4],
					[157.5, 76.8],
					[176.5, 71.8],
					[164.4, 55.5],
					[160.7, 48.6],
					[174.0, 66.4],
					[163.8, 67.3]
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
					  if (params.value.length > 1) {
						return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
					  } else {
						return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
					  }
					}
				  },
				  data: [
					[174.0, 65.6],
					[175.3, 71.8],
					[193.5, 80.7],
					[186.5, 72.6],
					[187.2, 78.8],
					[181.5, 74.8],
					[184.0, 86.4],
					[184.5, 78.4],
					[175.0, 62.0],
					[184.0, 81.6],
					[180.0, 76.6],
					[177.8, 83.6],
					[192.0, 90.0],
					[176.0, 74.6],
					[174.0, 71.0],
					[184.0, 79.6],
					[192.7, 93.8],
					[171.5, 70.0],
					[173.0, 72.4],
					[176.0, 85.9],
					[176.0, 78.8],
					[180.5, 77.8],
					[172.7, 66.2],
					[176.0, 86.4],
					[173.5, 81.8],
					[178.0, 89.6],
					[180.3, 82.8],
					[180.3, 76.4],
					[164.5, 63.2],
					[173.0, 60.9],
					[183.5, 74.8],
					[175.5, 70.0],
					[188.0, 72.4],
					[189.2, 84.1],
					[172.8, 69.1],
					[170.0, 59.5],
					[182.0, 67.2],
					[170.0, 61.3],
					[177.8, 68.6],
					[184.2, 80.1],
					[186.7, 87.8],
					[171.4, 84.7],
					[172.7, 73.4],
					[175.3, 72.1],
					[180.3, 82.6],
					[182.9, 88.7],
					[188.0, 84.1],
					[177.2, 94.1],
					[172.1, 74.9],
					[167.0, 59.1],
					[169.5, 75.6],
					[174.0, 86.2],
					[172.7, 75.3],
					[182.2, 87.1],
					[164.1, 55.2],
					[163.0, 57.0],
					[171.5, 61.4],
					[184.2, 76.8],
					[174.0, 86.8],
					[174.0, 72.2],
					[177.0, 71.6],
					[186.0, 84.8],
					[167.0, 68.2],
					[171.8, 66.1],
					[182.0, 72.0],
					[167.0, 64.6],
					[177.8, 74.8],
					[164.5, 70.0],
					[192.0, 101.6],
					[175.5, 63.2],
					[171.2, 79.1],
					[181.6, 78.9],
					[167.4, 67.7],
					[181.1, 66.0],
					[177.0, 68.2],
					[174.5, 63.9],
					[177.5, 72.0],
					[170.5, 56.8],
					[182.4, 74.5],
					[197.1, 90.9],
					[180.1, 93.0],
					[175.5, 80.9],
					[180.6, 72.7],
					[184.4, 68.0],
					[175.5, 70.9],
					[180.6, 72.5],
					[177.0, 72.5],
					[177.1, 83.4],
					[181.6, 75.5],
					[176.5, 73.0],
					[175.0, 70.2],
					[174.0, 73.4],
					[165.1, 70.5],
					[177.0, 68.9],
					[192.0, 102.3],
					[176.5, 68.4],
					[169.4, 65.9],
					[182.1, 75.7],
					[179.8, 84.5],
					[175.3, 87.7],
					[184.9, 86.4],
					[177.3, 73.2],
					[167.4, 53.9],
					[178.1, 72.0],
					[168.9, 55.5],
					[157.2, 58.4],
					[180.3, 83.2],
					[170.2, 72.7],
					[177.8, 64.1],
					[172.7, 72.3],
					[165.1, 65.0],
					[186.7, 86.4],
					[165.1, 65.0],
					[174.0, 88.6],
					[175.3, 84.1],
					[185.4, 66.8],
					[177.8, 75.5],
					[180.3, 93.2],
					[180.3, 82.7],
					[177.8, 58.0],
					[177.8, 79.5],
					[177.8, 78.6],
					[177.8, 71.8],
					[177.8, 116.4],
					[163.8, 72.2],
					[188.0, 83.6],
					[198.1, 85.5],
					[175.3, 90.9],
					[166.4, 85.9],
					[190.5, 89.1],
					[166.4, 75.0],
					[177.8, 77.7],
					[179.7, 86.4],
					[172.7, 90.9],
					[190.5, 73.6],
					[185.4, 76.4],
					[168.9, 69.1],
					[167.6, 84.5],
					[175.3, 64.5],
					[170.2, 69.1],
					[190.5, 108.6],
					[177.8, 86.4],
					[190.5, 80.9],
					[177.8, 87.7],
					[184.2, 94.5],
					[176.5, 80.2],
					[177.8, 72.0],
					[180.3, 71.4],
					[171.4, 72.7],
					[172.7, 84.1],
					[172.7, 76.8],
					[177.8, 63.6],
					[177.8, 80.9],
					[182.9, 80.9],
					[170.2, 85.5],
					[167.6, 68.6],
					[175.3, 67.7],
					[165.1, 66.4],
					[185.4, 102.3],
					[181.6, 70.5],
					[172.7, 95.9],
					[190.5, 84.1],
					[179.1, 87.3],
					[175.3, 71.8],
					[170.2, 65.9],
					[193.0, 95.9],
					[171.4, 91.4],
					[177.8, 81.8],
					[177.8, 96.8],
					[167.6, 69.1],
					[167.6, 82.7],
					[180.3, 75.5],
					[182.9, 79.5],
					[176.5, 73.6],
					[186.7, 91.8],
					[188.0, 84.1],
					[188.0, 85.9],
					[177.8, 81.8],
					[174.0, 82.5],
					[177.8, 80.5],
					[171.4, 70.0],
					[185.4, 81.8],
					[185.4, 84.1],
					[188.0, 90.5],
					[188.0, 91.4],
					[182.9, 89.1],
					[176.5, 85.0],
					[175.3, 69.1],
					[175.3, 73.6],
					[188.0, 80.5],
					[188.0, 82.7],
					[175.3, 86.4],
					[170.5, 67.7],
					[179.1, 92.7],
					[177.8, 93.6],
					[175.3, 70.9],
					[182.9, 75.0],
					[170.8, 93.2],
					[188.0, 93.2],
					[180.3, 77.7],
					[177.8, 61.4],
					[185.4, 94.1],
					[168.9, 75.0],
					[185.4, 83.6],
					[180.3, 85.5],
					[174.0, 73.9],
					[167.6, 66.8],
					[182.9, 87.3],
					[160.0, 72.3],
					[180.3, 88.6],
					[167.6, 75.5],
					[186.7, 101.4],
					[175.3, 91.1],
					[175.3, 67.3],
					[175.9, 77.7],
					[175.3, 81.8],
					[179.1, 75.5],
					[181.6, 84.5],
					[177.8, 76.6],
					[182.9, 85.0],
					[177.8, 102.5],
					[184.2, 77.3],
					[179.1, 71.8],
					[176.5, 87.9],
					[188.0, 94.3],
					[174.0, 70.9],
					[167.6, 64.5],
					[170.2, 77.3],
					[167.6, 72.3],
					[188.0, 87.3],
					[174.0, 80.0],
					[176.5, 82.3],
					[180.3, 73.6],
					[167.6, 74.1],
					[188.0, 85.9],
					[180.3, 73.2],
					[167.6, 76.3],
					[183.0, 65.9],
					[183.0, 90.9],
					[179.1, 89.1],
					[170.2, 62.3],
					[177.8, 82.7],
					[179.1, 79.1],
					[190.5, 98.2],
					[177.8, 84.1],
					[180.3, 83.2],
					[180.3, 83.2]
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
	}
	
    /**
     * @private
     */
	function _echartLine() {
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
	}
	
	dom.createChart = function(id) {
		/*var ctx = document.getElementById(id);
		var chart = new Chart(ctx, {
			type: 'horizontalBar',
		    data: {
		      labels: ["Africa", "Asia"],
		      datasets: [
		        {
		          label: "Population (millions)",
		          backgroundColor: ["#3e95cd", "#8e5ea2"],
		          data: [2478,5267]
		        }
		      ]
		    },
		    options: {
		      legend: { display: false },
		      title: {
		        display: true,
		        text: 'Predicted world population (millions) in 2050'
		      }
		    }
		});*/
				  
		_echartBar(); 
		_echartPie();
		_echartScatter();
		_echartLine();
	}
	
	
	
	dom.showMask = function(loadEl, msg) {
		if(loadEl) {
			loadEl = $(loadEl);
		}
		else {
			loadEl = $('body');
		}
		_runWaitMe(loadEl, 1, _loadEffects.timer, msg);
	};
	
	dom.hideMask = function() {
		_loadEl.waitMe('hide');
	};
	
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
	
	dom.insertFormInmodal = function(name) {
		var tForm = dom.getTemplate(name);
		$('#dvModalContent').html(tForm());
	}
	
	dom.getSelectOptions = function(data, title) {
		var len = data.length;
		var html = '<option value="">- ' + title + '  -</option>';
		for(var i=0; i < len; i++) {
			html += '<option value="' + data[i][0] + '">' + data[i][1] + '</option>'; 
		}
		
		return html;
	}
	
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
	
	dom.viewProfit = function() {
		var tForm = dom.getTemplate('profitForm');
		
		$('#dvModalContent').html(tForm());
		
		$('#stepOwnTerm')
		.slider({min: 0, max: 10, values: [4], step: 1, change: function(event,ui){
	        console.log(ui);
	        $('#resultTotalInvestmentPrice').val(ui.value);
	    }})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		
		
		$('#stepPurchase')
		.slider({min: 0, max: 100, values: [50], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepOtherAssetRatio')
		.slider({min: 0, max: 10, values: [5], step: 1})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
	
		$('#stepTaxesNdues')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepPurchaseFee')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepPropertyTax')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepSellingPrice')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepSellingFee')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepTransferTax')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepFinancialCost')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepLicenseCost')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepParmPrivate')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepForestResource')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepDevBudamgeum')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepResolveMoney')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		$('#stepIncome')	
		.slider({min: 0, max: 100, values: [40], step: 10})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		
		dom.openModal('수익률 분석', 'fullsize');
		//dom.initTooltip('ui-slider-handle', {trigger:'hover'});
	}
	
	var _yearRangeMode = 'manual';
	
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
			if(_yearRangeMode == 'auto') {
				runFn(callback);
			}
			else {
				runFn();
			}
			//hotplace.maps.showCellLayer();
			dom.removeBodyAllMask();
		});
		
		el.show();
	}
	
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
	
	dom.getShowCellYear = function() {
		return _showCellYear;
	}
	
	dom.hideYearRangeDiv = function() {
		var el = $('#dvYearRange');
		el.hide();
		el.rangeSlider('destroy');
	}
	
	dom.addBodyAllMask = function() {
		$('#dimScreen').show();
	}
	
	dom.removeBodyAllMask = function() {
		$('#dimScreen').hide();
	}
	
}(
	hotplace.dom = hotplace.dom || {},
	jQuery
));

(function(db, $) {
	
	var _db = {};
	
	/*
	 * 서버에서 가져온 전 데이터를 저장
	 * {
	 * 	 'level' : {
	 * 		'data' : [{"weight":2.6,"location":[126.80104492131,37.57776528544,126.80329443915,37.57956742328], id:'uuid'}],
	 *      'log' : {
	 *      	'uuid' : true  // data의 id => key
	 *      }		
	 *    }
	 * }
	 * 
	 *  
	 * */ 
	
	db.isCached = function(level) {
		return (_db[level]) ? true : false;
	}
	
	/*
	 * 현재  margin이 적용된  화면의 시작점에서 시작할 데이터 index
	 * */
	db.getStartXIdx = function(boundswx, level, sIdx, eIdx) {
		var result;
		var data = _db[level]['data'];
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
			result = db.getStartXIdx(boundswx, level, 0, cIdx);
		}
		else {//오른쪽에 있슴
			result = db.getStartXIdx(boundswx, level, cIdx, eIdx);
		}
		
		//console.log('result ==> ' + result);
		return result;
	}
	
	db.setLevelData = function (level, data) {
		if(!_db[level]) _db[level] = {};
		_db[level].data = data;
		_db[level].log = {}; 
	}
	
	db.setGongsiLevelData = function(level, data) {
		if(!_db[level]) _db[level] = {};
		_db[level].gongsiData = data;
	}
	
	db.hasData = function(level) {
		if(_db[level] && _db[level].data && _db[level].data.length > 0) return true;
		return false;
	}
	
	db.hasGongsiData = function() {
		if(_db[level] && _db[level].gongsiData && _db[level].gongsiData.length > 0) return true;
		return false;
	}
	
	db.getLevelData = function(level) {
		 return (_db[level]) ? _db[level].data : null;
	}
	
	db.getGongsiLevelData = function(level) {
		 return (_db[level]) ? _db[level].gongsiData : null;
	}
	
	db.getLevelLogMap = function(level) {
		return _db[level].log;
	}
	
	//레벨 변경시 rectangle을 그렸던 로그를 기록한 맵을 초기화 한다.
	db.initLevel = function(level) {
		if(_db[level]) {
			/*delete _db[level].log;
			_db[level].log = {};*/
			_db[level] = null;
		}
	}
}(
	hotplace.database = hotplace.database || {},
	jQuery
));

(function(validation, $) {
	validation.numberOnly = function(CLASS) {
		$(CLASS).on('keypress', function(e) {
			 if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
				 return false;
			 }
		});
	}
}(
	hotplace.validation = hotplace.validation || {},
	jQuery
));

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
	
	test.searchRadius = function() {
		hotplace.maps.panToBounds(37.539648921, 127.152615967, null, function() {
			hotplace.maps.getMarker(hotplace.maps.MarkerType.RADIUS_SEARCH,37.539648921, 127.152615967, {
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
				infoWinFormName: 'pinpointForm',
				radius: 500,
				datas: {content: '서울특별시 강동구 길동  15-1'}
			});
		});
	}
	
}(
	hotplace.test = hotplace.test || {},
	jQuery
));

