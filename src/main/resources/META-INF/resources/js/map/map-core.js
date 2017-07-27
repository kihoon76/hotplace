var mapCore = function($m, $mapData) {
	var _map = null,
	_markers = [],
	_infoWindows = [],
	_cells = [],
	_heatMap = null,
	_dotMap = null,
	_mapVender = null,
	_currentBounds = null,
	_marginBounds = null,
	_bndNmBnd = []; //bound와 margin bound
	
	/*
	 * naver zoom : 3 ~ 13 레벨까지만 사용 [1 ~ 14]
	 * */
	function getRadiusPerZoom(level) {
		var v = {3 : 10, 4 : 20, 5 : 30, 6 : 40,	7 : 50,	8 : 60,	9 : 70,	10 : 80}
		
		if(level > 2 && level < 14) {
			return v[level];
		}
		
		return 0;
	}
	
	function adjustHeatMapRadius() {
		_heatMap.setOptions('radius', raiusPerZoom[curZoom]);
	}
	
	function createHeatMapLayer(level) {
		if(_map) {
			
			$m.getPlainText('sample/standard', {
				level: level
			}, function(json) {
				_heatMap = new _mapVender.visualization.HeatMap({
				    map: _map,
				    data: json.datas,
				    opacity:0.5,
				    radius: 20
				});
			});
		}
	}
	
	function createDotMapLayer(level) {
		if(_map) {
			$m.getPlainText('sample/standard', {
				level: level
			}, function(json) {
				_dotMap = new _mapVender.visualization.DotMap({
				    map: _map,
				    opacity: 0.3,
				    radius:10,
				    data: json.datas
				});
			});
		}
	}
	
	function createCellMapLayer(level) {
		if(_map) {
			
			removeAllCells();
			
			if(false) {
				
			}
			else {
				$m.getPlainText('sample/standard', {
					level: level
				}, function(json) {
					$mapData.setLevelData(level, json.datas);
					
					if(!$mapData.hasData(level)) return;
					var startIdx = $mapData.getStartXIdx(_marginBounds.swx, level);
					
					console.log('_marginBounds.swx : ' + _marginBounds.swx);
					console.log('_marginBounds.nex : ' + _marginBounds.nex);
					console.log('_marginBounds.swy : ' + _marginBounds.swy);
					console.log('_marginBounds.ney : ' + _marginBounds.ney);
					console.log('datas====');
					console.log($mapData.getLevelData(level));
					console.log('datas====');
					createCellRectangle(level, startIdx);
				});
			}
		}
	}
	
	function createCellCircle(datas) {
		var len = datas.length;
		for(var i = 0; i < len; i++) {
			var obj = datas[i];
			_cells.push(new _mapVender.Circle({
			    map: _map,
			    center: new _mapVender.LatLng(obj.location[1], obj.location[0]),
			    
			    //strokeWeight:0, //테두리 없앰
			    //strokeColor: '#5347AA',
			    //strokeOpacity: 0.5,
			    strokeWeight: 0,
			    fillColor: 'rgb(255,051,000)',
			    //fillColor: getColorByWeight(obj.weight),
			    fillOpacity: 0.3,
			    radius: 500
			}));
		}
	}
	
	/*
	 * 한 레벨에서 그린  Rectangle 삭제
	 */
	function removeAllCells() {
		for(var i=_cells.length-1; i>=0; i--) {
			if(_cells[i]){
				_cells[i].setMap(null);
				delete _cells[i]; 
			}
		}
	}
	

	function createCellRectangle(level, startIdx) {
		
		var data = $mapData.getLevelData(level);
		var len = data.length;
		
		var boundMX = _marginBounds.nex;
		var boundmY = _marginBounds.swy;
		var boundMY = _marginBounds.ney;
		var drawedCnt = 0;
		
		for(var i = startIdx; i < len; i++) {
			
			if(data[i].location[0] > boundMX) break;
			var y = data[i].location[1];

			if(y >= boundmY && y <= boundMY) {
				if(!data[i]['drawed']){
					data[i]['drawed'] = true;
					drawedCnt++;
					
					_cells.push(
							drawRectangle(data[i].location[1],
										  data[i].location[0],
										  data[i].location[3],
										  data[i].location[2], 
										  {
											fillColor: getColorByWeight(data[i].weight),
											fillOpacity : 0.7
										  }
							)
					);
					
				}
			}
		}
		
		console.log("drawedCnt ==> " + drawedCnt);
	}
	
	function drawRectangle(swy, swx, ney, nex, css) {
		return new _mapVender.Rectangle({
		    map: _map,
		    bounds: new _mapVender.LatLngBounds(
	    		new _mapVender.LatLng(swy, swx),
	    		new _mapVender.LatLng(ney, nex) 
		    ),
		    strokeWeight: (css && css.strokeWeight != undefined) ? css.strokeWeight : 0, 
		    strokeColor:  (css && css.strokeColor != undefined) ? css.strokeColor : '#5347AA',
		    strokeOpacity: (css && css.strokeOpacity != undefined) ? css.strokeOpacity : 0.5,
		    fillColor: (css && css.fillColor != undefined) ? css.fillColor : 'rgb(255,051,000)',
		    fillOpacity: (css && css.fillOpacity != undefined) ? css.fillOpacity : 0.1
		});
	}
	
	function getColorByWeight(weight) {
		var r = (25.5*weight).toFixed(0);
		return 'rgb(' + r + ',051,000)';
	}
	
	/*
	 *  테스트 용도
	 * */
	/**************************************************************************************************/
	var _testMarker = {};
	function showMarker(level) {
		
		var datas = $mapData.getLevelData(level);
		console.log(datas);
		if(!_testMarker[level]) _testMarker[level] = []; 
		if(_testMarker[level].length == 0) {
			for(var i=0; i<datas.length; i++) {
				_testMarker[level].push(new naver.maps.Marker({
				    position: new naver.maps.LatLng(datas[i].location[1], datas[i].location[0]),
				    map: _map
				}));
			}
		}
		else {
			$.each(_testMarker[level], function(idx, value) {
				value.setMap(_map);
			});
		}
	}
	
	function hideMarker(level) {
		$.each(_testMarker[level], function(idx, value) {
			value.setMap(null);
		});
	}
	
	$('#btnTest').on('click', function() {
		var sw = $(this).data('switch');
		$(this).data('switch', ((sw == 'on') ? 'off' : 'on'));
		if(sw == 'off') {
			showMarker(_map.getZoom());
		}
		else {
			hideMarker(_map.getZoom())
		}
		
	});
	/**************************************************************************************************/
	

	
	
	return {
		testInit: function(){_testMarker={}},
		/*
		 * listeners : {
		 * 	zoom_changed : function() {}
		 * }
		 * */
		load : function(mapVender, mapOptions, listeners) {
			
			if(!mapVender) throw new Error('맵 벤더가 존재하지 않습니다');
			
			if(!mapVender.Map) throw Error('맵이 존재하지 않습니다');
			
			_mapVender = mapVender;
			_map = new mapVender.Map(document.getElementById('map'), mapOptions);
			
			if(listeners) {
				for(var eventName in listeners) {
					mapVender.Event.addListener(_map, eventName, function(e) {
						return function(obj) {
							listeners[e](_map, [obj]);
						}
						
					}(eventName));
				}
			}
			
			$(document).trigger('onMaploaded', [_map]);
		},
		showLayer : function(type, level) {
			switch(type) {
			case 'heatmap' :
				createHeatMapLayer(level);
				break;
			case 'dotmap' :
				createDotMapLayer(level);
				break;
			case 'cellmap' :
				createCellMapLayer(level);
				break;
			default :
				createHeatMapLayer(level);
				break;
			}
		},
		showJiJeokDo: function() {
			var btn = $('#cadastral');
			
			//지적편집도
			var cadastralLayer = new _mapVender.CadastralLayer();
			_mapVender.Event.addListener(map, 'cadastralLayer_changed', function(cadastralLayer) {
			    if (cadastralLayer) {
			    	btn.removeClass('btn-default');
			        btn.addClass('btn-primary');
			    } 
			    else {
			        btn.removeClass('btn-primary');
			        btn.addClass('btn-default');
			    }
			});

			btn.on('click', function(e) {
			    e.preventDefault();

			    if (cadastralLayer.getMap()) {
			        cadastralLayer.setMap(null);
			    } 
			    else {
			        cadastralLayer.setMap(_map);
			    }
			});
		},
		event : {
			onMaploaded : function(f) {
				
				$(document).on('onMaploaded', function(e, map) {
					if(!map) throw new Error('맵이 존재하지 않습니다');
					f(map);
				});
			},
			onMapmoved : function() {
				
			}
		},
		toMove: function(lat, lng, size, moveAfterFn) {
			/*_map.panToBounds(new naver.maps.LatLngBounds(
	                new naver.maps.LatLng(37.42829747263545, 126.76620435615891),
	                new naver.maps.LatLng(37.7010174173061, 127.18379493229875)));*/
			
			//_map.panTo(new naver.maps.LatLng(lat, lng));
			
			size = size || 0.001;
			_map.panToBounds(new _mapVender.LatLngBounds(
	                new _mapVender.LatLng(lat - size, lng - size),
	                new _mapVender.LatLng(lat + size, lng + size)
	        ));
			
			moveAfterFn();
		},
		getMarker : function(lat, lng, listeners, content) {
			var newMarker = new _mapVender.Marker({
			    position: new _mapVender.LatLng(lat, lng),
			    map: _map
			});
			
			var newInfoWindow = new _mapVender.InfoWindow({
		        content: '<div style="width:150px;text-align:center;padding:10px;">' + content +'</div>'
		    });
			
			_markers.push(newMarker);
			_infoWindows.push(newInfoWindow);
			
			if(listeners) {
				for(var eventName in listeners) {
					_mapVender.Event.addListener(newMarker, eventName, function(_eventName, _newInfoWindow) {
						return function(obj) {
							
							listeners[_eventName](_map, newMarker, _newInfoWindow);
						}
					}(eventName, newInfoWindow));
				}
			}
			
		},
		setCurrentBounds: function(bounds) {
			if(bounds) {
				var diff = 0.01;
				_currentBounds = {
					'swx' : parseFloat(bounds._sw.x),
					'swy' : parseFloat(bounds._sw.y),
					'nex' : parseFloat(bounds._ne.x),
					'ney' : parseFloat(bounds._ne.y)
				};
				
				_marginBounds = {
					'swx' : _currentBounds.swx - diff,
					'swy' : _currentBounds.swy - diff,
					'nex' : _currentBounds.nex + diff,
					'ney' : _currentBounds.ney + diff
				}
			
				/*console.log('swx : '+ _currentBounds.swx)
				console.log('swy : '+ _currentBounds.swy)
				console.log('nex : '+ _currentBounds.nex)
				console.log('ney : '+ _currentBounds.ney)
				
				console.log('swx2 : '+ _marginBounds.swx)
				console.log('swy2 : '+ _marginBounds.swy)
				console.log('nex2 : '+ _marginBounds.nex)
				console.log('ney2 : '+ _marginBounds.ney)*/
				
				mapCore.drawBounds();
			}
		},
		appendRectangle: function(level) {
			
			if($mapData.hasData(level)) {
				var startIdx = $mapData.getStartXIdx(_marginBounds.swx, level);
				createCellRectangle(level, startIdx);
			}
			
		},
		drawBounds : function() {
			if(_bndNmBnd.length != 0) {
				_bndNmBnd[0].setMap(null);
				_bndNmBnd[1].setMap(null);
				_bndNmBnd = [];
			}
			
			_bndNmBnd.push(drawRectangle(_currentBounds.swy, _currentBounds.swx, _currentBounds.ney, _currentBounds.nex,{
			    strokeColor: '#5347AA',
			    strokeWeight: 2,
			    fillColor: '#BBBBBB',
			    fillOpacity: 0.1,
			}));
			
			_bndNmBnd.push(drawRectangle(_marginBounds.swy, _marginBounds.swx, _marginBounds.ney, _marginBounds.nex,{
			    strokeColor: '#5347AA',
			    strokeWeight: 2,
			    fillColor: '#EEEEEE',
			    fillOpacity: 0.1,
			}));
			
		},
		getMarginBounds: function() {
			return _marginBounds;
		}
		
	}
}(
	common.model,
	mapData
);