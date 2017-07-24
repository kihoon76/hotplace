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
	
	
	function createHeatMap(hcode) {
		hcode = hcode || '11';
		if(_map) {
			
			$m.getPlainText('sample/standard', {
				hcode: hcode
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
	
	function createDotMap(hcode) {
		hcode = hcode || '11';
		if(_map) {
			$m.getPlainText('sample/standard', {
				hcode: hcode
			}, function(json) {
				_heatMap = new _mapVender.visualization.DotMap({
				    map: _map,
				    opacity: 0.3,
				    radius:10,
				    data: json.datas
				});
			});
		}
	}
	
	function createCellMap(hcode) {
		hcode = hcode || '11';
		if(_map) {
			$m.getPlainText('sample/standard', {
				hcode: hcode
			}, function(json) {
				createCellCircle(json.datas);
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
			    fillOpacity: 0.3,
			    radius: 500
			}));
		}
	}
	
	function getColorByWeight(weight) {
		var r = (2*(10*weight));
		console.log(r)
		
		return 'rgb(255,051,000)';
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
		showMap : function(type) {
			switch(type) {
			case 'heatmap' :
				createHeatMap();
				break;
			case 'dotmap' :
				createDotMap();
				break;
			case 'regionmap' :
				createRegionMap();
				break;
			case 'cellmap' :
				createCellMap();
				break;
			default :
				createHeatMap();
				break;
			}
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
			
			console.log('=================>' + _map.getZoom());
			moveAfterFn();
			//this.getMarker(lat, lng);
		
		},
		getMarker : function(lat, lng, listeners, content) {
			_markers.push(new _mapVender.Marker({
			    position: new _mapVender.LatLng(lat, lng),
			    map: _map
			}));
			
			_infoWindows.push(new _mapVender.InfoWindow({
		        content: '<div style="width:150px;text-align:center;padding:10px;">' + content +'</div>'
		    }));
			
			if(listeners) {
				var newMarker = _markers[_markers.length-1];
				var newInfoWindow = _infoWindows[_infoWindows.length-1];
				
				for(var eventName in listeners) {
					_mapVender.Event.addListener(newMarker, eventName, function(_eventName, _newInfoWindow) {
						return function(obj) {
							
							listeners[_eventName](_map, newMarker, _newInfoWindow);
						}
					}(eventName, newInfoWindow));
				}
			}
			
		}
	}
}(
	common.model
);