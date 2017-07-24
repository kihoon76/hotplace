/**
 * 
 */
$(document).ready(function($m, $map) {
	
	var addrObj = {
		type : 'R', //R: 도로명, N:지번주소
		si : '',
		gugun: '',
		region: ''
	}

	var sourceAddress = $('#address_template').html();
	var templateAddress = Handlebars.compile(sourceAddress);
	
	function modalClose(selector) {
		$(selector).modal('toggle');
	}
	
	function makeOption(data, title) {
		var len = data.length;
		var html = '<option value="">- ' + title + '  -</option>';
		for(var i=0; i < len; i++) {
			html += '<option value="' + data[i][0] + '">' + data[i][1] + '</option>'; 
		}
		
		return html;
	}
	
	// 주소검색 도로명/지번 선택
	$('#addrType').on('click', function(e){
		addrObj.type = $(e.target).data('type');
		
		addrObj.si = '';
		addrObj.gugun = '';
	});
	
	$('#selRsido').on('change', function(e) {
		var selObj = e.target;
		addrObj.si = $(this).val();
		addrObj.gugun = '';
		
		if(!addrObj.si) {
			$('#selRgugun').html(makeOption([], '시군구'));
		}
		else {
			$m.getPlainText('address', addrObj, function(data) {
				$('#selRgugun').html(makeOption(data, '시군구'));
			});
		}
	});
	
	$('#selRgugun').on('change', function(e) {
		var selObj = e.target;
		addrObj.gugun = $(this).val();
		$m.getPlainText('address', addrObj, function(data) {
			//$('#selRgugun').html(makeOption(data, '시군구'));
		});
	});
	
	$('#selNsido').on('change', function(e) {
		var selObj = e.target;
		addrObj.si = $(this).val();
		addrObj.gugun = '';
		
		if(!addrObj.si) {
			$('#selNgugun').html(makeOption([], '시군구'));
		}
		else {
			$m.getPlainText('address/condition', addrObj, function(data) {
				$('#selNgugun').html(makeOption(data, '시군구'));
			});
		}
	});
	
	$('#selNgugun').on('change', function(e) {
		var selObj = e.target;
		addrObj.gugun = $(this).val();
		addrObj.region = '';
		
		if(!addrObj.gugun) {
			$('#selName').html(makeOption([], '지역명'));
		}
		else {
			$m.getPlainText('address/condition', addrObj, function(data) {
				$('#selName').html(makeOption(data, '지역명'));
			});
		}
		
	});
	
	$('#selName').on('change', function(e) {
		var selObj = e.target;
		addrObj.region = $(this).val();
	});
	
	
	//검색
	$('#btnNsearch').on('click', function(e) {
		$m.getPlainTextFromJson('address/search', JSON.stringify(addrObj), function(data) {
			var output = $('#dvNresult');
			var dataForm = {
				"addresses": data
			}
			
			var result = templateAddress(dataForm);
			output.append(result);
		});
	});
	
	$('#btnViewMapAddress').on('click', function() {
		/*var $sel = $('input:radio[name="sel"]:checked');
		var lng = $sel.data('lng');
		var lat = $sel.data('lat');*/
		
		//$map.toMove(lat, lng);
		/*
		 * 
		 * */
		$map.toMove(37.42829747263545, 126.76620435615891, null, function() {
			mapCore.getMarker(37.42829747263545, 126.76620435615891, {
				'click' : function(map, newMarker, newInfoWindow) {
					 if(newInfoWindow.getMap()) {
						 newInfoWindow.close();
				     }
					 else {
						 newInfoWindow.open(map, newMarker);
				     }
				}
			}, 'test');
		});
		modalClose('#addressSearch');
	});
	
	
}(
	common.model,
	mapCore
));