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