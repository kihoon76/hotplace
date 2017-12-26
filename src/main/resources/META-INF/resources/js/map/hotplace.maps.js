/**
 * @namespace hotplace.maps
 */
(function(maps, $) {
	/**
	 * @private 
	 * @desc 맵 제공업체 naver, daum
	 */
	var _venderStr = '';
	
	/**
	 * @private 
	 * @desc 맵 element
	 */
	var _container = document.getElementById('map');
	
	var _vender = null;
	var _venderMap = null;
	var _venderEvent = null;
	var _markerClustering = null;
	
	
	/** 
	 * @private
	 * @desc hotplace.naps.init 함수가 호출되었는지 여부
	 */
	var _initCalled = false;
	
	/**
	 * @private 
	 * @desc 지원하는 hotplace map 이벤트 목록
	 */
	var _events = ['zoom_changed', 'bounds_changed', 'dragend', 'zoom_start', 'click', 'tilesloaded', 'idle', 'panning'];
	
	/**
	 * @private
	 * @desc 지원하는 벤더목록
	 */
	var _venders = ['naver', 'daum'];
	
	/** 
	 * @private 
	 * @desc 화면에 보이는 bounds
	 * @type {object}
	 * @property {number} swx - 극서
	 * @property {number} nex - 극동
	 * @property {number} swy - 극남
	 * @property {number} ney - 극북
	 */
	var _currentBounds = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 }; 
	
	/** 
	 * @private 
	 * @desc 실제로 cell을 그릴 bounds
	 * @type {object}
	 * @property {number} swx - 극서
	 * @property {number} nex - 극동
	 * @property {number} swy - 극남
	 * @property {number} ney - 극북
	 */
	var _marginBounds  = { 'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0 };  
	
	/** 
	 * @private 
	 * @desc 서버로부터 받을 좌표계 bounds
	 * @type {object} 
	 * @property {number} swx - 극서
	 * @property {number} nex - 극동
	 * @property {number} swy - 극남
	 * @property {number} ney - 극북
	 */
	var _locationBounds = {'swy' : 0, 'swx' : 0, 'ney' : 0,	'nex' : 0};	  
	
	var _cellTypes = {DEFAULT:'HP', GONGSI:'GONGSI', GONGSI_GR: 'GONGSI_GR'};
	
	/** 
	 * @private 
	 * @desc 표시하고자 하는 layer 0:inactive, 1:on -1:off (XOR관계임) 
	 * @type {object} 
	 * @property {string} DEFAULT - HP지수
	 * @property {string} GONGSI  - 공시지가
	 * @property {string} GONGSI_GR  - 공시지가 증가율
	 */
	var _cellLayerOnOff = {DEFAULT:0, GONGSI:0, GONGSI_GR:0};
	
	/** 
	 * @private 
	 * @desc 표시하고자 하는 마커그룹 0:off, 1:on  
	 * @type {object} 
	 * @property {string} GYEONGMAE - 경매
	 * @property {string} GONGMAE - 공매
	 * @property {string} BOSANG - 보상
	 * @property {string} PYEONIB - 공매
	 * @property {string} SILGEOLAE - 실거래가
	 */
	var _markerGroupOnOff = { GYEONGMAE:0, GONGMAE:0, BOSANG:0, PYEONIB:0, SILGEOLAE:0, ACCEPT_BUILDING:0 };
	
	/** 
	 * @private 
	 * @desc 클러스터 적용된 그룹 관리 
	 * @type {object} 
	 * @property {string} xg - 그룹번호
	 */
	var _createdMarkerGroup = {
		BOSANG: {},
		PYEONIB: {}
	};
	
	/**
	 * @memerof hotplace.maps
	 * @function getActiveMarkers
	 * @returns {Array} 활성화된 marker types
	 * @desc 활성화된 marker type
	 */
	maps.getActiveMarkers = function() {
		var types = [];
		for(var t in _markerGroupOnOff) {
			if(_markerGroupOnOff[t] == 1) {
				types.push(t);
			}
		}
		
		return types;
	}
	
	maps.getMap = function() {
		return _venderMap;
	}
	/**
	 * @memerof hotplace.maps
	 * @function setAllOffMarkers
	 * @desc marker type 전부를 off함
	 *       로그인을 안한 상태에서 체크한 모든 마커를 언체크한다.
	 */
	maps.setAllOffMarkers = function() {
		for(var t in _markerGroupOnOff) {
			_markerGroupOnOff[t] = 0;
		}
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function isActiveMarker
	 * @param {hotplace.maps.MarkerTypes} markerType 
	 * @returns {boolean} 
	 * @desc 마커타입 활성화 여부
	 */
	maps.isActiveMarker = function(markerType) {
		if(_markerGroupOnOff[markerType] == undefined) throw new Error('[ ' + markerType + ' ]는 지원되지 않는 마커타입입니다');
		return _markerGroupOnOff[markerType] == 1 ? true : false;
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function getActiveMarkers
	 * @param {object} markerState 
	 * @param {number} markerState.GYEONGMAE
	 * @param {number} markerState.GONGMAE
	 * @desc markertype 활성화 설정
	 */
	maps.setMarkers = function(markerState) {
		for(var t in markerState) {
			if(_markerGroupOnOff[t] == undefined) throw new Error('마커타입 [' + t + ']가 존재하지 않습니다');
			
			_markerGroupOnOff[t] = markerState[t];
			
		}
	}
	
	maps.setActiveCell = function(cellType) {
		
		if(cellType == 'OFF') {
			for(var t in _cellLayerOnOff) {
				_cellLayerOnOff[t] = 0;
			}
			
			return;
		}
		
		for(var t in _cellLayerOnOff) {
			if(t == cellType) {
				_cellLayerOnOff[t] = 1;
			}
			else {
				_cellLayerOnOff[t] = 0;
			}
		}
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function changeCell
	 * @params {hotplace.maps.CellTypes} cellType - 변경하려는 cell type
	 * @todo celltype을 변경 가능할때 구현
	 * @ignore
	 */
	maps.changeCell = function(cellType) {
		var currCellType = _getActiveCellType();
		
		//cell이 꺼져 있을경우
		if(currCellType == null) {
			
		}
		
		for(var t in _cellTypes) {
			//if(_cellLayerOnOff[t])
		}
	}
	
	/**
	 * @memerof hotplace.maps
	 * @function cellToggle
	 * @desc cell toggle
	 */
	/*maps.cellToggle = function() {
		
		hotplace.dom.addBodyAllMask();
		
		//masking 동작을 위해 delay를 준다.
		setTimeout(function() {
			if(_isOffCell(true)) {
				//on 한다.
				_restoreAllCells();
				maps.showCellLayer();
				hotplace.dom.enableYearRangeDiv(true);
			}
			else {
				//off 한다.
				_removeAllCells();
				hotplace.dom.enableYearRangeDiv(false);
				hotplace.database.initLevel(_getCurrentLevel(), _getActiveCellType());
			}
			
			hotplace.dom.removeBodyAllMask();
		}, 100);
		
	}*/
	
	maps.cellStart = function() {
		
		hotplace.dom.addBodyAllMask();
		
		//masking 동작을 위해 delay를 준다.
		setTimeout(function() {
			if(_isOffCell()) {
				_removeAllCells();
				hotplace.dom.enableYearRangeDiv(false);
				hotplace.database.initLevel(_getCurrentLevel(), _getActiveCellType());
			}
			else {
				_restoreAllCells();
				maps.showCellLayer();
				hotplace.dom.enableYearRangeDiv(true);
			}
			
			hotplace.dom.removeBodyAllMask();
		}, 100);
		
	}
	
	/** 
	 * @private 
	 * @desc 현재 활성화 된 cell layer를 반환
	 * @function _getActiveCellType 
	 * @returns {hotplace.maps.CellTypes} 
	 */
	var _getActiveCellType = function() {
		
		for(var t in _cellTypes) {
			if(_cellLayerOnOff[t] == 1/* || _cellLayerOnOff[t] == -1/*toggle*/) {
				return _cellTypes[t];
			}
		}
	}
	
	var _isOffCell = function(isWrite) {
		for(var t in _cellLayerOnOff) {
			if(_cellLayerOnOff[t] == 1) {
				//if(isWrite) _cellLayerOnOff[t] = -1;
				return false;
			}
			/*else if(_cellLayerOnOff[t] == 0) {
				//if(isWrite) _cellLayerOnOff[t] = 1;
				return true;
			}*/
		}
		
		return true;
	}
	
	
	/** 
	 * @memberof hotplace.maps  
	 * @desc 현재 cell layer가 off 되어있는지 검사
	 * @function isOffCell 
	 * @param {boolean} isWrite - 현재 toggle상태를 바꿀지 여부
	 * @returns {boolean} 
	 */
	maps.isOffCell = _isOffCell;
	
	/** 
	 * @private 
	 * @desc 지도위에 그려진 (visible && invisible)cell들의 배열
	 * @type {Array} 
	 */
	var _cells = [];
	
	/** 
	 * @private 
	 * @desc weight값 제한으로 화면에서 보이는 좌표이지만 그리지않은 cell들
	 * @ignore
	 * @type {Array} 
	 */
	var _notDrawedCells = [];    
	
	
	var _markerTypes = {
		RADIUS_SEARCH: 'RADIUS_SEARCH',
		GYEONGMAE: 'GYEONGMAE', 
		GONGMAE: 'GONGMAE',
		BOSANG: 'BOSANG',
		PYEONIB: 'PYEONIB',
		SILGEOLAE: 'SILGEOLAE',
		ACCEPT_BUILDING: 'ACCEPT_BUILDING',
		MULGEON_SEARCH: 'MULGEON_SEARCH'
	};
	
	/** 
	 * @memberof hotplace.maps
	 * @desc 지도위에 그려진 마커그룹 타입
	 * @typedef {object} hotplace.maps.MarkerTypes 
	 * @property {string} RADIUS_SEARCH - 반경검색 후 지도상에 보이는 마커(1개)
	 * @property {string} GYEONGMAE - 경매물건 마커들
	 * @property {string} GONGMAE - 공매물건 마커들
	 * @property {string} BOSANG - 보상물건 마커들
	 * @property {string} PYEONIB - 편입물건 마커들
	 * @property {string} ACCEPT_BUILDING - 건축허가 마커들
	 * @property {string} MULGEON_SEARCH - 물건검색후 마커
	 */
	maps.MarkerTypes = _markerTypes;
	
	/** 
	 * @memberof hotplace.maps
	 * @desc cell(heatmap)이 표현할수 있는 타입종류 
	 * @typedef {object} hotplace.maps.CellTypes
	 * @property {string} GONGSI - 공시지가
	 * @property {string} DEFAULT - 기본값 (HP지수)
	 */
	maps.CellTypes = _cellTypes;
	
	/** 
	 * @private 
	 * @desc 지도위에 그려진 마커그룹
	 * @type  {object} 
	 * @param {object}  RADIUS_SEARCH 반경검색 마커그룹
	 * @param {Array}   RADIUS_SEARCH.m 반경검색 marker
	 * @param {Array}   RADIUS_SEARCH.c 반경검색 circle
	 * @param {object}  GYEONGMAE 경매
	 * @param {Array}   GYEONGMAE.m 경매물건 마커들
	 * @param {string}  GYEONGMAE.url 경매마커 좌표 url
	 * @param {string}  GYEONGMAE.icon 경매마커 아이콘
	 * @param {string}  GYEONGMAE.trigger 경매마커의 윈도우를 나타나게할 이벤트명 (default: click)
	 * @param {number}  GYEONGMAE.level 경매마커를 선택할수 있는 최소 레벨
	 * @param {boolean} GYEONGMAE.clustering 경매마커의 클러스터링 적용여부
	 * @param {string}  GYEONGMAE.clusterIcon 경매마커의 클러스터링 적용되었을 때 이미지 명
	 * @param {number}  GYEONGMAE.stopLevel 경매마커의 클러스터링 적용을 중지할 level
	 */
	var _markers = {
		RADIUS_SEARCH : { m: [], c: [], url: '' },
		GYEONGMAE : { m: [], url: 'gyeongmaemarker', icon:'gyeongmae.png'/*, trigger: 'mouseover'*/ },
		GONGMAE : { m: [], url: 'gongmaemarker', icon: 'gongmae.png'/*, trigger: 'mouseover'*/ },
		BOSANG: { m: [], url: 'bosangmarker', icon: 'bosang.png', clusterIcon:'bosangC.png', clustering: true, stopLevel: 11},
		PYEONIB: { m: [], url: 'pyeonibmarker', icon: 'pyeonib.png', clusterIcon:'pyeonibC.png', clustering: true },
		SILGEOLAE: { m: [], url: 'silgeolaemarker', icon: 'silgeolae.png' },
		ACCEPT_BUILDING: { m: [], url: 'acceptbuildingmarker', icon: 'acceptbuilding.png', level:13 },
		MULGEON_SEARCH: { m: [], icon: 'search.png' }
	};
	
	
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getMarkerIcon 
	 * @param {hotplace.maps.MarkerTypes} markerType
	 * @desc 마커의 icon 파일이름
	 * @return {string}
	 */
	maps.getMarkerIcon = function(markerType) {
		return _markers[markerType].icon;
	}
	
	/** 
	 * @private 
	 * @desc 마커그룹의 마커 위에 보여질 infoWindow 팝업
	 * @type  {object} 
	 * @param {Array}  RADIUS_SEARCH 반경검색 마커윈도우
	 * @param {Array}  GYEONGMAE 경매마커 윈도우
	 * @param {Array}  GONGMAE 공매마커 윈도우
	 */
	var _infoWindowsForMarker = {
		RADIUS_SEARCH : [],
		GYEONGMAE : [],
		GONGMAE : [],
		BOSANG : [],
		PYEONIB : [],
		SILGEOLAE : [],
		ACCEPT_BUILDING : [],
		MULGEON_SEARCH: []
	};
	
	
	/** 
	 * @private 
	 * @function _setCurrentBounds 
	 * @desc 현재 보이는 영역의 bounds와 margin 영역의 bounds를 설정한다. 
	 *       zoom_changed, dragend, maps.init 함수호출시 호출됨.
	 *       _convertEventObjToCustomObj 함수참조.
	 */
	function _setCurrentBounds() {
		var bnds = null;
		
		switch(_venderStr) {
		case 'daum' :
			bnds = _venderMap.getBounds();
			_currentBounds = {
				swx : bnds.ba,
				swy : bnds.ha,
				nex : bnds.fa,
				ney : bnds.ga
			};
			break;
		case 'naver' :
			bnds = _venderMap.getBounds();
			_currentBounds = {
				swx : bnds._sw.x,
				swy : bnds._sw.y,
				nex : bnds._ne.x,
				ney : bnds._ne.y
			};
			break;
		}
		
		var r = [60,60,60,20,20,20,20,20,20,20,20,20];
		
		var marginXRate =  parseFloat((_currentBounds.nex - _currentBounds.swx)/r[_getCurrentLevel()-3]);
		var marginYRate =  parseFloat((_currentBounds.ney - _currentBounds.swy)/r[_getCurrentLevel()-3]);
		
		_marginBounds.swx = _currentBounds.swx - marginXRate;
		_marginBounds.swy = _currentBounds.swy - marginYRate;
		_marginBounds.nex = _currentBounds.nex + marginXRate;
		_marginBounds.ney = _currentBounds.ney + marginYRate;
	}
	
	/** 
	 * @private 
	 * @function _setLocationBounds 
	 * @desc 레벨별로  서버에 쿼리할 bound를 설정한다
	 */
	function _setLocationBounds() {
		
		var r = [0.5,0.5,2,4,4,4,4,4,4,4,4,4];
		
		var locationXRate =  parseFloat((_marginBounds.nex - _marginBounds.swx)/r[_getCurrentLevel()-3] /*6*/);
		var locationYRate =  parseFloat((_marginBounds.ney - _marginBounds.swy)/r[_getCurrentLevel()-3]);
		
		_locationBounds.swx = _marginBounds.swx - locationXRate;
		_locationBounds.swy = _marginBounds.swy - locationYRate;
		_locationBounds.nex = _marginBounds.nex + locationXRate;
		_locationBounds.ney = _marginBounds.ney + locationYRate;
	}
	
	function _getCurrentLevel() {
		var _currentLevel = -1;
		
		switch(_venderStr) {
		case 'daum' :
			_currentLevel = _venderMap.getLevel();
			break;
		case 'naver' :
			_currentLevel = _venderMap.getZoom();
			break;
		}
		
		return _currentLevel;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getCurrentLevel 
	 * @desc 현재 보이는 지도의 줌레벨.
	 *  	 daum  zoom : [14 ~ 1]
	 * 		 naver zoom : [1 ~ 14]
	 * @return {number}
	 */
	maps.getCurrentLevel = _getCurrentLevel;
	
	/** 
	 * @private 
	 * @function _getColorByGongsiWeight 
	 * @param {object} weight
	 * @param {number} weight.colorV 스펙트럼으로 표시할 보정값
	 * @param {number} weight.minV   쿼리요청한 boundary 안에서 공시지가 최소값
	 * @param {number} weight.maxV   쿼리요청한 boundary 안에서 공시지가 최대값
	 * @param {number} weight.value  공시지가
	 * @param {number} weight.type	 공시지가 (0)
	 * @desc  공시지가 스펙트럼 값
	 * 		  RGB               |     colorV
	 * 		  R 255 G   0 B   0 |       1020
	 * 		  R 255 G 255 B   0 |        765
	 * 		  R   0 G 255 B   0	|		 510
	 *  	  R   0 G 255 B 255 |		 255
	 *  	  R   0 G   0 B 255 |  		   0
	 * @return {number}
	 */
	function _getColorByGongsiWeight(weight) {
		var color = '';
		var v = weight.colorV;
		if(v >= 1020) {
			color = 'rgb(255,0,0)';
		}
		else {
			if(v >= 765 && v < 1020) {
				color = 'rgb(255,' + (1020-v) + ',0)';
			}
			else if(v >= 510 && v < 765) {
				color = 'rgb(' + (v-510) + ',255,0)';
			}
			else if(v >= 255 && v < 510) {
				color = 'rgb(0,255,' + (510-v) + ')';
			}
			else {
				color = 'rgb(0,' + v + ',255)';
			}
		}
		
		return color;
	}
	
	maps.getColorWeight = _getColorByGongsiWeight;
	
	/** 
	 * @private 
	 * @function _drawRectangle 
	 * @param {number} swy 극남
	 * @param {number} swx 극서
	 * @param {number} ney 극북
	 * @param {number} nex 극동
	 * @param {object} css cell style
	 * @param {number} css.strokeWeight
	 * @param {number} css.strokeColor
	 * @param {number} css.strokeOpacity
	 * @param {number} css.fillColor
	 * @param {number} css.fillOpacity
	 * @param {object} cellData cell click시 보여줄 데이터
	 * @param {boolean} triggerable cell을 만들고나서 바로 info창이 열리게 할지 여부
	 * @desc  공시지가 스펙트럼 값
	 */
	function _drawRectangle(swy, swx, ney, nex, css, cellData, triggerable) {
		var rec = null;
		
		switch(_venderStr) {
		case 'daum'  :
			break;
		case 'naver' :
			rec = new _vender.Rectangle({
			    map: (_isOffCell()) ? null : _venderMap,
			    bounds: new _vender.LatLngBounds(
		    		new _vender.LatLng(swy, swx),
		    		new _vender.LatLng(ney, nex) 
			    ),
			    strokeWeight: (css && css.strokeWeight != undefined) ? css.strokeWeight : 0, 
			    strokeColor:  (css && css.strokeColor != undefined) ? css.strokeColor : '#5347AA',
			    strokeOpacity: (css && css.strokeOpacity != undefined) ? css.strokeOpacity : 0.5,
			    fillColor: (css && css.fillColor != undefined) ? css.fillColor : 'rgb(255,051,000)',
			    fillOpacity: (css && css.fillOpacity != undefined) ? css.fillOpacity : 0.1,
			    clickable: true
			});
			
			rec.data = cellData;
			
			_venderEvent.addListener(rec, 'click', function(e) {
				var r = e.overlay;
				
				/** cell center 구하기 */
				var xcDiff = parseFloat((r.data.location[2] - r.data.location[0])/2).toFixed(11);
				var ycDiff = parseFloat((r.data.location[3] - r.data.location[1])/2).toFixed(11);
				var xc = r.data.location[0] + parseFloat(xcDiff);
				var yc = r.data.location[1] + parseFloat(ycDiff);
				var location = new _vender.LatLng(yc, xc);
				/** */
				
				hotplace.dom.openInfoWindowForCell(_venderMap, location, _vender, _venderEvent, {'weight' : r.data.weight[0]},{
					'open' : function(win, obj) {
						console.log(obj);
					},
				});
				         
				hotplace.ajax({
					url: 'celldetail',
					method: 'GET',
					//async: false,
					dataType: 'json',
					data: {},
					loadEl: '#dvCellDetail',
					success: function(data, textStatus, jqXHR) {
						//hotplace.dom.createChart('canvas');
					},
					error:function() {
						
					}
				});
			});
			
			if(triggerable)	_venderEvent.trigger(rec, 'click');
			
			break;
		}
		
		return rec;
	}
	
	
	
	/** 
	 * @private
	 * @function _commXY 
	 * @param {object} data	 지도에 보여줄 좌표정보
	 * @param {number} startIdx marginbound의 극서에 가장 가까운 좌표의 index의 값
	 * @param {function} callback
	 * @param {boolean} isClustering marker를 클러스팅해서 보여줄지 여부
	 * @desc  margin bound 범위내에 있는 좌표 찾은후 넘겨받은 callback에 파라미터로 넘겨줌
	 *  	  { info: { pnu:'', radius:'', unu: '', xg:'', xgc: '', xgo:'', gunu:'' }, location: [경도(x), 위도(y)] }  
	 */
	function _commXY(data, startIdx, callback, options) {
		var len = data.length;
		
		var boundMX = _marginBounds.nex;
		var boundmY = _marginBounds.swy;
		var boundMY = _marginBounds.ney;
		var drawedCnt = 0;
		
		var id = '',
			grpCluster = {},
		    curGrp = 'x',
		    y = null,
		    info = null,
		    stopGroupping = false;
		
		for(var i = startIdx; i < len; i++) {
			info = data[i].info;
			
			
			if(options && options.isClustering && !options.stopGroupping) {
				if(_createdMarkerGroup[options.markerType][curGrp]) continue;	//대표마커가 설정된 그룹은 통과
				
				if(curGrp != info.xg) {
					if(grpCluster[curGrp]) {
						callback(grpCluster[curGrp]);
						_createdMarkerGroup[options.markerType][curGrp] = true;
						console.log(grpCluster[curGrp]);
					}
					
					curGrp = info.xg;
				}
			}
			
			if(data[i].location[0] > boundMX) break;
			y = data[i].location[1];
			
			if(y >= boundmY && y <= boundMY) {
				
				//그룹핑
				if(options && options.isClustering && !options.stopGroupping) {
					if(!_createdMarkerGroup[options.markerType][curGrp] && !grpCluster[curGrp]) {
						grpCluster[curGrp] = data[i];
						//_createdMarkerGroup[curGrp] = true;
					}
				}
				else { 
					id = data[i]['id'];
					
					if(!id /*|| !logMap[id]*/ ){
						data[i]['id'] = '1';//hotplace.createUuid();
						//logMap[data[i]['id']] = true;
						drawedCnt++;
						
						callback(data[i]);
						
					}
				}
				
				
			}
		}
		
		if(options && options.isClustering && !options.stopGroupping) {
			if(!_createdMarkerGroup[options.markerType][curGrp] && grpCluster[curGrp]) {
				callback(grpCluster[curGrp]);
				_createdMarkerGroup[options.markerType][curGrp] = true;
			}
		}
		
		console.log("drawedCnt ==> " + drawedCnt);
	}
	
	function _isStopGrouping(curLevel, stopLevel) {
		if(stopLevel == undefined || stopLevel >= curLevel) {
			return false;
		}
		
		return true;
	}
	/** 
	 * @private
	 * @function _createMarkers 
	 * @param {number} level  현재 줌레벨
	 * @param {number} startIdx marginbound의 극서에 가장 가까운 좌표의 index의 값
	 * @param {hotplace.maps.MarkerTypes} markerType
	 * @param {object} listeners 이벤트 핸들러
	 * @param {object} options 옵션
	 * @desc  margin bound 범위내에 있는 좌표 찾은후 넘겨받은 callback에 파라미터로 넘겨줌
	 */
	function _createMarkers(level, startIdx, markerType, listeners, options) {
		
		var markerData, 
		    stopGroupping = _isStopGrouping(level, options.stopLevel);
		
		switch(markerType) {
		case _markerTypes.GYEONGMAE :
			markerData = hotplace.database.getLevelData(level, _markerTypes.GYEONGMAE);
			break;
		case _markerTypes.GONGMAE :
			markerData = hotplace.database.getLevelData(level, _markerTypes.GONGMAE);
			break;
		case _markerTypes.BOSANG :
			markerData = hotplace.database.getLevelData(level, _markerTypes.BOSANG);
			break;
		case _markerTypes.PYEONIB :
			markerData = hotplace.database.getLevelData(level, _markerTypes.PYEONIB);
			break;
		case _markerTypes.SILGEOLAE :
			markerData = hotplace.database.getLevelData(level, _markerTypes.SILGEOLAE);
			break;
		case _markerTypes.ACCEPT_BUILDING :
			markerData = hotplace.database.getLevelData(level, _markerTypes.ACCEPT_BUILDING);
			break;
			
		}
		
		_commXY(markerData,
				startIdx,
				function(data) {
					maps.getMarker(markerType, data, listeners, options, stopGroupping);
				},
				{
					isClustering: options.isClustering,
					markerType: markerType,
					stopGroupping: stopGroupping 
				}
		);
		
		
		
		//clustring 옵션이 있을경우 처리
		//naver cluster 소스 사용
		//부하때문에 사용안함
		/*if(options.isClustring) {
			_markerClustering = null;
			
			
			
			var htmlMarker = {
				content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ hotplace.getContextUrl() +'resources/img/marker/cluster-marker-1.png);background-size:contain;"></div>',
			    size: _vender.Size(40, 40),
			    anchor: _vender.Point(20, 20)
			}
			
			_markerClustering = new MarkerClustering({
				minClusterSize: 2,
			    maxZoom: 10,
			    map: _venderMap,
			    markers: _markers[markerType].m,
			    disableClickZoom: true,
			    gridSize: 50,
			    icons: [htmlMarker],
			    indexGenerator: [3],
			    stylingFunction: function(clusterMarker, count) {
			    	$(clusterMarker.getElement()).find('div:first-child').text(count);
			    }
			});
			
		}*/
	}
	
	
	/** 
	 * @private 
	 * @function _createCells 
	 * @param {number} level  현재 줌레벨
	 * @param {number} startIdx marginbound의 극서에 가장 가까운 좌표의 index의 값
	 * @desc  margin bound 범위내에 있는 좌표의 cell을 그린다.
	 */
	function _createCells(level, startIdx) {
		var colorFn;
		var currCellType = _getActiveCellType();
		
	    switch(currCellType) {
		case _cellTypes.GONGSI :
			colorFn = _getColorByGongsiWeight;
			break;
		case _cellTypes.GONGSI_GR :
			colorFn = _getColorByGongsiWeight;
			break;
		default :
			colorFn = _getColorByHpWeight;
			break;
		}
		  
		_commXY(hotplace.database.getLevelData(level, currCellType),
				/*hotplace.database.getLevelLogMap(level),*/
				startIdx,
				function(data) {
					//weight 50점 밑으로는 만들지 않는다
					/*if(Math.ceil(data.weight[0].colorV) <= 50) {
						_notDrawedCells.push(data);
						return;
					}*/
					
					_cells.push(
						_drawRectangle(
							  data.location[1],
							  data.location[0],
							  data.location[3],
							  data.location[2], 
							  {
								  fillColor: colorFn(data.weight[0]),
								  fillOpacity : 0.5
							  },
							  data
						)
					);
				}
		);
	}
	
	/** 
	 * @private 
	 * @function _removeAllCells
	 * @param {boolean} isDetach - detach 여부 
	 * @desc  cell전부를 지도에서 제거한다.
	 */
	function _removeAllCells(isDetach) {
		for(var i=_cells.length-1; i>=0; i--) {
			_cells[i].setMap(null);
		}
		
		//단순히 맵에서만 제거할 것이 아니면
		if(!isDetach) _cells = [];
		
	}
	
	/** 
	 * @private 
	 * @function _restoreAllCells 
	 * @desc  detach한 cell을 다시 지도에 붙인다.
	 */
	function _restoreAllCells() {
		for(var i=_cells.length-1; i>=0; i--) {
			_cells[i].setMap(_venderMap);
		}
	}
	
	function _destroyMarkers(isRadiusExcept) {
		for(var type in _markers) {
			if((type == 'RADIUS_SEARCH' || type == 'MULGEON_SEARCH') && isRadiusExcept) continue;
			_destroyMarkerType(type);
		}
	}
	
	function _destroyMarkerType(type) {
		var marker = _markers[type];
		if(marker) {
			var arr = marker.m;
			var arrCircle = marker.c; 
			var len = arr.length;
			var lenCircle = (arrCircle) ? arrCircle.length : 0;
			
			for(var m=0; m<len; m++) {
				arr[m].setMap(null);
			}
			
			for(var c=0; c<lenCircle; c++) {
				arrCircle[c].setMap(null);
			}
			
			_markers[type].m = [];
			
			if(arrCircle) {
				_markers[type].c = [];  
			}
			
			if(_markers[type].clustering) {
				_createdMarkerGroup[type] = {};
			}
		}
		else {
			throw new Error(type + 'is not exist');
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyMarkers 
	 * @desc  마커를 전부 삭제함
	 */
	maps.destroyMarkers = _destroyMarkers;
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyMarkerType 
	 * @param {hotplace.maps.MarkerTypes} type
	 * @desc  해당 타입의 마커를 삭제함
	 */
	maps.destroyMarkerType = _destroyMarkerType;
	
	
	/** 
	 * @private 
	 * @function _convertEventObjToCustomObj 
	 * @param {string} eventName 벤더별 벤더이벤트 전부
	 * @param {object} obj 벤더 리스너 param 
	 * @desc  벤더별 이벤트 리스너 파라미터를 공통화 함
	 */
	function _convertEventObjToCustomObj(eventName, obj) {
		var returnObj;
		var latlng;
		
		switch(eventName) {
		case 'zoom_changed' :
			_setCurrentBounds();
			returnObj = _getCurrentLevel();
			break;
		case 'zoom_start': //daum
			returnObj = _venderMap.getLevel();
			break;
		case 'zooming' :   //naver
			returnObj = _venderMap.getZoom();
			break;
		case 'dragend' : 
			_setCurrentBounds();
			returnObj = _currentBounds;
			break;
		case 'click' : 
			returnObj = (_venderStr == 'naver') ? {x:obj.latlng.x, y:obj.latlng.y} : {x:obj.latLng.gb, y:obj.latLng.hb};
			break;
		case 'tilesloaded' :
			returnObj = {};
			break;
		case 'idle' :
			returnObj = {};
			break;
		case 'panning' :
			returnObj = {};
			break;
		}
		
		return returnObj;
	}
	
	/** 
	 * @private 
	 * @function _initJiJeokDoLayer 
	 * @desc  벤더별 지적도 초기화 함
	 */
	function _initJiJeokDoLayer() {
		
		//지적편집도
		if(_venderStr == 'naver') {
			_vender._cadastralLayer = new _vender.CadastralLayer();
		}
	}
	
	/** 
	 * @private 
	 * @function _initCalcArea 
	 * @desc  면적재기
	 */
	function _initCalcArea() {
		var Measure = function(buttons) {
		    this.$btnDistance = buttons.distance;
		    this.$btnArea = buttons.area;
		    this._mode = null;
		    this._bindDOMEvents();
		};
		
		$.extend(Measure.prototype, {
		    constructor: Measure,

		    startMode: function(mode) {
		        if (!mode) return;

		        if (mode === 'distance') {
		            this._startDistance();
		        } 
		        if (mode === 'area') {
		            this._startArea();
		        }
		    },

		    _startDistance: function() {
		        //var map = this.map;

		        this._distanceListeners = [
		            _venderEvent.addListener(_venderMap, 'click', this._onClickDistance.bind(this))
		        ];

		        _venderMap.setCursor("url('"+ HOME_PATH +"/img/rule.cur'), default");
		    },

		    _startArea: function() {
		       // var map = this.map;

		        this._areaListeners = [
		            _venderEvent.addListener(_venderMap, 'click', this._onClickArea.bind(this)),
		            _venderEvent.addListener(_venderMap, 'rightclick', this._finishArea.bind(this))
		        ];

		        $(document).on('mousemove.measure', this._onMouseMoveArea.bind(this));

		        _venderMap.setCursor("url('"+ hotplace.getContextUrl() +"resources/img/area.cur'), default");
		    },

		    _finishDistance: function() {
		    	_venderEvent.removeListener(this._distanceListeners);
		        delete this._distanceListeners;

		        $(document).off('mousemove.measure');

		        if (this._guideline) {
		            this._guideline.setMap(null);
		            delete this._guideline;
		        }

		        if (this._polyline) {
		            var path = this._polyline.getPath(),
		                lastCoord = path.getAt(path.getLength() - 1),
		                distance = this._polyline.getDistance();
		                // 폴리라인의 거리를 미터 단위로 반환합니다.

		            delete this._polyline;

		            if (lastCoord) {
		                this._addMileStone(lastCoord, this._fromMetersToText(distance), {
		                    'font-size': '14px',
		                    'font-weight': 'bold',
		                    'color': '#f00'
		                });
		            }
		            
		            
		        }

		        this.$btnDistance.removeClass('control-on').blur();

		        _venderMap.setCursor('auto');

		        delete this._lastDistance;
		        this._mode = null;
		    },

		    _finishArea: function() {
		    	console.log('pp');
		    	_venderEvent.removeListener(this._areaListeners);
		        delete this._areaListeners;

		        $(document).off('mousemove.measure');

		        if (this._polygon) {
		            var path = this._polygon.getPath();
		            path.pop();

		            // 폴리곤의 면적을 제곱미터 단위로 반환합니다.
		            var squarMeters = this._polygon.getAreaSize(),
		                lastCoord = path.getAt(path.getLength() - 1);

		            if (lastCoord) {
		                this._addMileStone(lastCoord, this._fromSquareMetersToText(squarMeters), {
		                    'font-size': '14px',
		                    'font-weight': 'bold',
		                    'color': '#00f'
		                });
		            }

		            delete this._polygon;
		        }

		        this.$btnArea.removeClass('area-on').blur();

		        _venderMap.setCursor('auto');

		        this._mode = null;
		        
		    },

		    finishMode: function(mode) {
		        if (!mode) return;

		        if (mode === 'distance') {
		            this._finishDistance();
		        } if (mode === 'area') {
		            this._finishArea();
		        }
		    },

		    _fromMetersToText: function(meters) {
		        meters = meters || 0;

		        var km = 1000,
		            text = meters;

		        if (meters >= km) {
		            text = parseFloat((meters / km).toFixed(1)) +'km';
		        } else {
		            text = parseFloat(meters.toFixed(1)) +'m';
		        }

		        return text;
		    },

		    _fromSquareMetersToText: function(squarMeters) {
		        squarMeters = squarMeters || 0;

		        var squarKm = 1000 * 1000,
		            text = squarMeters;

		        if (squarMeters >= squarKm) {
		            text = parseFloat((squarMeters / squarKm).toFixed(1)) + 'km<sup>2</sup>';
		        } else {
		            text = parseFloat(squarMeters.toFixed(1)) + 'm<sup>2</sup>';
		        }

		        return text;
		    },

		    _addMileStone: function(coord, text, css) {
		        if (!this._ms) this._ms = [];

		        var ms = new naver.maps.Marker({
		            position: coord,
		            icon: {
		                content: '<a href="#"><img src="' + hotplace.getContextUrl() + 'resources/img/close_icon.png" /></a>&nbsp;<div class="naver-area-div"><span>'+ text +'</span></div>',
		                anchor: new naver.maps.Point(-5, -5)
		            },
		            map: _venderMap
		        });

		        var msElement = $(ms.getElement());

		        if (css) {
		            msElement.css(css);
		        } else {
		            msElement.css('font-size', '11px');
		        }

		        this._ms.push(ms);
		    },

		    _onClickDistance: function(e) {
		        //var map = this.map,
		            coord = e.coord;

		        if (!this._polyline) {
		            // 임시로 보여줄 점선 폴리라인을 생성합니다.
		            this._guideline = new naver.maps.Polyline({
		                strokeColor: '#f00',
		                strokeWeight: 5,
		                strokeStyle: [4, 4],
		                strokeOpacity: 0.6,
		                path: [coord],
		                map: _venderMap
		            });

		            $(document).on('mousemove.measure', this._onMouseMoveDistance.bind(this));
		            this._distanceListeners.push(_venderEvent.addListener(_venderMap, 'rightclick', this._finishDistance.bind(this)));

		            // 실제 거리재기에 사용되는 폴리라인을 생성합니다.
		            this._polyline = new naver.maps.Polyline({
		                strokeColor: '#f00',
		                strokeWeight: 5,
		                strokeOpacity: 0.8,
		                path: [coord],
		                map: _venderMap
		            });

		            // 폴리라인의 거리를 미터 단위로 반환합니다.
		            this._lastDistance = this._polyline.getDistance();
		        } else {
		            this._guideline.setPath([e.coord]);
		            this._polyline.getPath().push(coord);

		            // 폴리라인의 거리를 미터 단위로 반환합니다.
		            var distance = this._polyline.getDistance();

		            this._addMileStone(coord, this._fromMetersToText(distance - this._lastDistance));

		            this._lastDistance = distance;
		        }
		    },

		    _onMouseMoveDistance: function(e) {
		        var proj = _venderMap.getProjection(),
		            coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY));
		            path = this._guideline.getPath();

		        if (path.getLength() === 2) {
		            path.pop();
		        }

		        path.push(coord);
		    },

		    _onClickArea: function(e) {
		        var coord = e.coord;

		        if (!this._polygon) {
		            this._polygon = new naver.maps.Polygon({
		                strokeColor: '#00f',
		                strokeOpacity: 0.6,
		                strokeWeight: 5,
		                fillColor: '#00f',
		                fillOpacity: 0.3,
		                paths: [coord],
		                map: _venderMap
		            });
		        } 
		        else {
		            this._polygon.getPath().push(coord);
		        }
		        
		    },

		    _onMouseMoveArea: function(e) {
		        if (!this._polygon) return;

		        var proj = _venderMap.getProjection(),
		            coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY)),
		            path = this._polygon.getPath();

		        if (path.getLength() >= 2) {
		            path.pop();
		        }

		        path.push(coord);
		    },

		    _bindMap: function(map) {

		    },

		    _unbindMap: function() {
		        this.unbindAll();
		    },

		    _bindDOMEvents: function() {
		        //this.$btnDistance.on('click.measure', this._onClickButton.bind(this, 'distance'));
		        this.$btnArea.on('click.measure', this._onClickButton.bind(this, 'area'));
		        

		    },

		    _onClickButton: function(newMode, e) {
		        e.preventDefault();

		        var btn = $(e.target),
		            mode = this._mode;

		        if (btn.hasClass('area-on')) {
		            btn.removeClass('area-on');
		        } else {
		            btn.addClass('area-on');
		        }

		        this._clearMode(mode);

		        if (mode === newMode) {
		            this._mode = null;
		            return;
		        }

		        this._mode = newMode;

		        this.startMode(newMode);
		    },

		    _clearMode: function(mode) {
		        if (!mode) return;

		        if (mode === 'distance') {
		            if (this._polyline) {
		                this._polyline.setMap(null);
		                delete this._polyline;
		            }

		            this._finishDistance();

		            if (this._ms) {
		                for (var i=0, ii=this._ms.length; i<ii; i++) {
		                    this._ms[i].setMap(null);
		                }

		                delete this._ms;
		            }
		        } else if (mode === 'area') {
		            if (this._polygon) {
		                this._polygon.setMap(null);
		                delete this._polygon;
		            }

		            this._finishArea();
		        }
		    }
		});

		var measures = new Measure({
		    distance: $('#btnCalcDistance'),
		    area: $('#btnCalcArea')
		});
	}
	
	/** 
	 * @private 
	 * @function _showCellLayer 
	 * @desc  cellType에 해당하는 cell layer를 보여줌
	 */
	function _showCellLayer() {
		var db = hotplace.database;
		var currentLevel = _getCurrentLevel();
		
		if(!db.hasData(currentLevel, _getActiveCellType())) return;
		var startIdx = db.getStartXIdx(_getActiveCellType(), _marginBounds.swx, currentLevel);
		
		_createCells(currentLevel, startIdx);
	}
	
	function _createMarkerTrigger(map, marker, win, markerType) {
		switch(markerType) {
		case 'GYEONGMAE' :
			hotplace.gyeongmae.markerClick(map, marker, win);
			break;
		case 'GONGMAE' :
			hotplace.gongmae.markerClick(map, marker, win);
			break;
		case 'BOSANG' :
			hotplace.bosangpyeonib.markerClick(map, marker, win, '보상');
			break;
		case 'PYEONIB' :
			hotplace.bosangpyeonib.markerClick(map, marker, win, '편입');
			break;
		case 'SILGEOLAE' :
			hotplace.silgeolae.markerClick(map, marker, win);
			break;
		case 'ACCEPT_BUILDING' :
			hotplace.acceptbuilding.markerClick(map, marker, win);
			break;
		}
	}
	
	/** 
	 * @private 
	 * @function _showMarkers 
	 * @desc  활성화시킨 marker group 보여주기 
	 */
	function _showMarkers(markerType) {
		var db = hotplace.database;
		var currentLevel = _getCurrentLevel();
		
		if(!db.hasData(currentLevel, markerType/*_markerTypes.GYEONGMAE*/)) return;
		var startIdx = db.getStartXIdx(markerType/*_markerTypes.GYEONGMAE*/, _marginBounds.swx, currentLevel);
		var listeners = {};
		
		if(_markers[markerType].trigger == undefined) {
			listeners['click'] = function(map, marker, win) {
				_createMarkerTrigger(map, marker, win, markerType);
			}
		}
		else {
			listeners[_markers[markerType].trigger] = function(map, marker, win) {
				_createMarkerTrigger(map, marker, win, markerType);
			}
		}
		
		_createMarkers(currentLevel, startIdx, markerType/*_markerTypes.GYEONGMAE*/, listeners, {
			hasInfoWindow: true,
			isAjaxContent: true,
			radius:0,
			icon: _markers[markerType].icon/*'blink.gif'*/,
			clusterIcon: _markers[markerType].clusterIcon,
			isClustering: _markers[markerType].clustering,
			stopLevel: _markers[markerType].stopLevel,
			curLevel: currentLevel
		});
	}
	
	/** 
	 * @private 
	 * @function _initLayers 
	 * @param {number} level 줌레벨
	 * @param {boolean} isFixBound locationBound 고정여부 (기본값 false0
	 * @desc  hotplace.maps.showCellLayer가 호출될 때 동작함
	 */
	function _initLayers(level) {
		_removeAllCells();
		_setLocationBounds();
		_notDrawedCells = [];
		hotplace.dom.closeInfoWindowForCell();
		hotplace.database.initLevel(level);
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function isActiveSalesView 
	 * @returns {boolean}
	 * @desc  현재 레벨이 물건보기 활성화 레벨인지 여부
	 */
	maps.isActiveSalesView = function() {
		return _getCurrentLevel() >= hotplace.config.salesViewLevel;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyMarkerWindow 
	 * @param {hotplace.maps.MarkerTypes} markerType 마커타입
	 * @desc  해당 마커타입의 infoWindow 삭제
	 */
	maps.destroyMarkerWindow = function(markerType) {
		if(markerType) {
			var len = _infoWindowsForMarker[markerType].length;
			if(len > 0) {
				for(var i=0; i<len; i++) {
					_infoWindowsForMarker[markerType][i].close();
				}
				
				_infoWindowsForMarker[markerType] = [];
			}
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function destroyAllMarkerWindow 
	 * @desc  모든 마커타입의 infoWindow 삭제
	 */
	maps.destroyAllMarkerWindow = function() {
		for(var k in _infoWindowsForMarker) {
			maps.destroyMarkerWindow(k);
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function setLevel 
	 * @param {number} level 줌레벨
	 * @desc  줌레벨 설정
	 */
	maps.setLevel = function(level) {
		switch(_venderStr) {
		case 'naver' :
			_venderMap.setZoom(level);
			break;
		case 'daum' :
			_venderMap.setLevel(level);
			break;
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getClickedCell 
	 * @param {object} latlng
	 * @param {number} latlmg.x 경도
	 * @param {number} latlmg.y 위도
	 * @desc  맵 클릭시 클릭지점의 cell이 생성이 안되었을때 동적으로 생성함
	 * @deprecated
	 */
	maps.getClickedCell = function(latlng) {
		
		var len = _notDrawedCells.length;
		var swx = 0, swy = 0, nex = 0, ney = 0;
		
		for(var x=0; x<len; x++) {
			swx = _notDrawedCells[x].location[0];
			nex = _notDrawedCells[x].location[2];
			swy = _notDrawedCells[x].location[1];
			ney = _notDrawedCells[x].location[3];
			
			if(latlng.x >= swx && latlng.x <= nex) {
				if(latlng.y >= swy && latlng.y <= ney) {
					_cells.push(_drawRectangle(
							swy, swx, ney, nex, 
						  {
							  fillColor: 'rgba(255,255,255,0.0)',
							  fillOpacity : 0.1
						  },
						  _notDrawedCells[x],
						  true
					));
					
					_notDrawedCells.slice(x,1);
					break;
				}
			}
		}
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getVender 
	 * @returns {object} - (ex. naver.maps, daum.maps)
	 * @desc  맵 벤더객체를 가져옴  
	 */
	maps.getVender = function() {
		return _vender;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getVenderMap 
	 * @returns {object} - (ex. naver.maps.Map, daum.maps.Map)
	 * @desc  벤더의 맵 객체를 가져옴 
	 */
	maps.getVenderMap = function() {
		return _venderMap;
	}
	
	/** 
	 * @memberof hotplace.maps 
	 * @function getCurrentLevel 
	 * @returns {number} - from 3 to 13
	 * @desc  맵의 현재 줌레벨을 가져옴 
	 */
	maps.getCurrentLevel = function() {
		return _getCurrentLevel();
	}
	
	/** 
	 * @memberof hotplace.maps
	 * @name event 
	 * @type {object}
	 * @property {listener} addListener 
	 * @desc  event listener 
	 */
	maps.event = {
		/** 
		 * @typedef {function} listener
		 * @param {string} eventName - 이벤트 명
		 * @param {function} callback
		 */
		addListener : function(eventName, callback) {
			
			if(!hotplace.isSupport(eventName, _events)) {
				throw new Error('[' + eventName + ' 는(은) 지원하지 않습니다](supported : zoom_changed, bounds_changed');
			}
			
			var _fnListener;
			
			switch(_venderStr) {
			case 'naver' : 
			case 'daum'  :
				_fnListener = _venderEvent.addListener;
				break;
			}
			
			if(eventName == 'zoom_start') {
				eventName = (_venderStr == 'naver') ? 'zooming' : 'zoom_start';
			}
			
			_fnListener(_venderMap, eventName, function(e) {
				return function(obj) {
					var convertedObj = _convertEventObjToCustomObj(e, obj);
					callback(_venderMap, convertedObj);
				}
				
			}(eventName));
			
		},
	};
	
	/** 
	 * @memberof hotplace.maps 
	 * @function init 
	 * @param {string} venderStr - (naver|daum)
	 * @param {object} mapOptions
	 * @param {number} mapOptions.X 경도
	 * @param {number} mapOptions.Y 위도
	 * @param {object} listeners 이벤트 리스너 객체
	 * @param {function} listeners.eventName 이벤트 리스너
	 * @param {function} afterInit init완료후 실행할 함수
	 */
	maps.init = function(venderStr, mapOptions, listeners, afterInit) {
		if(_initCalled) throw new Error('init 함수는 이미 호출 되었습니다');
		
		if(hotplace.isSupport(venderStr, _venders)) {
			_venderStr = venderStr;
			_initCalled = true;
			
			switch(venderStr) {
			case 'naver' :
				_vender = naver.maps;
				_venderEvent = _vender.Event;
				
				var registry = new naver.maps.MapTypeRegistry();
				
				_venderMap = new _vender.Map(_container, {
				 	center: new _vender.LatLng(mapOptions.Y, mapOptions.X), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
			        zoom: mapOptions.level, //지도의 초기 줌 레벨
			        mapTypes: registry,
			        mapTypeControl: true,
			        mapTypeControlOptions: {
			        	//style: _vender.MapTypeControlStyle.DROPDOWN
			        	style: _vender.MapTypeControlStyle.BUTTON,
			        	position: _vender.Position.TOP_RIGHT
			        },
			        minZoom: mapOptions.minZoom || 3,
			        logoControl: false,
			        disableDoubleClickZoom: true
			        //maxZoom: mapOptions.maxZoom || 13
				});
				
				//_venderMap.mapTypes.set(naver.maps.MapTypeId.NORMAL, naver.maps.NaverMapTypeOption.getNormalMap());
				//_venderMap.mapTypes.set(naver.maps.MapTypeId.TERRAIN, naver.maps.NaverMapTypeOption. getTerrainMap());
				//_venderMap.mapTypes.set(naver.maps.MapTypeId.HYBRID, naver.maps.NaverMapTypeOption.getHybridMap());
				
				_venderMap.mapTypes.set(naver.maps.MapTypeId.NORMAL, naver.maps.NaverMapTypeOption.getNormalMap());
				_venderMap.mapTypes.set(naver.maps.MapTypeId.HYBRID, naver.maps.NaverMapTypeOption.getHybridMap());
				
				
				break;
			case 'daum' :
				_vender = daum.maps;
				_venderEvent = daum.maps.event;
				_venderMap = new _vender.Map(_container, {
					center: new _vender.LatLng(mapOptions.Y, mapOptions.X),
					level: mapOptions.level
				});
				
				break;
			}
			
			_setCurrentBounds();
			_initJiJeokDoLayer();
			_initCalcArea();
			
			if(listeners) {
				for(var eventName in listeners) {
					maps.event.addListener(eventName, listeners[eventName]);
				}
			}
			
			if(afterInit) afterInit(_venderMap);
		}
		else {
			throw new Error('[' + venderStr + '는(은) 지원하지 않습니다](supported : naver, daum');
		}
	}

	/** 
	 * @memberof hotplace.maps 
	 * @function panToBounds 
	 * @param {number} lat - 위도
	 * @param {number} lng - 위도
	 * @param {function} moveAfterFn - 지도 위치이동 후 실행할 함수
	 */
	maps.panToBounds = function(lat, lng, moveAfterFn) {
		
		if(_venderStr == 'naver') {
			_venderMap.morph(new _vender.LatLng(lat, lng), hotplace.config.addrSearchPanLevel, {duration: 100});
		}
		else if(_venderStr == 'daum') {
			/*_venderMap.panTo(new _vender.LatLngBounds(
	                new _vender.LatLng(lat - size, lng - size),
	                new _vender.LatLng(lat + size, lng + size)
	        ));*/
		}
		
		moveAfterFn();
	}
	
	maps.getClusterMarker = function(markerType, data, listeners, options) {
		
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function getMarker
	 * @param {string}  markerType 마커타입
	 * @param {number}  lat 경도좌표
	 * @param {number}  lng 위도좌표
	 * @param {object}  listeners 마커이벤트 핸들러
	 * @param {object}  options 옵션
	 * @param {boolean} options.hasInfoWindow 클릭시 infoWindow 사용여부
	 * @param {string}  options.infoWinFormName 
	 * @param {number}  options.radius 마커주위 반경 (0일경우 표시안함) 
	 * @param {boolean} options.isClustering 마커 클러스트링 설정여부
	 * @param {string}  options.icon 아이콘 이미지명 
	 * @param {object}  options.size 아이콘 이미지 크기 
	 * @param {number}  options.size.x 아이콘 이미지 width px
	 * @param {number}  options.size.y 아이콘 이미지 height px 
	 * @param {object}  options.datas 데이터옵션 
	 * @param {object}  options.datas.params 파라미터 정보
	 * @param {boolean} stopGroupping - 그룹핑을 중지할지 여부
	 * @desc 해당지점에 마커를 그리고 옵션값에 따라 해당지점을 중심으로 원을 그림 
	 */
	maps.getMarker = function(markerType, data, listeners, options, stopGroupping) {
		var newMarker, newInfoWindow = null, content = '';
		
		newMarker = new _vender.Marker({
			position: new _vender.LatLng(data.location[1], data.location[0]),
			map: _venderMap
		});
		
		newMarker._data = data;
		
		if(options.icon) {
			var x = 22, y = 33, cx = 22, cy = 33;
			if(options.size) {
				x = options.size.x;
				y = options.size.y;
			}
			
			//클러스트링된 마커구별
			if(options.isClustering && !stopGroupping && data.info.xgc >= hotplace.config.markerGrpCount) {
				content = '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ hotplace.getContextUrl() +'resources/img/marker/' + options.clusterIcon + ');background-size:contain;">' + data.info.xgc + '</div>';
			}
			else {
				content = '<img src="'+ hotplace.getContextUrl() +'resources/img/marker/' + options.icon + '" alt="" ' +
       		 			  'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
       		 			  '-webkit-user-select: none; position: absolute; width: ' + x + 'px; height: ' + y + 'px; left: 0px; top: 0px;">';
			}
			
			newMarker.setOptions('icon', {
		        content: content,
                size: new _vender.Size(x, y),
                anchor: new _vender.Point(x/2, y)
			});
		}
		
		_markers[markerType].m.push(newMarker);
		
		if(options.hasInfoWindow) {
			var winContent = {anchorSkew: true};
			
			//로컬정보로 윈도우 창 정보를 설정할 지 여부
			if(!options.isAjaxContent) {
				var tForm = hotplace.dom.getTemplate(options.infoWinFormName);
	            winContent.content = tForm({datas: options.datas.params});
	        } 
			 
			newInfoWindow = new _vender.InfoWindow(winContent);
			
			_infoWindowsForMarker[markerType].push(newInfoWindow);
		}
		
		if(listeners) {
			for(var eventName in listeners) {
				_venderEvent.addListener(newMarker, eventName, function($$eventName, $$newInfoWindow) {
					return function(obj) {
						
						listeners[$$eventName](_venderMap, newMarker, $$newInfoWindow);
					}
				}(eventName, newInfoWindow));
			}
		}
		
		if(options.radius) {
			var radiusSearchCircle = new _vender.Circle({
			    map: _venderMap,
			    center:  new _vender.LatLng(data.location[1], data.location[0]),
			    radius: options.radius,
			    fillColor: 'rgba(250,245,245)',
			    fillOpacity: 0,
			    clickable: true,
			    zIndex: 30000000
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'click', function(e) {
				hotplace.dom.insertFormInmodal('radiusSearchResultForm');
				hotplace.dom.openModal(options.datas.params.address + ' 일대 (반경: ' + options.radius + 'm)');
				
				$("#example-table").tabulator({
				    height:600, // set height of table
				    fitColumns:true, //fit columns to width of table (optional)
				    columns:[ //Define Table Columns
				        {title:"지번", field:"name", width:300},
				        {title:"소유구분", field:"age", align:"left", formatter:"progress", width:150},
				        {title:"지목", field:"col", width:150},
				        {title:"면적", field:"dob", sorter:"date", align:"center", width:150},
				    ],
				    rowClick:function(e, row){ //trigger an alert message when the row is clicked
				        alert("Row " + row.getData().id + " Clicked!!!!");
				    },
				});
				
				var tabledata = [
	                 {id:1, name:"서울시 강남구 도곡동 963", age:"12", col:"red", dob:""},
	                 {id:2, name:"서울시 강남구 도곡동 964", age:"1", col:"blue", dob:"14/05/1982"},
	                 {id:3, name:"서울시 강남구 도곡동 965", age:"42", col:"green", dob:"22/05/1982"},
	                 {id:4, name:"서울시 강남구 도곡동 966", age:"125", col:"orange", dob:"01/08/1980"},
	                 {id:5, name:"서울시 강남구 도곡동 967", age:"16", col:"yellow", dob:"31/01/1999"},
	             ];
				
				setTimeout(function() {
					$("#example-table").tabulator("setData", tabledata);
				}, 1000);
				
				
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'mouseover', function(e) {
				radiusSearchCircle.setOptions({
		            fillOpacity: 0.5
		        });
			});
			
			_venderEvent.addListener(radiusSearchCircle, 'mouseout', function(e) {
				radiusSearchCircle.setOptions({
		            fillOpacity: 0
		        });
			});
			
			_markers[markerType].c.push(radiusSearchCircle);
		}
	},
	
	/**
	 * @memberof hotplace.maps 
	 * @function appendCell
	 * @desc 마우스로 드래그시 화면밖에 있다가 안으로 들어왔을때 안그려진 cell을 찾아 그린다.
	 */
	maps.appendCell = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(db.hasData(_currentLevel, _getActiveCellType())) {
			var startIdx = db.getStartXIdx(_getActiveCellType(), _marginBounds.swx, _currentLevel);
			_createCells(_currentLevel, startIdx);
		}
	};
	
	/**
	 * @memberof hotplace.maps 
	 * @function appendMarker
	 * @desc 마우스로 드래그시 화면밖에 있다가 안으로 들어왔을때 안그려진 marker를 찾아 그린다.
	 */
	maps.appendMarker = function() {
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		var activeMarkers = maps.getActiveMarkers();
		var activeMarkerLen = activeMarkers.length;
		for(var a=0; a<activeMarkerLen; a++) {
			if(db.hasData(_currentLevel, _markerTypes[activeMarkers[a]])) {
				var startIdx = db.getStartXIdx(_markerTypes[activeMarkers[a]], _marginBounds.swx, _currentLevel);
				
				var listeners = {};
				
				if(_markers[activeMarkers[a]].trigger == undefined) {
					listeners['click'] = (function(mType) {
						return function(map, marker, win) {
							_createMarkerTrigger(map, marker, win, mType);
						}
					}(_markerTypes[activeMarkers[a]]));
				}
				else {
					listeners[_markers[activeMarkers[a]].trigger] = (function(mType) {
						return function(map, marker, win) {
							_createMarkerTrigger(map, marker, win, mType);
						}
					}(_markerTypes[activeMarkers[a]]));
				}
				
				_createMarkers(_currentLevel, startIdx, _markerTypes[activeMarkers[a]], listeners, {
					hasInfoWindow: true,
					isAjaxContent: true,
					radius:0,
					icon: _markers[activeMarkers[a]].icon,
					clusterIcon: _markers[activeMarkers[a]].clusterIcon,
					isClustering: _markers[activeMarkers[a]].clustering,
					stopLevel: _markers[activeMarkers[a]].stopLevel
				});
			}
		}
	};
	
	/**
	 * @memberof hotplace.maps 
	 * @function isInLocationBounds
	 * @desc 현재 화면이 location bounds범위안에 있는지 여부  
	 * @param {object} bnds
	 * @param {number} bnds.swx - 보이는 화면 극서좌표
	 * @param {number} bnds.nex - 보이는 화면 극동좌표
	 * @param {number} bnds.swy - 보이는 화면 극남좌표
	 * @param {number} bnds.ney - 보이는 화면 극북좌표
	 * @return {boolean} - location bound 안에 있으면 true 
	 */
	maps.isInLocationBounds = function(bnds) {
		return !(_locationBounds.swx > bnds.swx || 
				 _locationBounds.nex < bnds.nex ||
				 _locationBounds.swy > bnds.swy ||
				 _locationBounds.ney < bnds.ney);
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function showCellLayer
	 * @param {function} callback
	 * @param {boolean} isMaskTran multi ajax사용여부 
	 * @desc celltype의 cell layer를 보여준다  
	 */
	maps.showCellLayer = function(callback, isMaskTran) {
		
		if(_isOffCell()) return;
		
		var db = hotplace.database;
		var _currentLevel = _getCurrentLevel();
		
		if(_venderMap) {
			
			//location
			//캐쉬구현(보류)
			if(false/*db.isCached(_currentLevel)*/) {
				//_showCellsLayer();
			}
			else {
				//_initLayers(_currentLevel);
				_setLocationBounds();
				hotplace.dom.closeInfoWindowForCell();
				hotplace.database.initLevel(_currentLevel);
				
				var adjustLevel = (_currentLevel >=3 && _currentLevel <=5) ? _currentLevel + 1 : _currentLevel;
				hotplace.getPlainText('locationbounds', {
					 level: adjustLevel/*_currentLevel*/,
					 swx  : _locationBounds.swx,
					 nex  : _locationBounds.nex,
					 swy  : _locationBounds.swy,
					 ney  : _locationBounds.ney,
					 year : hotplace.dom.getShowCellYear() + '01',
					 type : _getActiveCellType()
				}, function(json) {
					try {
						db.setLevelData(_currentLevel, _getActiveCellType(), json.datas);
						_removeAllCells();
						_showCellLayer();
						if(callback) callback();
					}
					catch(e) {
						throw e;
					}
				}, 
				true,
				isMaskTran,
				function() {
					//hotplace.dom.offMenuButton(hotplace.dom.getMenuBtn().CELL/*.HEAT_MAP*/);
					//hotplace.maps.cellToggle();
					
					//heatmap 보기 선택을 끄기로 재설정한다.
					$('input[name=rdoHeatmap]').trigger('change', true);
					hotplace.dom.offMenuListButton('menu-cell-list');
				});
			}
		}
	}
	
	function _markerLevelLimit() {
		if(maps.isActiveSalesView()) {
			$('#dvSalesView input[type="checkbox"]').each(function() {
				var $this = $(this);
				var type = $this.data('value');
				var minLevel = null;
				var checked = $this.prop('checked');
				var currentLevel = _getCurrentLevel();
				var prevState = $this.data('prev');
				
				if(type) {
					minLevel = _markers[type].level;
					if(minLevel) {
						if(currentLevel >= minLevel) {
							$this.prop('disabled', false);
							
							/*if(!checked && prevState == 'on') {
								$this.prop('checked', true);
								_markerGroupOnOff[type] = 1;
							}*/
						}
						else {
							$this.prop('disabled', true);
							if(checked) {
								$this.prop('checked', false);
								//$this.data('prev', 'on');
								_markerGroupOnOff[type] = 0;
								
							}
							else {
								$this.data('prev', 'off');
							}
						}
					}
				} 
			})
		}
	}
	
	
	/**
	 * @memberof hotplace.maps 
	 * @function showMarkers
	 * @param {function} callback
	 * @param {boolean} isMaskTran multi ajax사용여부 
	 * @desc marker type의 marker를 보여준다  
	 */
	maps.showMarkers = function(callback, isMaskTran) {
		_markerLevelLimit();
		var currentLevel = _getCurrentLevel(),
		    activeMarkers = maps.getActiveMarkers(),
		    activeMarkerCnt = activeMarkers.length,
		    url = '', stopGrouping = 'Y';
		
		//active level 비교
		if(maps.isActiveSalesView() && activeMarkerCnt > 0) {
			//_destroyMarkerType(_markerTypes.GYEONGMAE);
			_destroyMarkers(true);
			_setLocationBounds();
			if(_venderMap) {
				
				for(var k=0; k<activeMarkerCnt; k++) {
					url = _markers[activeMarkers[k]].url;
					(function(x) {
						stopGrouping = _isStopGrouping(currentLevel, _markers[activeMarkers[x]].stopLevel);
						hotplace.getPlainText(url, {
							 swx : _locationBounds.swx,
							 nex : _locationBounds.nex,
							 swy : _locationBounds.swy,
							 ney : _locationBounds.ney,
							 level: currentLevel,
							 stopGrouping: (stopGrouping) ? 'Y' : 'N'
						}, function(json) {
							try {
								hotplace.database.setLevelData(currentLevel, _markerTypes[activeMarkers[x]], json.datas);
								_showMarkers(_markerTypes[activeMarkers[x]]);
								if(callback) callback();
								console.log(json);
							}
							catch(e) {
								throw e;
							}
						},
						true,
						isMaskTran,
						function() {
							//$('#dvSalesView')
							hotplace.dom.uncheckAll('dvSalesView');
						});
					}(k));
					
					
				}
				
				
			}
		}
		else if(!maps.isActiveSalesView()) {
			//활성화 레벨이 아닌데 열려있는 경우 
			hotplace.dom.hideMenuList('menu-mulgeon-list');
		}
	}
	
	/**
	 * @memberof hotplace.maps 
	 * @function showJijeokLayer
	 * @desc 맵벤더의 지적도 layer를 보여준다
	 * @param {('on'|'off')} onoff 지적도를 보여줄 버튼 switch 상태
	 * @param {object} $btn - jquery button object
	 */
	maps.showJijeokLayer = function(onOff, $btn) {
		  
		if(onOff == 'on') {
			if(_venderStr == 'naver') {
				_vender._cadastralLayer.setMap(null);
			}
			else if(_venderStr == 'daum') {
				_venderMap.removeOverlayMapTypeId(_vender.MapTypeId.USE_DISTRICT);
			}
			
			$btn.data('switch', 'off');
			$btn.removeClass('jijeok-on');
		}
		else if(onOff == 'off') {
			if(_venderStr == 'naver') {
				_vender._cadastralLayer.setMap(_venderMap);
			}
			else if(_venderStr == 'daum') {
				_venderMap.addOverlayMapTypeId(_vender.MapTypeId.USE_DISTRICT);
			}
			
			$btn.data('switch', 'on');
			$btn.addClass('jijeok-on');
		}
	}
}(
	hotplace.maps = hotplace.maps || {},
	jQuery	
));