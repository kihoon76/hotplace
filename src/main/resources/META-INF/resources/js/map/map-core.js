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
			timeout: params.timeout || 30000
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
	
	hotplace.getPlainTextFromJson = function(url, param, cbSucc) {
	
		hotplace.ajax({
			url: url,
			method: 'POST',
			dataType: 'text',
			contentType: 'application/json; charset=UTF-8',
			data: param || {},
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
	
	var _events = ['zoom_changed', 'bounds_changed', 'dragend', 'zoom_start', 'click', 'tilesloaded'];
	var _vender = ['naver', 'daum'];
	var _currentBounds = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 };
	var _marginBounds  = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 };
	
	var _mapTypes = {heat:'heat', cell:'cell', jijeok:'use_district'};
	var _currentMapType;
	
	var _mapTypeLayers = {heat: 'off', cell: 'off', jijeok: 'off'};
	
	var _cells = [];
	var _notDrawedCells = [];    //weight값 제한으로 화면에서 그리지않은 cell들
	//var _viewCells = [];  //현재 bounds에 보이는 좌표(cell) 집합
	
	var _markers = [];
	var _infoWindowsForMarker = [];
	//var _infoWindowsForCell = [];
	
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
		
		var marginRate =  parseFloat((_currentBounds.nex - _currentBounds.swx)/4);
		
		_marginBounds.swx = _currentBounds.swx - marginRate;
		_marginBounds.swy = _currentBounds.swy - marginRate;
		_marginBounds.nex = _currentBounds.nex + marginRate;
		_marginBounds.ney = _currentBounds.ney + marginRate;
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
	
	function _getColorByWeight(weight) {
		//var r = (25.5*weight).toFixed(0);
		//return 'rgb(' + r + ',051,000)';
		var color = '';
		var h = Math.ceil(weight);
		
		if(h <= 50) {
			color = 'rgba(255,255,255,0.0)';
		}
		else if(h>50 && h <=75) {
			color = 'rgb(255,255,0)';
		}
		else if(h>75 && h<=90) {
			color = 'rgb(255,150,0)';
		}
		else {
			color = 'rgb(255,0,0)';
		}
		
		return color;
		
		//255,0,0 ~ 255,255,0
	}
	
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
			
			/*_venderEvent.addListener(rec, 'mouseover', function(e) {
				var r = e.overlay;
				console.log(r);
				if(!r._toggle || r._toggle == 'off') {
					r.setOptions('strokeWeight', 3);
					r._toggle = 'on'
				}
				else {
					r.setOptions('strokeWeight', 0);
					r._toggle = 'off'
				}
				
			});*/
			
			_venderEvent.addListener(rec, 'click', function(e) {
				var r = e.overlay;
				console.log(e);
				var location = new _vender.LatLng(r.data.location[5], r.data.location[4]);
				hotplace.dom.openInfoWndowForCell(_venderMap, location, _vender, {'weight' : r.data.weight});
				
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
		/*var len = _viewCells.length;
		var swxPrevGrpSidx = 0; //swx 이전그룹 시작 인덱스
		var swxPrevGrpEidx = 0; //swx 이전그룹 마지막 인덱스
		var swxGrpSidx = 0; //swx 그룹 시작 인덱스
		
		var currentGrpSwxVal = 0;
		
		for(var x=0; x<len; x++) {
			if(x == 0) {
				//화면 margin boundary로 인해 클릭한 지점 index는 0보다 무조건 큼 
				currentGrpSwxVal = _viewCells[0].location[0];
				swxGrpSidx = swxPrevGrpSidx = 0;
			}
			else {
				
				//현재 group swx값과 클릭한 지점 x를 비교한다. 
				if(currentGrpSwxVal != _viewCells[x].location[0]) {
					currentGrpSwxVal = _viewCells[x].location[0];
					swxPrevGrpSidx = swxGrpSidx;
					swxPrevGrpEidx = x-1;
					swxGrpSidx = x;
					
					//바뀐 그룹과 비교
					if(currentGrpSwxVal > latlng.x) { //이전그룹에서 찾는다
						break;
					}
				}
			}
		}
		
		for(var y=swxPrevGrpSidx; y<=swxPrevGrpEidx; y++) {
			if(latlng.y >= _viewCells[y].location[1] && latlng.y <= _viewCells[y].location[3]) {
				break;
			}
		}
		
		//if(!_isRectangleDrawed(_viewCells[y])) {
			_cells.push(_drawRectangle(
					_viewCells[y].location[1],
					_viewCells[y].location[0],
					_viewCells[y].location[3],
					_viewCells[y].location[2], 
				  {
					  fillColor: _getColorByWeight(_viewCells[y].weight),
					  fillOpacity : 0.1
				  },
				  _viewCells[y]
			));
		//}
		
		console.log(_viewCells[y])*/
	}
	
	/*function _isRectangleDrawed(obj) {
		var len = _cells.length;
		var drawed = false;
		var data;
		
		for(var i=0; i<len; i++) {
			data = _cells[i].data;
			if(data.id == obj.id) {
				drawed = true;
				break;
			}
		}
		
		return drawed;
	}*/
	
	function _createCells(level, startIdx) {
		//_viewCells = [];
		
		var data = hotplace.database.getLevelData(level);
		var logMap = hotplace.database.getLevelLogMap(level);
		var len = data.length;
		
		var boundMX = _marginBounds.nex;
		var boundmY = _marginBounds.swy;
		var boundMY = _marginBounds.ney;
		var drawedCnt = 0;
		//var d = [];
		
		var id = '';
		
		for(var i = startIdx; i < len; i++) {
			
			if(data[i].location[0] > boundMX) break;
			var y = data[i].location[1];

			if(y >= boundmY && y <= boundMY) {
				
				id = data[i]['id'];
				
				if(!id || !logMap[id] ){
					data[i]['id'] = hotplace.createUuid();
					logMap[data[i]['id']] = true;
					drawedCnt++;
					
					//weight 50점 밑으로는 만들지 않는다
					if(Math.ceil(data[i].weight) <= 50) {
						_notDrawedCells.push(data[i]);
						continue;
					}
					
					_cells.push(
						_drawRectangle(
							  data[i].location[1],
							  data[i].location[0],
							  data[i].location[3],
							  data[i].location[2], 
							  {
								  fillColor: _getColorByWeight(data[i].weight),
								  fillOpacity : 0.5
							  },
							  data[i]
						)
					);
					
				}
			}
		}
		
		console.log("drawedCnt ==> " + drawedCnt);
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
		}
		
		return returnObj;
	}
	
	function _initJiJeokDoLayer() {
		
		//지적편집도
		if(_venderStr == 'naver') {
			_vender._cadastralLayer = new _vender.CadastralLayer();
		}
	}
	
	function _showCellsLayer() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(!db.hasData(_currentLevel)) return;
		var startIdx = db.getStartXIdx(_marginBounds.swx, _currentLevel);
		
		_createCells(_currentLevel, startIdx);
	}
	
	maps.start = function() {
		_venderMap.setZoom(8);
		_venderMap.setCenter(new _vender.LatLng(37.566696, 126.977942));
		
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
				_venderMap = new _vender.Map(_container, {
				 	center: new _vender.LatLng(mapOptions.Y, mapOptions.X), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
			        zoom: mapOptions.level, //지도의 초기 줌 레벨
			        mapTypeControl: true,
			        mapTypeControlOptions: {
			        	style: _vender.MapTypeControlStyle.DROPDOWN
			        },
				});
				
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
		size = size || 0.01;
		
		if(_venderStr == 'naver') {
			_venderMap.panToBounds(new _vender.LatLngBounds(
	                new _vender.LatLng(lat - size, lng - size),
	                new _vender.LatLng(lat + size, lng + size)
	        ));
		}
		else if(_venderStr == 'daum') {
			_venderMap.panTo(new _vender.LatLngBounds(
	                new _vender.LatLng(lat - size, lng - size),
	                new _vender.LatLng(lat + size, lng + size)
	        ));
		}
		
		moveAfterFn();
	}
	
	maps.getMarker = function(lat, lng, listeners, content) {
		var newMarker = new _vender.Marker({
		    position: new _vender.LatLng(lat, lng),
		    map: _venderMap
		});
		
		var newInfoWindow = new _vender.InfoWindow({
	        content: '<div style="width:150px;text-align:center;padding:10px;">' + content +'</div>'
	    });
		
		_markers.push(newMarker);
		_infoWindowsForMarker.push(newInfoWindow);
		
		if(listeners) {
			for(var eventName in listeners) {
				_venderEvent.addListener(newMarker, eventName, function($$eventName, $$newInfoWindow) {
					return function(obj) {
						
						listeners[$$eventName](_venderMap, newMarker, $$newInfoWindow);
					}
				}(eventName, newInfoWindow));
			}
		}
	},
	
	maps.drawBounds = function() {
		if(_bndNmBnd.length != 0) {
			_bndNmBnd[0].setMap(null);
			_bndNmBnd[1].setMap(null);
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
		
	},
	
	maps.appendCell = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(db.hasData(_currentLevel)) {
			var startIdx = db.getStartXIdx(_marginBounds.swx, _currentLevel);
			_createCells(_currentLevel, startIdx);
		}
	};
	
	maps.initLayers = function(level) {
		_removeAllCells();
		_notDrawedCells = [];
		hotplace.dom.closeInfoWndowForCell();
		hotplace.database.initLevel(level);
	}
	
	
	maps.showCellsLayer = function() {
		
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(_venderMap) {
			
			if(db.isCached(_currentLevel)) {
				_showCellsLayer();
			}
			else {
				hotplace.getPlainText('sample/standard', {
					level: _currentLevel
				}, function(json) {
					try {
						db.setLevelData(_currentLevel, json.datas);
						console.log(json.datas);
						_showCellsLayer();
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
			_mapTypeLayers.jijeok = 'off';
		}
		else if(onOff == 'off') {
			if(_venderStr == 'naver') {
				_vender._cadastralLayer.setMap(_venderMap);
			}
			else if(_venderStr == 'daum') {
				_venderMap.addOverlayMapTypeId(_vender.MapTypeId.USE_DISTRICT);
			}
			
			$btn.data('switch', 'on');
			_mapTypeLayers.jijeok = 'on';
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
	
	/*
	 * 
	 * //http://www.jqueryscript.net/form/Smooth-Animated-Toggle-Control-Plugin-With-jQuery-Bootstrap-Bootstrap-Toggle.html*/
	function _initBootstrapToggle() {
		$('input[type="checkbox"]').bootstrapToggle();
	}
	
	function _makeInfoWndowForCell(vender, data) {
		var template = dom.getTemplate('cellForm');
		
		_infoWindowForCell = new vender.InfoWindow({
	        content: template(data)
	    });
		
		
		return _infoWindowForCell;
	}
	
	dom.openInfoWndowForCell = function(map, location, vender, data) {
		var win = _makeInfoWndowForCell(vender, data);
		win.open(map, location);
		
		//event handler가 걸려있는지 확인
		var ev = $._data(document.getElementById('btnCellClose'), 'events');
		if(!ev || !ev.click) {
			$('#btnCellClose').on('click', function(e) {
				dom.closeInfoWndowForCell();
			});
		}
	}
	
	dom.closeInfoWndowForCell = function() {
		if(_infoWindowForCell) {
			_infoWindowForCell.close();
			_infoWindowForCell = null;
		}
	}
	
	dom.createChart = function(id) {
		var ctx = document.getElementById(id);
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
		});
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
	},
	
	dom.closeBootstrapModal = function(selector) {
		$(selector).modal('toggle');
	}
	
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
	
	dom.getSelectOptions = function(data, title) {
		var len = data.length;
		var html = '<option value="">- ' + title + '  -</option>';
		for(var i=0; i < len; i++) {
			html += '<option value="' + data[i][0] + '">' + data[i][1] + '</option>'; 
		}
		
		return html;
	}
	
	dom.addButtonInMap = function(params) {
		
		var template = function(type){
			return (type == undefined) ?
					'<button id="{0}" type="button" class="btn btn-default" data-toggle="buttons" {1}>{2}</button>' :
					'<input type="checkbox" data-toggle="toggle" id="{0}" {1}>{2}';
		}
		
		if(params) {
			var len = params.length;
			var btns = '';
			
			for(var i=0; i<len; i++) {
				btns += template(params[i].type).format(params[i].id, params[i].dataAttr, params[i].title);
			}
			
			if(btns) {
				_btnMapDiv.html(btns);
				
				//event handler
				for(var i=0; i<len; i++) {
					$('#' + params[i].id).on((params[i].type == undefined) ? 'click' : 'change', params[i].callback);
				}
				
				
				_initBootstrapToggle();
			}
		}
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
		_db[level] = {}, _db[level].data = data, _db[level].log = {}; 
	}
	
	db.hasData = function(level) {
		if(_db[level] && _db[level].data && _db[level].data.length > 0) return true;
		return false;
	}
	
	db.getLevelData = function(level) {
		 return (_db[level]) ? _db[level].data : null;
	}
	
	db.getLevelLogMap = function(level) {
		return _db[level].log;
	}
	
	//레벨 변경시 rectangle을 그렸던 로그를 기록한 맵을 초기화 한다.
	db.initLevel = function(level) {
		if(_db[level]) {
			delete _db[level].log;
			_db[level].log = {};
		}
	}
}(
	hotplace.database = hotplace.database || {},
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
	
}(
	hotplace.test = hotplace.test || {},
	jQuery
));

