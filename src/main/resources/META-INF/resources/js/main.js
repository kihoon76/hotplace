$(document).ready(function($m) {
	var regionHeatData = {};
	var _curZoom;
	
	function loadHeatRegion(hcode) {
		$m.ajax({
			url: 'sample/standard',
			dataType: 'text',
			data: {
				acode: hcode
			},
			success: function(data, textStatus, jqXHR) {
				var jo = $m.parseJSON(data);
				regionHeatData[hcode] = jo.datas;
				mapCore.showMap(0, jo.datas, hcode);
			},
			error: function() {
				
			}
		});
	}

	function setMinZoom(minZoom, map, zoom) {
		
		if(zoom > minZoom) {
			_curZoom = zoom;
		}
		else {
			map.setOptions('zoom', _curZoom);
		}
	}
	
	mapCore.event.onMaploaded(function(map) {
		_curZoom = map.getZoom();
		var mapType = $('body').data('mtype');
		/*naver.maps.Event.addListener(map, 'zoom_changed', function(zoom) {
			if(zoom > 2) {
				curZoom = zoom;
			}
			else {
				map.setOptions('zoom', curZoom);
			}
			
			var heatMaps = mapCore.getHeatMaps();
			
			//_heatMap.setOptions('radius', getRadiusPerZoom(curZoom));
			
			mapCore.getData({
				acode: '11'
			}, function(data) {
				//console.log(_heatMap.getData());
				//_heatMap.setData([]);
				//_heatMap.redraw();
				//console.log(_heatMap.getData());
				var heatMaps = mapCore.getHeatMaps();
				for(var hcode in mapCore.getHeatMaps()) {
					if(hcode == '11') {
						heatMaps[hcode].setData(data);
					}
					else {
						heatMaps[hcode].setData([]);
					}
					
					heatMaps[hcode].redraw();
				}
				
				console.log(heatMaps);
	
			});
			heatMaps['42'].setMap(null);
			heatMaps['42'] = new naver.maps.visualization.HeatMap({
			    map: map,
			    data: [{"weight":3.8,"location":[126.96652977600,37.59160773240]},{"weight":2.4,"location":[126.96742719400,37.59011233640]},{"weight":5.1,"location":[126.96677552300,37.58896609250]},{"weight":9.1,"location":[126.96863203200,37.58983876110]},{"weight":7.6,"location":[126.96912579100,37.58960463330]},{"weight":8.6,"location":[126.96928841500,37.59062820300]},{"weight":4.8,"location":[126.96991813600,37.59017786900]},{"weight":8.2,"location":[126.96856925000,37.58835390880]},{"weight":3.2,"location":[126.96917188300,37.58766210540]},{"weight":6.8,"location":[126.96959352900,37.58653056790]},{"weight":6,"location":[126.96896834800,37.58702414920]},{"weight":0.6,"location":[126.96851111600,37.58659155160]},{"weight":6.3,"location":[126.96903657400,37.58631418480]},{"weight":0.8,"location":[126.96778640300,37.58682921810]},{"weight":5.6,"location":[126.96703452400,37.58703804090]},{"weight":0.6,"location":[126.96848353000,37.58757182440]},{"weight":7.3,"location":[126.96620600600,37.58646117120]},{"weight":9,"location":[126.96624255700,37.58575119920]},{"weight":3,"location":[126.96841175000,37.58595722600]},{"weight":5.8,"location":[126.97081668800,37.58556140820]},{"weight":1.8,"location":[126.97265042800,37.58667187060]},{"weight":9.7,"location":[126.97152777300,37.58537777930]},{"weight":9.3,"location":[126.97236094200,37.58570233480]},{"weight":7.9,"location":[126.97034117600,37.58554326980]},{"weight":0.3,"location":[126.96994285700,37.58501698910]},{"weight":3.4,"location":[126.96694027900,37.58509186980]},{"weight":1.3,"location":[126.96574931300,37.58489691570]},{"weight":4.6,"location":[126.96738901600,37.58419100150]},{"weight":3.2,"location":[126.96637008900,37.58413665600]},{"weight":9.3,"location":[126.96834466100,37.58396781530]},{"weight":2.5,"location":[126.96813186600,37.58384522300]},{"weight":2.4,"location":[126.96845808100,37.58348491330]},{"weight":2.7,"location":[126.96926429000,37.58321122400]},{"weight":2.6,"location":[126.96877523900,37.58311739230]},{"weight":1.1,"location":[126.96922329200,37.58379505700]},{"weight":2.3,"location":[126.96990273100,37.58344564680]},{"weight":7.5,"location":[126.97007029600,37.58343127350]},{"weight":6.4,"location":[126.96997931400,37.58445117470]},{"weight":6.5,"location":[126.96961248100,37.58447270470]},{"weight":2.9,"location":[126.97231594100,37.58492747020]},{"weight":6.2,"location":[126.97082615300,37.58451625860]},{"weight":6.6,"location":[126.97128841500,37.58364421050]},{"weight":7.8,"location":[126.97135256600,37.58168726830]},{"weight":2.1,"location":[126.97162869900,37.58196844500]},{"weight":8.5,"location":[126.97180518700,37.58230005290]},{"weight":3.4,"location":[126.97103078800,37.58233950910]},{"weight":2.8,"location":[126.97101702800,37.58279000240]},{"weight":6.1,"location":[126.97069980600,37.58335214400]},{"weight":9.2,"location":[126.97137465800,37.58312525920]},{"weight":4.3,"location":[126.97170534600,37.58286224890]}],
			    opacity:0.1,
			    radius: 20
			});
			
			//heatMaps['42'].setData([{"weight":3.8,"location":[126.96652977600,37.59160773240]},{"weight":2.4,"location":[126.96742719400,37.59011233640]},{"weight":5.1,"location":[126.96677552300,37.58896609250]},{"weight":9.1,"location":[126.96863203200,37.58983876110]},{"weight":7.6,"location":[126.96912579100,37.58960463330]},{"weight":8.6,"location":[126.96928841500,37.59062820300]},{"weight":4.8,"location":[126.96991813600,37.59017786900]},{"weight":8.2,"location":[126.96856925000,37.58835390880]},{"weight":3.2,"location":[126.96917188300,37.58766210540]},{"weight":6.8,"location":[126.96959352900,37.58653056790]},{"weight":6,"location":[126.96896834800,37.58702414920]},{"weight":0.6,"location":[126.96851111600,37.58659155160]},{"weight":6.3,"location":[126.96903657400,37.58631418480]},{"weight":0.8,"location":[126.96778640300,37.58682921810]},{"weight":5.6,"location":[126.96703452400,37.58703804090]},{"weight":0.6,"location":[126.96848353000,37.58757182440]},{"weight":7.3,"location":[126.96620600600,37.58646117120]},{"weight":9,"location":[126.96624255700,37.58575119920]},{"weight":3,"location":[126.96841175000,37.58595722600]},{"weight":5.8,"location":[126.97081668800,37.58556140820]},{"weight":1.8,"location":[126.97265042800,37.58667187060]},{"weight":9.7,"location":[126.97152777300,37.58537777930]},{"weight":9.3,"location":[126.97236094200,37.58570233480]},{"weight":7.9,"location":[126.97034117600,37.58554326980]},{"weight":0.3,"location":[126.96994285700,37.58501698910]},{"weight":3.4,"location":[126.96694027900,37.58509186980]},{"weight":1.3,"location":[126.96574931300,37.58489691570]},{"weight":4.6,"location":[126.96738901600,37.58419100150]},{"weight":3.2,"location":[126.96637008900,37.58413665600]},{"weight":9.3,"location":[126.96834466100,37.58396781530]},{"weight":2.5,"location":[126.96813186600,37.58384522300]},{"weight":2.4,"location":[126.96845808100,37.58348491330]},{"weight":2.7,"location":[126.96926429000,37.58321122400]},{"weight":2.6,"location":[126.96877523900,37.58311739230]},{"weight":1.1,"location":[126.96922329200,37.58379505700]},{"weight":2.3,"location":[126.96990273100,37.58344564680]},{"weight":7.5,"location":[126.97007029600,37.58343127350]},{"weight":6.4,"location":[126.96997931400,37.58445117470]},{"weight":6.5,"location":[126.96961248100,37.58447270470]},{"weight":2.9,"location":[126.97231594100,37.58492747020]},{"weight":6.2,"location":[126.97082615300,37.58451625860]},{"weight":6.6,"location":[126.97128841500,37.58364421050]},{"weight":7.8,"location":[126.97135256600,37.58168726830]},{"weight":2.1,"location":[126.97162869900,37.58196844500]},{"weight":8.5,"location":[126.97180518700,37.58230005290]},{"weight":3.4,"location":[126.97103078800,37.58233950910]},{"weight":2.8,"location":[126.97101702800,37.58279000240]},{"weight":6.1,"location":[126.97069980600,37.58335214400]},{"weight":9.2,"location":[126.97137465800,37.58312525920]},{"weight":4.3,"location":[126.97170534600,37.58286224890]}]);
			//heatMaps['42'].redraw();
			
		});*/
		
		mapCore.showMap(mapType);
		mapCore.showLandMark();
		//mapCore.showMap($('#mapType').data('mtype'));
	});
	
	
	return function() {
		/*mapCore.load(daum.maps, {
			center: new daum.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
			level: 3 //지도의 레벨(확대, 축소 정도)
		});*/
		
		mapCore.load(naver.maps, {
		 	center: new naver.maps.LatLng(36.0207091, 127.9204629), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
	        zoom: 3, //지도의 초기 줌 레벨
	        mapTypeControl: true,
	        mapTypeControlOptions: {
	        	style: naver.maps.MapTypeControlStyle.DROPDOWN
	        }
		},{			
			'zoom_changed' : function(map, heatmap, arr) {
				setMinZoom(2,map, arr[0]); //arr[0] : zoom
			},
			'idle' : function(map, heatmap, arr) { //지도의 움직임이 종료되었을 때(유휴 상태) 이벤트가 발생합니다.
				console.log('stop');
			},
			'bounds_changed' : function(map, heatmap, arr) {
				console.log(arr[0])
			}
		});
		
		/*mapCore.load(google.maps, {
			center: {lat: 36.0207091, lng: 127.9204629},
	          zoom: 8
		});*/
	}
}(
	common.model
));