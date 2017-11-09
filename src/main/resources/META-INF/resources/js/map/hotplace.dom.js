/**
 * @namespace hotplace.dom
 * */
(function(dom, $) {
	
	var _loadEl;
	var _loadTxt = '';//'로딩 중입니다';
	var _loadEndCount = 0;
	
	/**
	 * @private
	 * @typedef {object} loadEffects
	 * @desc load mask type
	 * {@link https://github.com/vadimsva/waitMe/blob/gh-pages/index.html waitMe}
	 */
	var _loadEffects = {
		bounce: 'bounce',
		rotateplane: 'rotateplane',
		stretch: 'stretch',
		orbit: 'orbit',
		roundBounce: 'roundBounce',
		win8: 'win8',
		win8_linear: 'win8_linear',
		ios: 'ios',
		facebook: 'facebook',
		rotation: 'rotation',
		timer: 'timer',
		pulse: 'pulse',
		progressBar: 'progressBar',
		bouncePulse: 'bouncePulse'
	};
	
	/**
	 * @private
	 * @desc 맵 메인화면의 메뉴버튼을 모아놓은 DIV
	 */
	var _btnMapDiv = $('#mapButtons');
	
	/**
	 * @private
	 * @type {object}
	 * @desc javascript template engine handlebar를 통해 서버에서 가져온 html을 저장
	 */
	var _templates = {};
	
	/**
	 * @private
	 * @type {object}
	 * @desc cell layer의 한 cell을 클릭했을때 나타나는 infoWindow
	 */
	var _infoWindowForCell = null;
	
	/**
	 * @private
	 * @desc cell layer에 기본적으로 표시할 데이터 연도 
	 */
	var _showCellYear = 2017;
	
	/**
	 * @private
	 * @type {function}
	 * @desc 모달창이 닫힌후 실행되는 함수 
	 */
	var _modalCloseAfterFn = function() {};
	
	/**
	 * @private
	 * @type {function}
	 * @desc 메인화면 버튼메뉴 id값 설정 
	 */
	var _menuBtnIdCfg = function() {
		return {
			'USER_LOGIN' : 'btnUserLogin',
			'HEAT_MAP': 'btnLayerView'
		};
	};
	
	var _layer = {};
	
	/**
	 * @memberof hotplace.dom
	 * @function getMenuBtn
	 * @returns {object} 
	 * @desc 메인화면 메뉴버튼 아이디값
	 */
	dom.getMenuBtn = _menuBtnIdCfg;
	/**
	 * @private
	 * @function _runWaitMe
	 * @param {object} loadEl loadmask를 적용할 jquery 객체
	 * @param {number} num loadmask style 선택(1|2|3)
	 * @param {loadEffects} effect loadmask effect type
	 * @param {string} msg 로딩 메시지
	 * @desc open source waitMe 설정
	 * {@link https://github.com/vadimsva/waitMe/blob/gh-pages/index.html waitMe}
	 */
	function _runWaitMe(loadEl, num, effect, msg){
		
		var fontSize = '';
		var maxSize = '';
		var loadTxt = msg || '';//'로딩 중입니다';
		var textPos = '';
		
		switch (num) {
			case 1:
			maxSize = '';
			textPos = 'vertical';
			fontSize = '25px';
			break;
			case 2:
			loadTxt = '';
			maxSize = 30;
			textPos = 'vertical';
			break;
			case 3:
			maxSize = 30;
			textPos = 'horizontal';
			fontSize = '18px';
			break;
		}
		
		_loadEl = loadEl;
		_loadEl.waitMe({
			effect: effect,
			text: loadTxt,
			bg: 'rgba(255,255,255,0.4)',//'rgba(255,255,255,0.4)',
			color: '#000',
			maxSize: maxSize,
			source: 'img.svg',
			textPos: textPos,
			fontSize: fontSize,
			onClose: function() {}
		});
	}
	
	/**
	 * @private
	 * @function _makeInfoWindowForCell
	 * @param {object} vender 맵 벤더객체
	 * @param {object} venderEvent 맵 벤더이벤트객체
	 * @param {*} data handlebars를 통해 template에 전달할 데이터
	 * @param {object} listeners 리스너 객체
	 * @param {function} listeners.eventName 리스너
	 * @returns {object} infoWindow
	 * @desc cell layer의 한 cell을 클릭했을때 나타나는 infoWindow를 생성함
	 *       생성후 전역변수 _infoWindowForCell에 저장
	 */
	function _makeInfoWindowForCell(vender, venderEvent, data, listeners) {
		var template = dom.getTemplate('cellForm');
		
		_infoWindowForCell = new vender.InfoWindow({
	        content: template(data),
	        borderWidth: 1
	        //zIndex: 1000
	    });
		
		_infoWindowForCell.setOptions('zIndex', 1000);
		
		if(listeners) {
			for(var eventName in listeners) {
				venderEvent.addListener(_infoWindowForCell, eventName, function($$eventName, $$infoWindowForCell) {
					return function(obj) {
						
						listeners[$$eventName]($$infoWindowForCell, obj);
					}
				}(eventName, _infoWindowForCell));
			}
		}
		
		
		
		return _infoWindowForCell;
	}
	
	/**
	 * @private
	 * @function _bindModalCloseEvent
	 * @param {function} closeFn close event handler
	 * @desc modal창이 닫힐때 실행될 함수를 저장
	 */
	function _bindModalCloseEvent(closeFn) {
		_modalCloseAfterFn = closeFn;
	}
	
	
	
	/**
	 * @memberof hotplace.dom
	 * @function getCurrentFnAfterModalClose
	 * @returns {function}
	 * @desc modal창이 닫힐때 실행될 함수를 반환
	 */
	dom.getCurrentFnAfterModalClose = function() {
		return _modalCloseAfterFn;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openLayer
	 * @param {string} targetId 해당레이어를 나오게 할 버튼 id값
	 * @param {object} options 맵 벤더이벤트객체
	 * @param {number} options.top 레이어의 top위치
	 * @desc 맵의 메뉴버튼을 눌렀을때 보여질 레이어를 생성함
	 *       생성후 전역변수 _infoWindowForCell에 저장
	 */
	dom.openLayer = function(targetId, options) {
		
		if(!_layer[targetId]) _layer[targetId] = $('#'+targetId);
		
		//var $close = $layer.find('.close');
		var width = _layer[targetId].outerWidth();
		var ypos = options.top;
		var xpos = options.left;
		var marginLeft = 0;
		
		if(xpos==undefined){
			xpos = '50%';
			marginLeft = -(width/2);
		}
		
		if(!_layer[targetId].is(':visible')){
			_layer[targetId].css({'top':ypos+'px','left':xpos,'margin-left':marginLeft})
		    	  .show();
		}
		
		/*$close.bind('click',function(){
			if($layer.is(':visible')){
				$layer.hide();
			}
			
			return false;
		});*/
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeLayer
	 * @param {string} targetId 해당레이어를 사라지게 할 버튼 id값
	 * @desc 맵의 메뉴버튼을 눌렀을때 보이고 있는 레이어를 감춤
	 */
	dom.closeLayer = function(targetId) {
		if(_layer[targetId].is(':visible')){
			_layer[targetId].hide();
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openInfoWindowForCell
	 * @param {object} 
	 * @param {object} location 맵벤더 LatLng 객체
	 * @param {object} vender 맵벤더 객체(naver.maps, daum.maps)
	 * @param {object} venderEvent 맵벤더 이벤트객체
	 * @param {*} data handlebars를 통해 template에 전달할 데이터
	 * @param {object} listeners 리스너 객체
	 * @param {function} listeners.eventName 리스너
	 * @desc cell 정보를 보여줄 infoWindow를 생성하고 open한다
	 */
	dom.openInfoWindowForCell = function(map, location, vender, venderEvent, data, listeners) {
		_infoWindowForCell = _makeInfoWindowForCell(vender, venderEvent, data, listeners);
		_infoWindowForCell.open(map, location);
		
		//event handler가 걸려있는지 확인
		var ev = $._data(document.getElementById('btnCellClose'), 'events');
		if(!ev || !ev.click) {
			$('#btnCellClose').on('click', function(e) {
				dom.closeInfoWindowForCell();
			});
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeInfoWindowForCell
	 * @desc cell 정보를 나타내는 infoWindow를 닫은후 제거한다.
	 */
	dom.closeInfoWindowForCell = function() {
		if(_infoWindowForCell) {
			_infoWindowForCell.close();
			_infoWindowForCell = null;
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function initTooltip
	 * @param {string} selectorClass tootip을 적용할 class 값
	 * @desc open source tooltipster 설정
	 * {@link https://github.com/louisameline/tooltipster-follower tooltipster}
	 */
	dom.initTooltip = function(selectorClass, options) {
		var target = {
			theme: 'tooltipster-borderless',
			trigger: 'custom',
			side: 'top',
			functionBefore: function(instance, helper) {
				return true;
			}
		};
		
		$.extend(target, options);
		// first on page load, initialize all tooltips
		$('.' + selectorClass).tooltipster(target);
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openTooltip
	 * @param {string} selector  tooltip을 open할 jquery selector
	 * @desc 해당 셀렉터의 tooltipster open
	 */
	dom.openTooltip = function(selector) {
		$(selector).tooltipster('open');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeTooltip
	 * @param {string} selector  tooltip을 close할 jquery selector
	 * @desc 해당 셀렉터의 tooltipster close
	 */
	dom.closeTooltip = function(selector) {
		$(selector).tooltipster('close');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeAllTooltip
	 * @param {string} CLASS  tooltip을 close할 jquery class selector
	 * @desc 해당 셀렉터의 모든 tooltipster close
	 */
	dom.closeAllTooltip = function(CLASS) {
		$(CLASS).each(function(index) {
			$(this).tooltipster('close');
		})
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openModal
	 * @param {string} title  modal창 헤더부분에 표시할 title
	 * @param {string} modalSize modal창 사이즈('bigsize'|'fullsize') 
	 * @param {function} closeFn modal창 close handler
	 * @desc 모달창 open
	 */
	dom.openModal = function(title, modalSize, closeFn) {
		$('#spModalTitle').text(title);
		
		if(!modalSize) modalSize = 'fullsize';
		
		$('#containerModal > .modal-dialog').removeClass('modal-fullsize modal-bigsize modal-center');
		$('#containerModal > .modal-content').removeClass('modal-fullsize modal-bigsize modal-center'); 
		
		$('#containerModal > .modal-dialog').addClass('modal-' + modalSize);
		$('#containerModal > .modal-content').addClass('modal-' + modalSize);
		
		
		$('#containerModal').modal('show');
		_bindModalCloseEvent(closeFn);
	}
	
	dom.openCenterModal = function(title, size, closeFn) {
		$('#spCenterModalTitle').text(title);
		
		if(size) {
			var $modal = $('#centerModal .modal-content');
			$modal.css({'width':size.width, 'height': size.height});
		}
		
		$('#centerModal').modal('show');
		_bindModalCloseEvent(closeFn || function() {});
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function createChart
	 * @desc chart 생성
	 */
	dom.createChart = function() {
		hotplace.chart.showEchartBar();
		hotplace.chart.showEchartScatter();
		hotplace.chart.showEchartPie();
		hotplace.chart.showEchartLine();  
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showMask
	 * @param {string} loadEl loadmask element selector  
	 * @param {string} msg 마스크 로딩시 보여질 메시지
	 * @desc waitMe mask show
	 */
	dom.showMask = function(loadEl, msg) {
		if(loadEl) {
			loadEl = $(loadEl);
		}
		else {
			loadEl = $('body');
		}
		_runWaitMe(loadEl, 1, _loadEffects.ios, msg);
	};
	
	/**
	 * @memberof hotplace.dom
	 * @function showMaskTransaction
	 * @param {number} count 하나의 마스크로 처리할 ajax 처리갯수  
	 * @param {string} loadEl loadmask element selector
	 * @param {string} msg 마스크 로딩시 보여질 메시지  
	 * @desc waitMe mask show
	 */
	dom.showMaskTransaction = function(count, loadEl, msg) {
		_loadEndCount = count || 0;
		dom.showMask(loadEl, msg);
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideMaskTransaction
	 * @desc waitMe mask hide
	 */
	dom.hideMaskTransaction = function() {
		--_loadEndCount;
		if(_loadEndCount == 0) {
			dom.hideMask();
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideMask
	 * @desc waitMe mask hide
	 */
	dom.hideMask = function() {
		_loadEl.waitMe('hide');
	};
	
	/**
	 * @memberof hotplace.dom
	 * @function getTemplate
	 * @param {string} name 저장할 template의 키값
	 * @returns {object} - Handlebars.compile() 결과값
	 * @desc waitMe mask hide
	 */
	dom.getTemplate = function(name) {
		if(_templates[name] === undefined) {
			var url = 'resources/templates/';
			
			hotplace.ajax({
				url : url + name + '.handlebars',
				async : false,
				dataType : 'html',
				method : 'GET',
				activeMask : false,
				success : function(data, textStatus, jqXHR) {
					_templates[name] = Handlebars.compile(data);
				},
				error: function() {
					throw new Error('html template error')
				}
			});
			
		}
		
		return _templates[name];
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function insertFormInmodal
	 * @param {string} name 서버에서 가져올 handlebars 파일명, 태그(<)로 시작하면 jquery로 dom에 붙인다 
	 * @returns {object} - Handlebars.compile() 결과값
	 * @desc 모달창 body부분에 html을 삽입한다
	 */
	dom.insertFormInmodal = function(name) {
		
		var elContent = $('#dvModalContent');
		if(($.trim(name)).indexOf('<') == 0) {/*html 직접입력*/
			elContent.html(name);
		}
		else {
			var tForm = dom.getTemplate(name);
			elContent.html(tForm());
		}
	}
	
	
	
	/**
	 * @memberof hotplace.dom
	 * @function getSelectOptions
	 * @param {Array.<string[]>} data htnl select option value,text 
	 * @param {string} title 서버에서 가져올 handlebars 파일명, 태그(<)로 시작하면 jquery로 dom에 붙인다 
	 * @returns {string} - html select option string
	 * @desc select box의 option string을 구한다
	 */
	dom.getSelectOptions = function(data, title) {
		var len = data.length;
		var html = '<option value="">- ' + title + '  -</option>';
		for(var i=0; i < len; i++) {
			html += '<option value="' + data[i][0] + '">' + data[i][1] + '</option>'; 
		}
		
		return html;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function addButtonInMap
	 * @param {object} params 
	 * @param {string} params.id 생성할 button id
	 * @param {string} params.glyphicon bootstrap glyphicon name 
	 * @param {string} params.attr 추가할 버튼 속성
	 * @param {string} params.clazz 추가할 버튼 class
	 * @param {function} params.callback 버튼 클릭이벤트 리스너
	 * @desc 지도에 메뉴 버튼을 생성함
	 */
	dom.addButtonInMap = function(params) {
		
		var template = function(disabled){
			
			return disabled ? '<button id="{0}" type="button" disabled class="button button-disabled {3} {4} {5}" {1}>{2}</button>' :
				              '<button id="{0}" type="button" class="button {3} {4} {5}" {1}>{2}</button>';
		}
		
		if(params) {
			var len = params.length;
			var btns = '';
			
			for(var i=0; i<len; i++) {
				if(params[i].glyphicon){
					btns += template(params[i].disabled).format(params[i].id, params[i].attr || '', params[i].title || '', 'glyphicon', 'glyphicon-' + params[i].glyphicon, params[i].clazz || '');
				}
				else {
					btns += template(params[i].disabled).format(params[i].id, params[i].attr || '', params[i].title || '', params[i].clazz || '');
				}
			}
			
			if(btns) {
				_btnMapDiv.html(btns);
				
				//event handler
				for(var i=0; i<len; i++) {
					$('#' + params[i].id).on('click', params[i].callback);
				}
			}
		}
	}
	
	dom.captureToCanvas = function() {
	    var nodesToRecover = [];
	    var nodesToRemove = [];
	    var targetElem = $('#map');
	    //var els =  document.getElementsByTagName('svg')[0]
		//var elsLen = els.length;
	    var svgElem = targetElem.find('svg\\:svg');

	    svgElem.each(function(index, node) {
	        var parentNode = node.parentNode;
	        var svg = parentNode.innerHTML;

	        var canvas = document.createElement('canvas');

	        canvg(canvas, svg);

	        nodesToRecover.push({
	            parent: parentNode,
	            child: node
	        });
	        parentNode.removeChild(node);

	        nodesToRemove.push({
	            parent: parentNode,
	            child: canvas
	        });

	        parentNode.appendChild(canvas);
	    });
	    
	    hotplace.ajax({
	    	url: 'sample/naverForm',
	    	method: 'GET',
	    	dataType: 'html',
	    	success: function(data) {
	    		console.log(data);
	    		var d = $('#test2');
	    		d.html(data)
	    		console.log(d);
	    		html2canvas(d, {
	    			allowTaint: true,
	    			taintTest: false,
	    			useCORS: true,
	    			profile: true,
	    			onrendered: function(canvas) {
	    				//$('body').append(canvas);
	    				console.log(canvas)
	    				var img = canvas.toDataURL('image/png');
	    				d.html('');
	    				$('#ii').attr('src', img)
	    			}
	    		});
	    	}
	    });
	    
		/*html2canvas(targetElem, {
			allowTaint: true,
			taintTest: false,
			useCORS: true,
			profile: true,
			onrendered: function(canvas) {
				$('body').append(canvas);
			}
		});*/
		
	}
	
	
	
	/**
	 * @memberof hotplace.dom
	 * @function viewProfit
	 * @param {string} addr 주소
	 * @desc 수지분석 폼 보기
	 * {@link https://github.com/simeydotme/jQuery-ui-Slider-Pips jQuery-ui-slider-pips} 
	 */
	dom.viewProfit = function(params) {
		var tForm = dom.getTemplate('profitForm');
		
		console.log(params)
		$('#dvModalContent').html(tForm(params));
		
		//txt tooltip 
		hotplace.dom.initTooltip('txtProfitTooltip',{trigger: 'hover'});
		hotplace.sujibunseog.init();
		hotplace.calc.profit.initCalc(params);
		
		dom.openModal('수지 분석(소재지: ' + params.address + ')', 'fullsize', function() {
			try {
				//닫힐때 토지 이용규제 tooltip이 열려있으면 tooltip을 닫는다.
				dom.closeTooltip('.profitTooltip');
			}
			catch(e) {} //툴팁을 한번도 open 하지 않은 상태에서 close하면 error 발생
		});
	}
	
	var _yearRangeMode = 'manual';
	
	/**
	 * @memberof hotplace.dom
	 * @function enableYearRangeDiv
	 * @param {boolean} enabled 타임시리얼 DIV 활성화 여부
	 * @desc 타임시리얼 DIV 활성화 여부
	 */
	dom.enableYearRangeDiv = function(enabled) {
		var dv = $('#dvYearRange');
		var autoBtn = $('#btnAutoYear');
		dv.rangeSlider({enabled:enabled});
		
		if(enabled) {
			autoBtn.removeAttr('disabled');
		}
		else {
			autoBtn.prop('disabled', true);
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showYearRangeDiv
	 * @param {number} mx 보여줄 최근연도
	 * @param {number} mn 보여줄 지난연도
	 * @desc 타임시리얼 bar DIV
	 * {@link http://ghusse.github.io/jQRangeSlider/documentation.html jQRangeSlider} 
	 */
	dom.showYearRangeDiv = function(mx, mn) {
		var max = 2017, min = 2011, i = 0, step = 1;
		var range = max - min - 1;
		var el = $('#dvYearRange');
		
		/*
		 * Auto
		 * */
		var runFn = hotplace.maps.showCellLayer;
		var callback = function() {
			i++;
			if(i<=range) {
				setTimeout(function() {
					el.rangeSlider('scrollRight', step);
				}, 2000);
			}
			else {
				i = 0;
				_yearRangeMode = 'manual';
				$('#btnAutoYear').bootstrapToggle('off');
				dom.removeBodyAllMask();
			}
		};
		
		el.rangeSlider({
			arrows: false,
			//enabled: false,
			bounds: {min: min, max: max},
			defaultValues: {min: max-1, max: max},
			step: 1,
			range:{min:1, max:1},
			formatter: function(val) {
				if(val == max) {
					val = '오늘'; 
				}
				else {
					val = (max - val) + '년전';
				}
				return val;
			}
		});
		
		el.on('userValuesChanged', function(e, data){
			_showCellYear = data.values.max;
			
			dom.addBodyAllMask();
			setTimeout(function() {
				if(_yearRangeMode == 'auto') {
					runFn(callback);
				}
				else {
					runFn();
					dom.removeBodyAllMask();
				}
			}, 100);
		});
		
		el.show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showAutoYearRangeDiv
	 * @param {number} mx 보여줄 최근연도
	 * @param {number} mn 보여줄 지난연도
	 * @desc 타임시리얼 자동재생 button DIV
	 */
	dom.showAutoYearRangeDiv = function() {
		
		var el = $('#dvAutoYearRange');
		
		$('#btnAutoYear').bootstrapToggle({
			size:'mini'
		});
		
		$('#btnAutoYear').on('change', function() {
			if($(this).prop('checked')) {
				_yearRangeMode = 'auto';
				$('#dvYearRange').rangeSlider('scrollLeft', 100);
			}
			else {
				_yearRangeMode == 'auto';
			}
		});
		
		el.show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function getShowCellYear
	 * @returns {number} 보이는 cell의 데이터 연도
	 * @desc 보이는 cell의 데이터 연도를 가져온다
	 */
	dom.getShowCellYear = function() {
		return _showCellYear;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideYearRangeDiv
	 * @desc 타임시리얼 bar DIV 를 감춘다.
	 */
	dom.hideYearRangeDiv = function() {
		var el = $('#dvYearRange');
		el.hide();
		el.rangeSlider('destroy');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function addBodyAllMask
	 * @desc body위에 사용자의 action을 차단할 목적으로 mask를 씌운다
	 */
	dom.addBodyAllMask = function() {
		$('#dimScreen').show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function removeBodyAllMask
	 * @desc body위에 사용자의 action을 차단할 목적의 mask를 제거한다
	 */
	dom.removeBodyAllMask = function() {
		$('#dimScreen').hide();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function loadScript
	 * @param {string} url - script 경로
	 * @param {function} loadFn - script onload handler
	 * @desc 스크립트를 동적으로 로딩한다
	 */
	dom.loadScript = function(url, loadFn) {
		var script = document.createElement('script');
		
		if(loadFn) 	script.onload = loadFn;
		script.src = hotplace.getContextUrl() + url;
		document.body.appendChild(script);
	}
	
	dom.showAuthMsg = function(fn, msg) {
		var tForm = dom.getTemplate('authmsgForm');
		$('#dvCenterModalContent').html(tForm());
		
		$('#authMsg').html(msg || '로그인후 이용하세요');
		
		dom.openCenterModal('', {width: '50%', height:'30%'}, fn);
	}
	
	dom.showLoginForm = function(gubun, fn) {
		var tForm = (gubun == 'IN') ? dom.getTemplate('loginForm') : dom.getTemplate('logoutForm');
		$('#dvCenterModalContent').html(tForm());
		
		dom.openCenterModal('', {width: '500px', height:'350px'}, fn);
	}
	
	dom.toggleOnlyMenuButton = function(btnId) {
		var $btn = $('#' + btnId);
		var sw = $btn.data('switch');
		$btn.data('switch', ((sw == 'on') ? 'off' : 'on'));
		$btn.toggleClass('button-on');
	}
	
	dom.offMenuButton = function(btnId) {
		var $btn = $('#' + btnId);
		$btn.data('switch', 'off');
		$btn.removeClass('button-on');
	}
	
	dom.logout = function(fn) {
		hotplace.ajax({
			url: 'logout',
			method: 'POST',
			dataType: 'text',
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				var jo = $.parseJSON(data);
				if(jo.success) {
					if(fn) fn();
				}
			},
			error: function() {
				
			}
		});
	}
	
	dom.closeModal = function() {
		$('#containerModal').modal('hide');
		$('#centerModal').modal('hide');
	}
	
	$(document).on('hidden.bs.modal', '#containerModal,#centerModal', function() {
		_modalCloseAfterFn();
	})
}(
	hotplace.dom = hotplace.dom || {},
	jQuery
));