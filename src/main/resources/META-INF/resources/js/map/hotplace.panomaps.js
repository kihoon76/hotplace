/**
 * @namespace hotplace.panomaps
 * */
(function(panomaps, $) {
	var pano = null;
	var marker = null;
	
	panomaps.createPanomaps = function(container, x, y, hasMarker, callback) {
		if(hasMarker) {
			marker = new naver.maps.Marker({
			    position: new naver.maps.LatLng(x, y)
			});
		}
		
		pano = new naver.maps.Panorama(container, {
	        position: new naver.maps.LatLng(x, y),
	        pov: {
	            pan: -135,
	            tilt: 29,
	            fov: 100
	        },
	        zoomControl: true,
	        zoomControlOptions: {
	            position: naver.maps.Position.TOP_RIGHT,
	            style: naver.maps.ZoomControlStyle.SMALL
	        }
	    });
		
		pano.zoomIn();
		//pano.setVisible(false);
		
		naver.maps.Event.addListener(pano, 'init', function() {
	        if(hasMarker) {
	        	marker.setMap(pano);
	        	 var proj = pano.getProjection();
	 	        var lookAtPov = proj.fromCoordToPov(marker.getPosition());
	 	        if (lookAtPov) {
	 	            pano.setPov(lookAtPov);
	 	        }
	        }
	        
	        if(callback) {
	        	var location = pano.getLocation();
	        	var msg = '<div>[출처: naver]</div><div>사진촬영일은  ' + location.photodate.substring(0,10) + ' 입니다.</div>';
	        	callback(location, msg);
	        }
	    });
	}
	
	
}(
	hotplace.panomaps = hotplace.panomaps || {},
	jQuery
));