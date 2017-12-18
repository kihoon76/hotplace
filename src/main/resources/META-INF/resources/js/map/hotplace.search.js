/**
 * @namespace hotplace.search
 * */
(function(search, $) {
	
	//rangeSlider 설정
	var _sliderGrp = {}; 
	
	var _tabulatorSelectFilter = function(arr) {
		return function(cell, onRendered, success, cancel) {
			var len = arr.length;
			
			var htmlStr = '';
				
			for(var i=0; i<len; i++) {
				htmlStr += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
				console.log(htmlStr);
			}
				
			var editor = $('<select><option value=""></option>' + htmlStr + '</select>');
			editor.css({
				'padding':'3px',
		        'width':'100%',
		        'box-sizing':'border-box',
		    });
			 
			//Set value of editor to the current value of the cell
			editor.val(cell.getValue());
			  
			//set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
			onRendered(function(){
				editor.focus();
				editor.css('height','100%');
			});
			 
			//when the value has been set, trigger the cell to update
			editor.on('change blur', function(e){
				success(editor.val());
			});
	
			//return the editor element
			return editor;
		}
	}
	
	function _sliderInit(gName, targetIds, bounds, defaultValues) {
		if(_sliderGrp[gName]) return;
		
		_sliderGrp[gName] = [];
		var len = targetIds.length;
		
		for(var i=0; i<len; i++) {
			_sliderGrp[gName].push($('#' + targetIds[i]));
			
			var t = $('#' + targetIds[i]);
			
			_sliderGrp[gName][_sliderGrp[gName].length - 1].rangeSlider({
				  bounds: bounds || {min: -10, max: -1},
				  step: 1,
				  defaultValues: defaultValues || {min:-4, max:-1},
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
	
	
	function _getSearchGyeonggongParam() {
		var param = {
			'jiyeog': [],
			'jimok': [],
			'gamjeongga':[],
			'minIbchalga': [],
		}
		
		$('#tdJiyeog input[type=checkbox]').each(function(index, value) {
			
			if($(this).is(':checked')) {
				console.log($(this).val());
				param.jiyeog.push($(this).val()) 
			}
		});
		
		$('#tdJimok input[type=checkbox]').each(function(index, value) {
			
			if($(this).is(':checked')) {
				console.log($(this).val());
				param.jimok.push($(this).val()) 
			}
		});
		
		$('#tdGamjeongga input[type=checkbox]').each(function(index, value) {
			var v = null;
			var sMin, sMax, arr = '';
			if($(this).is(':checked')) {
				v = $(this).val();
				if(v.startsWith('m')) {
					param.gamjeongga.push({min: parseInt(v.substring(1)), max:-1});
				}
				else if(v.startsWith('M')) {
					param.gamjeongga.push({max: parseInt(v.substring(1)), min:-1});
				}
				else if(v.indexOf('|') > 0) {
					arr = v.split('|');
					sMin = arr[0];
					sMax = arr[1];
					param.gamjeongga.push({min: parseInt(sMin), max: parseInt(sMax)});
				}
			}
		});
		
		$('#tdMinIbchalga input[type=checkbox]').each(function(index, value) {
			var v = null;
			var sMin, sMax, arr = '';
			if($(this).is(':checked')) {
				v = $(this).val();
				if(v.startsWith('m')) {
					param.minIbchalga.push({min: parseInt(v.substring(1)), max:-1});
				}
				else if(v.startsWith('M')) {
					param.minIbchalga.push({max: parseInt(v.substring(1)), min:-1});
				}
				else if(v.indexOf('|') > 0) {
					arr = v.split('|');
					sMin = arr[0];
					sMax = arr[1];
					param.minIbchalga.push({min: parseInt(sMin), max: parseInt(sMax)});
				}
			}
		});
		
		return param;
	}
	
	function _searchGyeonggong(fn) {
		var param = _getSearchGyeonggongParam();
		
		hotplace.ajax({
			url: 'search/gyeonggong',
			data: JSON.stringify(param),
			contentType: 'application/json; charset=UTF-8',
			success: function(data, textStatus, jqXHR) {
				$('#ulGyeonggongSearchForm').hide();
				$('#dvGyeonggongSearchResult').show();
				console.log(data);
				
				_makeGyeonggongTabulator(data.datas);
				fn();
			}
		})
	}
	
	function _makeGyeonggongTabulator(tbData) {
		$('#dvGyeonggongSearchResult').tabulator({
		    height:826, // set height of table
		    fitColumns:true, //fit columns to width of table (optional)
		    columns:_tabulatorColumns.gyeonggong,
		    rowClick:function(e, row){ //trigger an alert message when the row is clicked
		       var data = row.getData();
		       console.log(data)
		       
		       if(data.lng == 0) {
		    	   alert('위경도 정보가 존재하지 않습니다.')
		    	   return;
		       }
		       
		       var formName, icon = '', callbak = null;
		       
		       if(data.gubun == 'G') {
		    	   formName = 'gyeongmaeForm';
		    	   icon = hotplace.maps.MarkerTypes.GYEONGMAE;
		    	   callback = function(map, marker, win) {
			    	   marker._data = {info:{unu:data.unu}};
			    	   hotplace.gyeongmae.markerClick(map, marker, win);
			       }
		       }
		       else {
		    	   formName = 'gongmaeForm';
		    	   icon = hotplace.maps.MarkerTypes.GONGMAE;
		       }
		       
		       _moveMulgeon(data.lng, data.lat, data.address, formName, callback, icon);
		    },
		});
		
		$('#dvGyeonggongSearchResult').tabulator('setData', tbData);
		
		/*var tabledata = [
		                 {gubun:'G', type:'대',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:2, favor:false, gubun:'K', type:'임야',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:3, favor:false, gubun:'G', type:'전',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:4, favor:true, gubun:'K', type:'답',  address:'서울시 강남구 대치동  963', lng:37.539648921, lat:127.152615967},
		                 {id:5, favor:true, gubun:'R', type:'도로',  address:'서울시 강남구 역삼동 963', lng:37.539648921, lat:127.152615967},
		                 {id:6, favor:true, gubun:'G', type:'임야',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:7, favor:true, gubun:'R', type:'하천',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:8, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:9, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:10, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:11, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:12, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:13, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967},
		                 {id:14, favor:true, gubun:'G', type:'건물',  address:'서울시 강남구 도곡동 963', lng:37.539648921, lat:127.152615967}, 
		             ];*/
		
		
			

	}
	
	function _gyeonggongSearchFormLoad() {
		var root = hotplace.getContextUrl() + 'resources/img/gyeonggong_search';
		var tForm = hotplace.dom.getTemplate('gyeonggongSearchForm');
		$('#menu-search-gyeonggong-list').append(tForm({path: root})); 
		
		$(document).on('click', '#pIlbansahang', _bindFormHandler('tbIlbansahang', 'ilbansahang', root, 'gyeonggong'));
		$(document).on('click', '#pLandUseLimit',_bindFormHandler('tbLandUseLimit', 'landuselimit', root, 'gyeonggong'));
		$(document).on('click', '#pHopefulTooja', _bindFormHandler('tbHopefulTooja', 'hopefultooja', root, 'gyeonggong'));
		
		
		$(document).on('click', '.btn-gyeonggong-state', function() {
			var step = $(this).data('step');
			if(step == 'search'){
				_searchGyeonggong(function() {
					var $btn = $('.btn-gyeonggong-state');
					$btn.data('step', 'prev');
					$btn.find('img').prop('src', root + '/search_prev.png');
				});
			}
			else {
				$('#ulGyeonggongSearchForm').show();
				$('#dvGyeonggongSearchResult').hide();
				
				$(this).data('step', 'search');
				$(this).find('img').prop('src', root + '/search.png');
			}
		});
		
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
			var datas = {
				params : $.extend({address:address}, {defaultValue:hotplace.calc.profit.defaultValue}, {
					jimok: '전',
					valPerPyeung:21000000,
					area: 132,
					gongsi: 4040000,
					limitChange:'Y'
				})
			};
			
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
							 hotplace.chart.infoCate('chartInfoCate', datas);
					     }
					}
				}, {
					hasInfoWindow: true,
					infoWinFormName: 'mulgeonInfosForm',
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
	
	function _getToojaParam(cate) {
		var param = null;
		
		switch(cate) {
		case 'jangmi' :
			param = {
				'cityPlan': [],
				'cityPlanState' : []
			};
			break;
		case 'llu' :
			param = {};
			break;
		case 'devPilji' :
			param = {};
			break;
		}
		
		return param;
	}
	
	function _searchTooja(cate, fn) {
		var param = _getToojaParam(cate);
		param =  {
				'jiyeog': ['42'],
				'jimok': [],
				'gamjeongga':[],
				'minIbchalga': [],
			}
		var containerId, resultId = null;
		
		hotplace.ajax({
			url: 'search/gyeonggong',
			data: JSON.stringify(param),
			contentType: 'application/json; charset=UTF-8',
			success: function(data, textStatus, jqXHR) {
				switch(cate) {
				case 'jangmi' :
					$('#dvJangmi').hide();
					$('#dvJangmiResult').show();
					containerId = 'dvJangmi';
					resultId = 'dvJangmiResult';
					break;
				case 'llu' :
					$('#dvLlu').hide();
					$('#dvLluResult').show();
					containerId = 'dvLlu';
					resultId = 'dvLluResult';
					break;
				case 'devPilji' :
					$('#dvDevPilji').hide();
					$('#dvDevPiljiResult').show();
					containerId = 'dvDevPilji';
					resultId = 'dvDevPiljiResult';
					break;
					
				}
				
				_makeToojaTabulator(containerId, resultId, data.datas);
				fn();
			}
		})
	}
	
	function _makeToojaTabulator(containerId, resultId, tbData) {
		$('#' + resultId).tabulator({
		    height:760, // set height of table
		    fitColumns:true, //fit columns to width of table (optional)
		    columns:_tabulatorColumns.gyeonggong,
		    rowClick:function(e, row){ //trigger an alert message when the row is clicked
		       var data = row.getData();
		       console.log(data)
		       
		       if(data.lng == 0) {
		    	   alert('위경도 정보가 존재하지 않습니다.')
		    	   return;
		       }
		       
		       var formName, icon = '', callbak = null;
		       
		       if(data.gubun == 'G') {
		    	   formName = 'gyeongmaeForm';
		    	   icon = hotplace.maps.MarkerTypes.GYEONGMAE;
		    	   callback = function(map, marker, win) {
			    	   marker._data = {info:{unu:data.unu}};
			    	   hotplace.gyeongmae.markerClick(map, marker, win);
			       }
		       }
		       else {
		    	   formName = 'gongmaeForm';
		    	   icon = hotplace.maps.MarkerTypes.GONGMAE;
		       }
		       
		       _moveMulgeon(data.lng, data.lat, data.address, formName, callback, icon);
		    },
		});
		
		$('#' + resultId).tabulator('setData', tbData);
	}
	
	function _toojaFormLoad() {
		var root = hotplace.getContextUrl() + 'resources/img/tooja_search';
		var tForm = hotplace.dom.getTemplate('toojaForm');
		var activeTab = 1;
		var btnState = {
			'jangmi': 'search',
			'llu': 'search',
			'devPilji': 'search'
		}
		
		$('#menu-search-tooja-list').append(tForm({path: root}));
		
		$(document).on('click', '#pJangMi', _bindFormHandler('tbJangMi', 'jangmi', root));
		$(document).on('click', '#pJangMiIlbanjogeon', _bindFormHandler('tbJangMiIlbanjogeon', 'ilbanjogeon', root));
		$(document).on('click', '#pJangMiLimitLandUse', _bindFormHandler('tbJangMiLimitLandUse', 'limitlanduse', root));
		$(document).on('click', '#pJangMiDevPilji', _bindFormHandler('tbJangMiDevPilji', 'devpilji', root, 'tooja'));
		
		$(document).on('click', '#pLimitLandUse', _bindFormHandler('tbLimitLandUse', 'limitlanduse', root));
		$(document).on('click', '#pLimitLandUseIlban', _bindFormHandler('tbLimitLandUseIlban', 'ilbanjogeon', root));
		$(document).on('click', '#pLimitLandUsePilji', _bindFormHandler('tbLimitLandUsePilji', 'devpilji', root, 'tooja'));
		
		$(document).on('click', '#pDevPilji', _bindFormHandler('tbDevPilji', 'devpilji', root, 'tooja'));
		
		_sliderInit('tooja', ['jangmiToojaHpGrade', 'limitLandUseToojaHpGrade', 'devPiljiToojaHpGrade']);
		
		//tab click handler
		//tab change시  range bar가 보여야 함
		$(document).on('shown.bs.tab', '#toojaTabBtn1', function() {
			//개발적성 필지가 open 되어 있을 경우
			if($('#pJangMiDevPilji').data('switch') == 'on') {
				$('#jangmiToojaHpGrade').rangeSlider('resize');
			}
			
			activeTab = 1;
			
			if(btnState.jangmi == 'search') {
				$('#btnToojaSearch').removeClass('btn-search  btn-prev').addClass('btn-search');
			}
			else {
				$('#btnToojaSearch').removeClass('btn-search  btn-prev').addClass('btn-prev');
			}
			
		});
		
		$(document).on('shown.bs.tab', '#toojaTabBtn2', function() {
			//개발적성 필지가 open 되어 있을 경우
			if($('#pLimitLandUse').data('switch') == 'on') {
				$('#limitLandUseToojaHpGrade').rangeSlider('resize');
			}
			
			activeTab = 2;
			
			if(btnState.llu == 'search') {
				$('#btnToojaSearch').removeClass('btn-search  btn-prev').addClass('btn-search');
			}
			else {
				$('#btnToojaSearch').removeClass('btn-search  btn-prev').addClass('btn-prev');
			}
		});
		
		$(document).on('shown.bs.tab', '#toojaTabBtn3', function() {
			//개발적성 필지가 open 되어 있을 경우
			if($('#pDevPilji').data('switch') == 'on') {
				$('#devPiljiToojaHpGrade').rangeSlider('resize');
			}
			
			activeTab = 3;
			
			if(btnState.devPilji == 'search') {
				$('#btnToojaSearch').removeClass('btn-search  btn-prev').addClass('btn-search');
			}
			else {
				$('#btnToojaSearch').removeClass('btn-search  btn-prev').addClass('btn-prev');
			}
		});
		
		//검색
		$(document).on('click', '#btnToojaSearch', function() {
			var $this = $(this);
			switch(activeTab) {
			case 1 :
				if(btnState.jangmi == 'search') {
					_searchTooja('jangmi', function() {
						btnState.jangmi = 'prev';
						$this.removeClass('btn-search');
						$this.addClass('btn-prev');
					});
				}
				else {
					$('#dvJangmi').show();
					$('#dvJangmiResult').hide();
					btnState.jangmi = 'search';
					
					$this.removeClass('btn-prev');
					$this.addClass('btn-search');
				}
				
				break;
			case 2 :
				if(btnState.llu == 'search') {
					_searchTooja('llu', function() {
						btnState.llu = 'prev';
						$this.removeClass('btn-search');
						$this.addClass('btn-prev');
					});
				}
				else {
					$('#dvLlu').show();
					$('#dvLluResult').hide();
					btnState.llu = 'search';
					
					$this.removeClass('btn-prev');
					$this.addClass('btn-search');
				}
				
				break;
			case 3 :
				if(btnState.devPilji == 'search') {
					_searchTooja('devPilji', function() {
						btnState.devPilji = 'prev';
						$this.removeClass('btn-search');
						$this.addClass('btn-prev');
					});
				}
				else {
					$('#dvDevPilji').show();
					$('#dvDevPiljiResult').hide();
					btnState.devPilji = 'search';
					
					$this.removeClass('btn-prev');
					$this.addClass('btn-search');
				}
				
				break;
			}
		});
	}
	
	function _moveMulgeon(lat, lng, address, formName, clickHandler, icon) {
		hotplace.maps.destroyMarkerType(hotplace.maps.MarkerTypes.MULGEON_SEARCH);
		hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerTypes.MULGEON_SEARCH);
		
		hotplace.maps.panToBounds(lat, lng, function() {
			hotplace.maps.getMarker(hotplace.maps.MarkerTypes.MULGEON_SEARCH, {location:[lng, lat]}, {
				'click' : function(map, newMarker, newInfoWindow) {
					if(clickHandler) clickHandler(map, newMarker, newInfoWindow);
				}
			}, {
				hasInfoWindow: true,
				infoWinFormName: formName,
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
				icon: hotplace.maps.getMarkerIcon(icon),
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
	
	function _bindFormHandler(targetId, imgName, imgRoot, sliderKey) {
		return function() {
			var sw = $(this).data('switch');
			if(sw == 'off') {
				$('#' + targetId).show();
				$(this).children('img').prop('src', imgRoot + '/' + imgName + '_over.png');
				$(this).data('switch', 'on');
				
				if(sliderKey) _rangeResize(sliderKey);
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
	
	function _getTabulatorColumns() {
		
		return [{
			title:'구분', field:'gubun', width:150, headerFilter:true, editor:_selFilter(['G', 'K', 'R'])},
			        {title:'물건유형', field:'type', width:150,  headerFilter:true, editor:_selFilter(['대','전','답','임야','하천','도로','건물'])},
			        {title:'주소', field:'addr', width:200,  headerFilter:'input', headerFilterPlaceholder:'주소검색'},
			        {title:'감정평가액', field:'gamjeong', formatter:'money', width:100},
			        {title:'최소입찰가', field:'minBid', formatter:'money', width:100},
			        {title:'최소입찰가율', field:'minBidRate', width:100},
			        {title:'종료일', field:'endDate', sorter:'date', width:100},
			        {title:'등록일', field:'regDate', sorter:'date', width:100},
			        {title:'RQ지수', field:'jisu', formatter:'star', formatterParams:{stars:10}, width:200, headerFilter:'number', headerFilterPlaceholder:'1 ~ 10'},];
	}
	
	var _tabulatorColumns = {
		'gyeonggong': [
		    { title:'고유번호', field:'unu', width:100 },
		    { title:'구분', field:'gubun', width:100, headerFilter:true, editor:_tabulatorSelectFilter(['G', 'K', 'R']) },
		    { title:'물건유형', field:'type', width:150,  headerFilter:true, editor:_tabulatorSelectFilter(['대','전','답','임야','하천','도로','건물']) },
		    { title:'감정평가액', field:'gamjeongga', width:150, formatter:'money', formatterParams: {thousand: ',', decimal: ''}},
		    { title:'주소', field:'address',   headerFilter:'input', headerFilterPlaceholder:'주소검색' },
		    { title:'위도', field:'lat', visible: false },
		    { title:'경도', field:'lng', visible: false },
		    
		],
	}
	
	
	
	search.formInit = function() {
		_mulgeonFormLoad();
		_gyeonggongSearchFormLoad();
		_heatmapFormLoad();
		_salesViewFormLoad();
		_toojaFormLoad();
	}
}(
	hotplace.search = hotplace.search || {},
	jQuery
));