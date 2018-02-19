/**
 * @namespace hotplace.dom
 * */
(function(dom, $) {
	
	var _loadEl;
	var _loadTxt = '';//'로딩 중입니다';
	var _loadEndCount = 0;
	//rangeSlider 설정
	var _sliderGrp = {};
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
	
	var _lisMapUl = $('#menu > ul');
	
	var _rightMenu = $('#rightMenu');
	
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
	 * @desc 모달창이 열린후 실행되는 함수 
	 */
	var _modalOpenAfterFn = function() {};
	
	/**
	 * @private
	 * @type {function}
	 * @desc 메인화면 버튼메뉴 id값 설정 
	 */
	var _menuBtnIdCfg = function() {
		return {
			'USER_LOGIN' : /*'btnUserLogin'*/'li_menu_login',
			'HEAT_MAP': 'btnLayerView',
			'CELL': 'li_menu_cell'
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
	 * @private
	 * @function _bindModalOpenEvent
	 * @param {function} openFn close event handler
	 * @desc modal창이 열린직후 실행될 함수를 저장
	 */
	function _bindModalOpenEvent(openFn) {
		_modalOpenAfterFn = openFn;
	}
	
	function _toggleMinimap(sw) {
		$('.minimap').each(function() {
			if(sw == 'on') {
				$(this).show();
			}
			else {
				$(this).hide();
			}
		});
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
	dom.openModal = function(title, modalSize, closeFn, openFn) {
		$('#spModalTitle').text(title);
		
		if(!modalSize) modalSize = 'fullsize';
		
		$('#containerModal > .modal-dialog').removeClass('modal-fullsize modal-bigsize modal-center');
		$('#containerModal > .modal-dialog > .modal-content').removeClass('modal-fullsize modal-bigsize modal-center'); 
		
		$('#containerModal > .modal-dialog').addClass('modal-' + modalSize);
		$('#containerModal > .modal-dialog > .modal-content').addClass('modal-' + modalSize);
		
		
		$('#containerModal').modal('show');
		_bindModalCloseEvent(closeFn  || function() {});
		_bindModalOpenEvent(openFn || function() {});
	}
	
	dom.openCenterModal = function(title, size, closeFn, openFn) {
		$('#spCenterModalTitle').text(title);
		
		if(size) {
			var $modal = $('#centerModal .modal-content');
			$modal.css({'width':size.width, 'height': size.height});
		}
		
		$('#centerModal').modal('show');
		_bindModalCloseEvent(closeFn || function() {});
		_bindModalOpenEvent(openFn  || function() {});
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
	/*dom.addButtonInMap = function(params) {
		
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
	}*/
	
	var _exceptPreventBubblingDivs = ['dvGyeonggongSearch', 'dvAddressSearch', 'dvSalesView', 'dvHeatmap', 'dvTooja'];
	
	function _isExceptPreventBubbingDiv(id) {
		var len = _exceptPreventBubblingDivs.length;
		
		for(var i=0; i<len; i++) {
			if(id == _exceptPreventBubblingDivs[i]) return true;
		}
		
		return false;
	}
	
	function _checkElementPreventBubbing(target) {
		var len = _exceptPreventBubblingDivs.length;
		for(var i=0; i<len; i++) {
			if($(target).closest($('#' + _exceptPreventBubblingDivs[i])).length > 0) return true;
		}
		
		return false;
	}
	
	var _doPreventBubbling = function(e) {
		var target = e.target;
		var id = target.id;
		if(target.tagName === 'LABEL') return true;
		
		if(_isExceptPreventBubbingDiv(id)) return false;
		
		return _checkElementPreventBubbing(target);
	}
	
	dom.addRightMenuInMap = function(params) {
		var template = function(){
			var tmp  = '<p id="{0}" {1} >';
				tmp += '<img src="' + hotplace.getContextUrl() + 'resources/img/menu/{2}.png" />';
				tmp += '</p>';
			
			return tmp;
		}
		
		if(params) {
			var len = params.length;
			var rMenus = '';
			
			for(var i=0; i<len; i++) {
				rMenus += template()
					  	 .format(
							  params[i].menu, params[i].datas || '',  params[i].menu
					  	 );
			}
			
			if(rMenus) {
				_rightMenu.html(rMenus);
				
				for(var i=0; i<len; i++) {
					(function(ii) {
						$('#' + params[ii].menu).on('click', function() {
							var toggle = $(this).data('toggle');
							var $img = $(this).children('img');
							
							if(toggle == 'off') {
								$img.prop('src', $img.prop('src').replace('.png', '_on.png'));
								$(this).data('toggle', 'on');
								
								if(params[ii].callbackAll) {
									params[ii].callbackAll($(this));
								} 
								else if(params[ii].callbackOn) {
									params[ii].callbackOn($(this));
								} 
							}
							else {
								$img.prop('src', $img.prop('src').replace('_on.png', '.png'));
								$(this).data('toggle', 'off');
								if(params[ii].callbackAll) {
									params[ii].callbackAll($(this));
								} 
								else if(params[ii].callbackOff) {
									params[ii].callbackOff($(this));
								}
							}
							
						})
					})(i);
				}
			}
		}
	}
	
	dom.checkSession = function(cb) {
		hotplace.ajax({
			url: 'checkSession',
			method: 'GET',
			dataType: 'text',
			activeMask: false,
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				cb(jo.success);
			}
		});
	}
	
	
	dom.addMenuInMap = function(params) {
		var template = function(listDv, disabled, titleOff){
			var tmp  = '<li id="li_{0}" data-switch="{1}" {2} class="' + (disabled ? 'disabled' : 'enabled') + '">';
				tmp += (disabled) ? '<img src="' + hotplace.getContextUrl() + 'resources/img/menu/{3}_disabled.png" class="menu-disabled"/>' : '<img src="' + hotplace.getContextUrl() + 'resources/img/menu/{3}.png" />';
				tmp += (titleOff) ? '{4}' : '<p class="desc"><img src="' + hotplace.getContextUrl() + 'resources/img/menu/{4}_title.png" class="menu-title"/></p>';
				tmp += '<p class="over"><img src="' + hotplace.getContextUrl() + 'resources/img/menu/{5}_on.png" /></p>';
				tmp += (listDv) ? '<div id="{6}" class="{7}"></div></li>' : '{6}{7}</li>';
			
			return tmp;
		}
		
		if(params) {
			var len = params.length;
			var lis = '';
			
			for(var i=0; i<len; i++) {
				lis += template(params[i].listDv, params[i].disabled, params[i].titleOff)
					  .format(
							  params[i].menu,
							  params[i].sw ? params[i].sw : 'off',
							  params[i].datas || '',
							  params[i].menu,
							  params[i].titleOff ? '' : params[i].menu,
							  params[i].menu,
							  params[i].listDv ? params[i].listDv : '',
							  params[i].clazz ? params[i].clazz : '');
			}
			
			if(lis) {
				_lisMapUl.html(lis);
				
				//event handler
				for(var i=0; i<len; i++) {
					(function(ii) {
						$('#li_' + params[ii].menu).on('click', function(e) {
							console.log(e.target);
							if($(this).hasClass('disabled')) return;
							if(_doPreventBubbling(e)) return;
							
							
							var $p = $(this).find('p.over');
							var $img = $(this).find('p.desc img');
							var $list = $(this).children('div');
							var sw = $(this).data('switch');
							$(this).data('switch', ((sw == 'on') ? 'off' : 'on'));
							
							if(sw == 'off') {
								if($list.get(0)) $list.show();
								$p.css('opacity', '1');
								$img.css('opacity', '0');
								
								if(params[ii].callbackAll) {
									params[ii].callbackAll($(this));
								}
								else if(params[ii].callbackOn) {
									params[ii].callbackOn($(this));
								}
							}
							else {
								if($list.get(0)) $list.hide();
								$p.css('opacity', '0');
								$img.css('opacity', '1');
								
								if(params[ii].callbackAll) {
									params[ii].callbackAll($(this));
								}
								else if(params[ii].callbackOff) {
									params[ii].callbackOff($(this));
								}
								
							}
						})
					}(i));
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
	
	dom.viewHpGrade = function(params) {
		var tForm = dom.getTemplate('cate_fn/hpgradeForm');
		
		console.log(params)
		$('#dvModalContent').html(tForm(params));
		
		dom.openModal('HP등급보기 (소재지: ' + params.address + ')', 'fullsize', function() {
			
		}, function() {
			hotplace.chart.drawLineChart('dvHpGradeDefault', [
			    //["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]
			    ["5년전",2],["4년전",3],["3년전",6],["2년전",8],["1년전",9],["오늘",10]
			]);
		});
		
	}
	
	dom.viewLimitLandUse = function(params) {
		var tForm = dom.getTemplate('cate_fn/lluForm');
		
		console.log(params)
		$('#dvCenterModalContent').html(tForm(params));
		
		dom.openCenterModal('토지이용규제현황보기 (소재지: ' + params.address + ')', {width: '1000px', height: '800px'}, function() {
			
		});
	}
	
	dom.viewRegGwansim = function(params) {
		var tForm = dom.getTemplate('cate_fn/gwansimForm');
		
		console.log(params)
		$('#dvCenterModalContent').html(tForm(params));
		
		dom.openCenterModal('관심물건등록 (소재지: ' + params.address + ')', {width: '450px', height: '450px'}, function() {
			
		});
		
		hotplace.location.viewGwansim.init();
	}
	
	dom.viewRegMaemul = function(params) {
		var tForm = dom.getTemplate('cate_fn/maemulForm');
		
		console.log(params)
		$('#dvCenterModalContent').html(tForm(params));
		
		dom.openCenterModal('매물등록 (소재지: ' + params.address + ')', {width: '450px', height: '500px'}, function() {
			
		}, function() {
			hotplace.location.viewMaemul.init();
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
		
		//el.show();
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
		
		//el.show();
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
		
		$('#authMsg').html(msg || '로그인후 이용하세요 <button class="btn btn-success" id="btnDirectLogin">로그인하기</button>');
		
		dom.openCenterModal('', {width: '50%', height:'30%'}, fn);
	}
	
	dom.showNotice = function() {
		var tForm = dom.getTemplate('noticeForm');
		$('#dvCenterModalContent').html(tForm());
		hotplace.notice.showPage();
		dom.openCenterModal('공지사항', {width: '80%', height:'70%'});
	}
	
	dom.showLoginForm = function(gubun, fn) {
		var tForm = ''; //(gubun == 'IN') ? dom.getTemplate('loginForm') : dom.getTemplate('logoutForm');
		
		if(gubun == 'IN') {
			if(_templates['loginForm'] == undefined) {
				hotplace.ajax({
					async: false,
					url: 'handlebar/login',
					dataType : 'html',
					method : 'GET',
					activeMask : false,
					success : function(data, textStatus, jqXHR) {
						_templates['loginForm'] = Handlebars.compile(data);
					},
					error: function() {
						throw new Error('html template error')
					}
				});
			}
			
			tForm = _templates['loginForm'];
		}
		else {
			tForm = dom.getTemplate('logoutForm');
		}
		
		$('#dvCenterModalContent').html(tForm({path: hotplace.getContextUrl()}));
		hotplace.login.init();
		
		dom.openCenterModal('', {width: '700px', height:'800px'}, fn);
	}
	
	dom.toggleOnlyMenuButton = function(btnId) {
		var $btn = $('#' + btnId);
		var sw = $btn.data('switch');
		$btn.data('switch', ((sw == 'on') ? 'off' : 'on'));
		$btn.toggleClass('button-on');
	}
	
	dom.offMenuButton = function(/*btnId*/liId) {
		/*var $btn = $('#' + btnId);
		$btn.data('switch', 'off');
		$btn.removeClass('button-on');*/
		var $li = $('#' + liId);
		
		var $p = $li.find('p.over');
		var $img = $li.find('p.desc img');
		var $list = $li.find('div > img');
		if($list.get(0)) $list.hide();
		$p.css('opacity', '0');
		$img.css('opacity', '1');
		
		
		$li.data('switch', 'off');
	}
	
	dom.offMenuListButton = function(listId) {
		$('#' + listId).trigger('click');
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
	
	dom.hideMenuList = function(targetId) {
		var $list = $('#' + targetId);
		
		if($list.is(':visible')) {
			$list.hide();
			$list.parent().trigger('click');
		}
	};
	
	dom.uncheckAll = function(dv) {
		//view 변경
		$('#' + dv + ' .checkbox input[type=checkbox]').each(function() {
			$(this).prop('checked', false);
		});
		
		//상태변경
		hotplace.maps.setAllOffMarkers();
	};
	
	dom.hideMinimaps = function() {
		_toggleMinimap('off');
	}
	
	dom.showMinimaps = function() {
		_toggleMinimap('on');
	}
	
	dom.initTimeline = function() {
		$('.btn-timeview').click(function(){
			var $this = $(this);
			
			var sw = $this.data('switch');
			
			if(sw == 'off'){
				
				$this.css('backgroundColor','rgb(42, 124, 221)')
				     .css('color','#fff');
				$('#dvTimeview').css('width','360px');
				$this.data('switch', 'on');
				
				$('#dvYearRange').show();
				$('#dvAutoYearRange').show();
				$('#dvYearRange').rangeSlider('resize');
			}
			else{
				$this.css('backgroundColor','#fff')
					 .css('color','#333');
				$('#dvTimeview').css('width','60px');
				$this.data('switch', 'off');
				$('#dvYearRange').hide();
				$('#dvAutoYearRange').hide();
			}
		});
	}
	

	
	$(document).on('hidden.bs.modal', '#containerModal,#centerModal', function() {
		_modalCloseAfterFn();
	});
	
	$(document).on('shown.bs.modal', '#containerModal,#centerModal', function() {
		_modalOpenAfterFn();
	});
	
	//user menu tab
	$(document).on('click', '.btn-pref .btn', function() {
		 $('.btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
		 $(this).removeClass('btn-default').addClass('btn-primary');
	});
	
	//로그인 메시지에서 로그인 화면으로 전환
	$(document).on('click', '#btnDirectLogin', function() {
		//이전에 설정된 동작은 마무리한다.
		_modalCloseAfterFn();
		
		_modalCloseAfterFn = function() {
			$('#rmenu_user').trigger('click', {
				callbackOn: dom.rightMenuUserCallback
			});
		};
		
		dom.closeModal();
	});

	dom.rightMenuUserCallback = function($this) {
		dom.checkSession(function(hasSession) {
			dom.showLoginForm((hasSession) ? 'OUT' : 'IN', function() {
				$this.trigger('click');
			});
		});
	}
	
	dom.showEventAlarm = function() {
		var tForm = dom.getTemplate('alarmForm');
		$('#dvCenterModalContent').html(tForm({path: hotplace.getContextUrl()}));
		
		dom.openCenterModal('', {width: '580px', height: '750px'});
	}
	
	dom.showContactUs = function(closeFn) {
		var tForm = dom.getTemplate('contactusForm');
		$('#dvCenterModalContent').html(tForm({path: hotplace.getContextUrl()}));
		
		dom.openCenterModal('', {width: '800px', height: '800px'}, closeFn);
	}
	
	dom.initSlider = function(gName, isNew, targetIds, bounds, defaultValues) {
		if(isNew && _sliderGrp[gName]) return;
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
						
			_sliderGrp[gName][_sliderGrp[gName].length - 1].bind('valuesChanged', function(e, data) {
				var id = e.currentTarget.id;
				var values = data.values;
			});
			
		}
	}
	
}(
	hotplace.dom = hotplace.dom || {},
	jQuery
));