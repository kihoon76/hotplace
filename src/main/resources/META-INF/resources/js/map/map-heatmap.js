$(document).on('mapLoaded', function(e, map, datas, curZoom) {
	
	var raiusPerZoom = {3 : 10, 4 : 20, 5 : 30, 6 : 40,	7 : 50,	8 : 60,	9 : 70,	10 : 80}
	
	var heatmap = new naver.maps.visualization.HeatMap({
	    map: map,
	    data: datas,
	    opacity:0.1,
	    radius:10
	});
	
	naver.maps.Event.addListener(map, 'zoom_changed', function(zoom) {
		heatmap.setOptions('radius', raiusPerZoom[zoom]);
		if(zoom > 2) {
			curZoom = zoom;
		}
		else {
			map.setOptions('zoom', curZoom);
			heatmap.setOptions('radius', raiusPerZoom[curZoom]);
		}
	});
	
});