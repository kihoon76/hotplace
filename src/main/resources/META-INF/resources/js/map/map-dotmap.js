$(document).on('mapLoaded', function(e, map, datas, curZoom) {
	var radiusPerZoom = {3 : 10, 4 : 15, 5 : 20, 6 : 25,	7 : 30,	8 : 35,	9 : 40,	10 : 45};
	
	var dotMap = new naver.maps.visualization.DotMap({
	    map: map,
	    opacity: 0.3,
	    radius:10,
	    data: datas
	});
	
	naver.maps.Event.addListener(map, 'zoom_changed', function(zoom) {
		
		//dotMap.setOptions('radius', radiusPerZoom[curZoom]);
		console.log(zoom);
		curZoom = zoom;
	});
	
	var idx = 0;
	var circles = [];
	var markers = [];
	//var listeners = [];
	var infoWindows = [];
	
	var listener = naver.maps.Event.addListener(map, 'click', function(e) {
		
		
		infoWindows.push(new naver.maps.InfoWindow({
	        content: '<div style="width:150px;text-align:center;padding:10px;">위도 </div>'
	    }));
		
	    markers.push(new naver.maps.Marker({
	        position: new naver.maps.LatLng(e.coord.y, e.coord.x),
	        map: map,
	        clickable: true,
	        __gIdx: idx
	    }));
	    
	    naver.maps.Event.addListener(markers[idx], 'dblclick', function(e) {
	    	var gIdx = e.overlay.__gIdx;
	    	markers[gIdx].setMap(null);
	    	circles[gIdx].setMap(null);
	    	infoWindows[gIdx].setMap(null);
	    	//naver.maps.Event.removeListener(listeners[gIdx]);
	    });
	    
	    naver.maps.Event.addListener(markers[idx], 'mouseover', function(e) {
	    	console.log(e);
	    	var gIdx = e.overlay.__gIdx;
	    	infoWindows[gIdx].open(map, markers[gIdx]);
	    });
	    
	    circles.push(new naver.maps.Circle({
		    map: map,
		    center: new naver.maps.LatLng(e.coord.y, e.coord.x),
		    radius: 200,

		    strokeColor: '#5347AA',
		    strokeOpacity: 0.5,
		    strokeWeight: 2,
		    fillColor: '#E51D1A',
		    fillOpacity: 0.3
		}));
		
	    idx++;
	});
});