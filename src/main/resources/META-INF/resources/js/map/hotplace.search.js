/**
 * @namespace hotplace.search
 * */
(function(search, $) {
	
	//rangeSlider 설정
	var _sliderGrp = {}; 
	
	function _sliderInit(gName, targetIds) {
		if(_sliderGrp[gName]) return;
		
		_sliderGrp[gName] = [];
		var len = targetIds.length;
		
		for(var i=0; i<len; i++) {
			_sliderGrp[gName].push($('#' + targetIds[i]));
			
			var t = $('#' + targetIds[i]);
			
			_sliderGrp[gName][_sliderGrp[gName].length - 1].rangeSlider({
				  bounds: {min: -10, max: -1},
				  step: 1,
				  defaultValues: {min:-4, max:-1},
				  formatter: function(val) {
					  //console.log(val)
					  return Math.abs(val) + '등급';
				  }
			});
			/*t.rangeSlider({
				  bounds: {min: -10, max: -1},
				  step: 1,
				  defaultValues: {min:-4, max:-1},
				  formatter: function(val) {
					  //console.log(val)
					  return Math.abs(val) + '등급';
				  }
			});*/
			
			_sliderGrp[gName][_sliderGrp[gName].length - 1].bind('valuesChanged', function(e, data) {
				var id = e.currentTarget.id;
				var values = data.values;
				
				/*_hpGradeParam[id].min = Math.abs(values.max);
				_hpGradeParam[id].max = Math.abs(values.min);*/
			});
			
			/*t.bind('valuesChanged', function(e, data) {
				var id = e.currentTarget.id;
				var values = data.values;
				
				_hpGradeParam[id].min = Math.abs(values.max);
				_hpGradeParam[id].max = Math.abs(values.min);
			});*/
		}
		
		//_sliderGrpInit[gName] = true;
	}
	
	function _gyeonggongSearchFormLoad() {
		var root = hotplace.getContextUrl() + 'resources/img/gyeonggong_search';
		var tForm = hotplace.dom.getTemplate('gyeonggongSearchForm');
		$('#menu-search-gyeonggong-list').append(tForm({path: root}));
		
		$(document).on('click', '#pIlbansahang', _bindGyeonggongSearchFormHandler('tbIlbansahang', 'ilbansahang', root));
		$(document).on('click', '#pLandUseLimit', _bindGyeonggongSearchFormHandler('tbLandUseLimit', 'landuselimit', root));
		$(document).on('click', '#pHopefulTooja', _bindGyeonggongSearchFormHandler('tbHopefulTooja', 'hopefultooja', root));
		
		_sliderInit('gyeonggong', ['hopefulToojaHpGrade', 'environmentPyeonggaGrade']);
	}
	
	function _heatmapFormLoad() {
		var tForm = hotplace.dom.getTemplate('heatmapForm');
		$('#menu-cell-list').append(tForm());
		
		$(document).on('change', 'input[name=rdoHeatmap]', function(e, isTrigger) {
			var cellType = 'OFF';
			
			if(isTrigger) {
				$('#heatmapOff').prop('checked', true);
				hotplace.maps.setActiveCell(cellType);
			}
			else {
				cellType = $(this).data('value');
				hotplace.maps.setActiveCell(cellType);
				hotplace.maps.cellStart();
			}
			
		});
	}
	
	function _mulgeonFormLoad() {
		var tForm = hotplace.dom.getTemplate('mulgeonForm');
		$('#menu-search-list').append(tForm());
		
		$(document).on('keydown', '#txtMulgeon', function(e) {
			if (e.which == 13) {
				var txt = e.target.value;
				$('#btnMulgeon').trigger('click', $.trim(txt)); 
		    }
		});
		
		$(document).on('click', '#btnMulgeon', function(e, arg) {
			var $list = $('#menu-search-list');
			if(arg == undefined) {
				arg = $.trim($('#txtMulgeon').val());
			}
			
			if(arg) {
				var param = {san:'1'};
				
				var beonji, beonjiF, beonjiS, beonjiArr, beonjiArrLen;
				
				var token = arg.split(' ');
				var tokenLen = token.length;
				var t;
				var arr = [];
				
				for(var i=0; i<tokenLen; i++) {
					t = token[i];
					if(t == ' ') continue;
					arr.push(t);
				}
				
				var arrLen = arr.length;
				for(var k=0; k<arrLen; k++) {
					if(arr[k] == '산') {
						param.san = '2';
					}
					else if(beonji = arr[k].match(/[0-9]+\-?[0-9]*/g)){
						if(beonji) {
							beonjiArr = beonji.toString().split('-');
							beonjiArrLen = beonjiArr.length;
							
							if(beonjiArrLen == 1) {
								param.beonjiF = $.trim(beonjiArr[0]);
								param.beonjiS = '0';
							}
							else {
								param.beonjiF = $.trim(beonjiArr[0]);
								param.beonjiS = $.trim(beonjiArr[1]);
							}
						}
					}
					else {
						param.detail = arr[k];
					}
				}
				
				hotplace.getPlainTextFromJson('mulgeon/search', JSON.stringify(param), function(data) {
					var output = $('#dvMulgeonResult');
					var dataForm = {
						'addresses': data,
						'rdoId': 'addr'
					}
					
					var result = (hotplace.dom.getTemplate('addressResult2'))(dataForm);
					output.html(result);
					if(data.length > 1) {
						$list.removeClass('list');
						$list.addClass('list-expand');
						$('#dvMulgeonContainer').show();
					}
					else {
						$('#dvMulgeonContainer').hide();
						$list.removeClass('list-expand');
						$list.addClass('list');
						
						if(data.length == 1) {
							console.log(data);
							$('#btnMulgeonMap').trigger('click', {
								address: data[0][1],
								lng: data[0][3],
								lat: data[0][2],
							});
							
							
						}
						
					}
					
				}, true, '#dvMulgeon');
			}
			else {
				console.log('b');
			}
		});
		
		$(document).on('click', '#btnMulgeonMap', function(e, arg) {
			//이미 열려있는 물건검색 마커  윈도우 삭제
			hotplace.maps.destroyMarkerType(hotplace.maps.MarkerTypes.MULGEON_SEARCH);
			hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerTypes.MULGEON_SEARCH);
			
			var $sel = $('input:radio[name="' + /*addrObj.rdoId*/'addr' + '"]:checked');
			var lng = arg ? arg.lng : $sel.data('lng');
			var lat = arg ? arg.lat : $sel.data('lat');
			var address = arg ? arg.address : $sel.data('address');
			
			if(lng == undefined || lat == undefined) return;
			//$('#btnNews').trigger('click');
			
			hotplace.maps.destroyMarkerType(hotplace.maps.MarkerTypes.MULGEON_SEARCH);
			hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerTypes.MULGEON_SEARCH);
			
			hotplace.maps.panToBounds(lat, lng, function() {
				hotplace.maps.getMarker(hotplace.maps.MarkerTypes.MULGEON_SEARCH, {location:[lng, lat]}, {
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
					infoWinFormName: 'pinpointForm',
					radius: 0,
					datas: {
						params : $.extend({address:address}, {defaultValue:hotplace.calc.profit.defaultValue}, {
							jimok: '전',
							valPerPyeung:21000000,
							area: 132,
							gongsi: 4040000,
							limitChange:'Y'
						})
					},
					icon: hotplace.maps.getMarkerIcon(hotplace.maps.MarkerTypes.MULGEON_SEARCH),
					size: {
						x: 26,
						y: 36
					}
				});
			});
		});
	}
	
	function _salesViewFormLoad() {
		var tForm = hotplace.dom.getTemplate('salesViewForm');
		$('#menu-mulgeon-list').append(tForm({url: hotplace.getContextUrl()}));
		
		//물건보기 체크 이벤트
		$(document).on('click', '#btnSearchSalesView', function(e) {
			var obj = {}
			$('#dvSalesView input[type="checkbox"]:not(:disabled)').each(function() {
				var type = $(this).data('value');
				obj[type] = $(this).prop('checked') ? 1 : 0;
			})
			.promise()
			.done(function() {
				hotplace.maps.setMarkers(obj);
				
				//선택해지된 마커를 지운다.
				for(var m in obj) {
					if(obj[m] == 0) {
						hotplace.maps.destroyMarkerType(m);
					}
				}
				
				hotplace.maps.showMarkers();
				
				$('#btnSalesView').trigger('click');
			});
		});
	}
	
	function _bindGyeonggongSearchFormHandler(targetId, imgName, imgRoot) {
		return function() {
			var sw = $(this).data('switch');
			if(sw == 'off') {
				$('#' + targetId).show();
				$(this).children('img').prop('src', imgRoot + '/' + imgName + '_over.png');
				$(this).data('switch', 'on');
				
				_rangeResize('gyeonggong');
			}
			else {
				$('#' + targetId).hide();
				$(this).children('img').prop('src', imgRoot + '/' + imgName + '.png');
				$(this).data('switch', 'off');
			}
		}
	}
	
	function _rangeResize(gName) {
		if(_sliderGrp[gName]) {
			var len = _sliderGrp[gName].length;
			for(var i=0; i<len; i++) {
				_sliderGrp[gName][i].rangeSlider('resize');
			}
		}
	}
	
	search.formInit = function() {
		_mulgeonFormLoad();
		_gyeonggongSearchFormLoad();
		_heatmapFormLoad();
		_salesViewFormLoad();
	}
}(
	hotplace.search = hotplace.search || {},
	jQuery
));