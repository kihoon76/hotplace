/**
 * @namespace hotplace.minimaps
 * */
(function(minimaps, $) {
	var mmaps = [];
	
	function _createDom() {
		//$('#map').html('<div id="minimap" style="width:200px;height:200px;"></div>');
	}
	
	minimaps.init = function(map, cnt) {
		
		for(var i=0; i<cnt; i++) {
			var id = 'minimap' + (i + 1), $id = $('#' + id);
			var year = $id.data('year');
			
			map.controls[naver.maps.Position.TOP_RIGHT].push($id.get(0));
			var minimap = new naver.maps.Map(id, { //미니맵 지도를 생성합니다.
			    bounds: map.getBounds(),
			    minZoom: 0,
			    scrollWheel: true,
			    scaleControl: false,
			    mapDataControl: false,
			    logoControl: false
			});
			
			/*naver.maps.Event.addListener(minimap, 'bounds_changed', function(bounds) {
				console.log(bounds);
			});*/
			_getData(map.getBounds(), minimap, 'GONGSI', year);
			
			mmaps.push(minimap);
		}
	};
	
	function _getData(bounds, map, type, year) {
		hotplace.getPlainText('locationbounds', {
			 level: 3,
			 swx  : bounds._min.x,
			 nex  : bounds._max.x,
			 swy  : bounds._min.y,
			 ney  : bounds._max.y,
			 year : year,
			 type : type
		}, function(json) {
			try {
				var data = json.datas;
				var len = data.length;
				
				for(var i=0; i<len; i++) {
					_drawRectangle(
						  data[i].location[1],
						  data[i].location[0],
						  data[i].location[3],
						  data[i].location[2], 
						  {
							  fillColor: hotplace.maps.getColorWeight(data[i].weight[0]),
							  fillOpacity : 0.5
						  },
						  map
					);
				}
				
			}
			catch(e) {
				throw e;
			}
		});
	}
	
	function _drawRectangle(swy, swx, ney, nex, css, map) {
	
		var rec = new naver.maps.Rectangle({
		    map: map,
		    bounds: new naver.maps.LatLngBounds(
	    		new naver.maps.LatLng(swy, swx),
	    		new naver.maps.LatLng(ney, nex) 
		    ),
		    strokeWeight: (css && css.strokeWeight != undefined) ? css.strokeWeight : 0, 
		    strokeColor:  (css && css.strokeColor != undefined) ? css.strokeColor : '#5347AA',
		    strokeOpacity: (css && css.strokeOpacity != undefined) ? css.strokeOpacity : 0.5,
		    fillColor: (css && css.fillColor != undefined) ? css.fillColor : 'rgb(255,051,000)',
		    fillOpacity: (css && css.fillOpacity != undefined) ? css.fillOpacity : 0.1,
		    clickable: true
		});

	}
}(
	hotplace.minimaps = hotplace.minimaps || {},
	jQuery	
));