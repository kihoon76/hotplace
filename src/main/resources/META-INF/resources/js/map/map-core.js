var mapCore = function($m) {
	var ENUM = $m.ENUM;
	var map = null;
	
	return {
		load : function(mapOptions) {
			var curZoom = 3;
			mapOptions = mapOptions || {
				 //center: new naver.maps.LatLng(37.5512617, 127.0212664), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
				 	center: new naver.maps.LatLng(36.0207091, 127.9204629), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
			        zoom: curZoom, //지도의 초기 줌 레벨
			        mapTypeControl: true,
			        mapTypeControlOptions: {
			        	style: naver.maps.MapTypeControlStyle.DROPDOWN
			        }
			};
			map = new naver.maps.Map('map', mapOptions);
			
			var btn = $('#cadastral');
			
			//지적편집도
			var cadastralLayer = new naver.maps.CadastralLayer();
			naver.maps.Event.addListener(map, 'cadastralLayer_changed', function(cadastralLayer) {
			    if (cadastralLayer) {
			    	btn.removeClass('btn-default');
			        btn.addClass('btn-primary');
			    } else {
			        btn.removeClass('btn-primary');
			        btn.addClass('btn-default');
			    }
			});

			//cadastralLayer.setMap(map);

			btn.on("click", function(e) {
			    e.preventDefault();

			    if (cadastralLayer.getMap()) {
			        cadastralLayer.setMap(null);
			    } else {
			        cadastralLayer.setMap(map);
			    }
			});
			
			
			$m.ajax({
				url: 'sample/standard',
				dataType: 'text',
				success: function(data, textStatus, jqXHR) {
					var jo = $m.parseJSON(data);
					$(document).trigger('mapLoaded', [map, jo.datas, curZoom]);
					
				},
				fail:function() {
					
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