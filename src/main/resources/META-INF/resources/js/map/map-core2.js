var mapCore = function($m) {
	var ENUM = $m.ENUM;
	var _map = null;
	var _markers = [];
	var _infoWindows = [];
	var _cells = [];
	
	var _heatMap = null;//{};
	var _dotMap = null;
	var _regionDataCache = {};
	
	var _mapVender = null;
	
	/*
	 * naver zoom : 3 ~ 13 레벨까지만 사용 [1 ~ 14]*/
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
	
	
	function createHeatMap(level) {
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
	
	function createDotMap(level) {
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
	
	function createCellMap(level) {
		//console.log('oo');
		if(_map) {
			$m.getPlainText('sample/standard', {
				level: level
			}, function(json) {
				//createCellCircle(json.datas);
				createCellRectangle(json.datas);
			});
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
	
	function createCellRectangle(datas) {
		
		for(var i=_cells.length-1; i>=0; i--) {
			console.log(i);
			if(_cells[i]){
				_cells[i].setMap(null);
				delete _cells[i]; 
			}
		}
		
		var len = datas.length;
		for(var i = 0; i < len; i++) {
			var obj = datas[i];
			_cells.push(new _mapVender.Rectangle({
			    map: _map,
			    bounds: new _mapVender.LatLngBounds(
		    		new _mapVender.LatLng(obj.location[1], obj.location[0]),
		    		new _mapVender.LatLng(obj.location[3], obj.location[2]) 
			    ),
			    //strokeWeight:0, //테두리 없앰
			    strokeColor: '#5347AA',
			    //strokeOpacity: 0.5,
			    strokeWeight: 1,
			    //fillColor: 'rgb(255,051,000)',
			    fillColor: getColorByWeight(obj.weight),
			    fillOpacity: 0.7,
			}));
		}
	}
	
	function getColorByWeight(weight) {
		var r = (25.5*weight).toFixed(0);
		console.log(r)
		
		return 'rgb(' + r + ',051,000)';
	}
	
	function createRegionMap() {
		if(_map) {
			$m.getJson('resources/json/region00.json', null, function(boundaryData) {
				var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');

				tooltip.appendTo(_map.getPanes().floatPane);
				_map.data.setStyle(function(feature) {
			        var styleOptions = {
			            fillColor: '#f3f4eb',//'#ff0000',
			            fillOpacity: 0.0001,
			            strokeColor: '#ff0000',
			            strokeWeight: 2,
			            strokeOpacity: 0.5
			        };

			        if (feature.getProperty('focus')) {
			            styleOptions.fillOpacity = 0.6;
			            styleOptions.fillColor = '#ebedd5';//'#0f0';
			            styleOptions.strokeColor = '#0f0';
			            styleOptions.strokeWeight = 4;
			            styleOptions.strokeOpacity = 1;
			        }

			        return styleOptions;
			    });

			  
			   _map.data.addGeoJson(boundaryData);
			    
			   _map.data.addListener('click', function(e) {
			        /*var feature = e.feature;

			        if (feature.getProperty('focus') !== true) {
			            feature.setProperty('focus', true);
			        } else {
			            feature.setProperty('focus', false);
			        }*/
				   
			    });

			    _map.data.addListener('mouseover', function(e) {
			        var feature = e.feature,
			            regionName = feature.getProperty('area1');

			        tooltip.css({
			            display: '',
			            left: e.offset.x,
			            top: e.offset.y
			        }).text(regionName);

			        _map.data.overrideStyle(feature, {
			            fillOpacity: 0.6,
			            strokeWeight: 4,
			            strokeOpacity: 1
			        });
			    });

			    _map.data.addListener('mouseout', function(e) {
			        tooltip.hide().empty();
			        _map.data.revertStyle();
			    });
			});
		}
	}
	
	return {
		/*
		 * listeners : {
		 * 	zoom_changed : function() {}
		 * }*/
		load : function(mapVender, mapOptions, listeners) {
			
			if(!mapVender) throw new Error('맵 벤더가 존재하지 않습니다');
			
			if(!mapVender.Map) throw Error('맵이 존재하지 않습니다');
			
			_mapVender = mapVender;
			_map = new mapVender.Map(document.getElementById('map'), mapOptions);
			
			if(listeners) {
				for(var eventName in listeners) {
					mapVender.Event.addListener(_map, eventName, function(e) {
						return function(obj) {
							listeners[e](_map, _heatMap, [obj]);
						}
						
					}(eventName));
				}
			}
			
			$(document).trigger('onMaploaded', [_map]);
		},
		showMap : function(type, level) {
			switch(type) {
			case 'heatmap' :
				createHeatMap(level);
				break;
			case 'dotmap' :
				createDotMap(level);
				break;
			case 'regionmap' :
				createRegionMap(level);
				break;
			case 'cellmap' :
				createCellMap(level);
				break;
			default :
				createHeatMap(level);
				break;
			}
		},
		showLandMark: function() {
			var btn = $('#cadastral');
			
			//지적편집도
			var cadastralLayer = new _mapVender.CadastralLayer();
			_mapVender.Event.addListener(map, 'cadastralLayer_changed', function(cadastralLayer) {
			    if (cadastralLayer) {
			    	btn.removeClass('btn-default');
			        btn.addClass('btn-primary');
			    } else {
			        btn.removeClass('btn-primary');
			        btn.addClass('btn-default');
			    }
			});

			btn.on("click", function(e) {
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
		
	}
}(
	common.model
);