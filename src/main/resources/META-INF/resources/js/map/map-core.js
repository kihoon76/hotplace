var mapApi = function($m) {
	var ENUM = $m.ENUM;
	var map = null;
	
	return {
		load : function(mapOptions) {
			var curZoom = 3;
			mapOptions = mapOptions || {
				 center: new naver.maps.LatLng(36.0207091, 127.9204629), //지도의 초기 중심 좌표
			        zoom: curZoom, //지도의 초기 줌 레벨
			        zoomControl: true,
			        //minZoom: 3, //지도의 최소 줌 레벨
			        /*zoomControl: true, //줌 컨트롤의 표시 여부
			        zoomControlOptions: { //줌 컨트롤의 옵션
			            position: naver.maps.Position.TOP_RIGHT
			        }*/
			};
			map = new naver.maps.Map('map', mapOptions);
			
			$m.ajax({
				url: 'sample/standard',
				dataType: 'text',
				success: function(data, textStatus, jqXHR) {
					console.log(data);
					var jo = $.parseJSON(data);
					console.log(jo);
					createHeatMap(jo.datas);
					//createHeatMap(data.datas[0].coordinates);
				},
				fail:function() {
					
				}
			});
			
			var raiusPerZoom = {
				3 : 10,
				4 : 20,
				5 : 30,
				6 : 40,
				7 : 50,
				8 : 60,
				9 : 70,
				10 : 80
			}
			
			
			
			var heatmap = null;
			function createHeatMap(data) {
				console.log(data);
				heatmap = new naver.maps.visualization.HeatMap({
				    map: map,
				    data: data,
				    opacity:0.6,
				    radius:10
				});
			} 
			
			//zoom event
		    naver.maps.Event.addListener(map, 'zoom_changed', function(zoom) {
		        console.log(zoom);
		    	
		        heatmap.setOptions('radius', raiusPerZoom[zoom]);
		    	if(zoom > 2) {
		    		curZoom = zoom;
		    	}
		    	else {
		    		map.setOptions('zoom', curZoom);
		    		heatmap.setOptions('radius', raiusPerZoom[curZoom]);
		    	}
		    });

		},
		testClass: function() {
			var f = function() {}
			
			f.prototype = new naver.maps.KVO();
			f.prototype.constructor = f;
			
			f.prototype.getZoom = function() {
				
			}
			
			return f;
		},
		
	}
}(
	common.model
);