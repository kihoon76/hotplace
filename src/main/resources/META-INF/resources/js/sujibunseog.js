/**
 * @namespace hotplace.sujibunseog
 */
(function(sujibunseog, $) {
	
	/**
	 * @private
	 * @function _workSpinner
	 * @param {object} $txt spinner의 textbox jquery object
	 * @param {string} upDown spinner updown('up'|'down')
	 * @desc spinner up/down 동작 컨트롤
	 */
	function _workSpinner($txt, upDown, fnStr) {
		var step, 
		    viewVal = 0,
		    dataVal = 0,
		    suffix = $txt.data('suffix'),
		    min = $txt.data('min'),
		    max = $txt.data('max'),
		    type = $txt.data('type'),
		    curVal = parseFloat($txt.data('value'));
		
		// min max가 0일 경우 step안에 있는 값만 허용
		if(min == '0' && max == '0') {
			step = $txt.data('step');
			
			//초기 index 설정
			var idx = $txt.data('index');
			
			if(idx == undefined) {
				for(var i=0; i<step.length; i++) {
					if(step[i] == curVal) {
						$txt.data('index', idx = i)
						break;
					}
				}
			}
			
			if(idx == undefined) throw new Error(curVal + '값은 step에 없습니다.');
			
			if(upDown == 'up') {
				if(idx == step.length - 1) return;
				dataVal = step[++idx]; 
			}
			else {
				if(idx == 0) return;
				dataVal = step[--idx];
			}
			
			$txt.data('index', idx);
		}
		else {
			var strStep = $txt.data('step');
			var fractionDigits = strStep.toString().getDecimalCount();
			step = parseFloat(strStep);
			if(upDown == 'up') {
				var nextVal = curVal + step;
				if(max == undefined || nextVal <= parseFloat(max)) {
					if(fractionDigits > -1) {
						dataVal = nextVal.toFixed(fractionDigits) 
					}
					else {
						dataVal = nextVal;
					}
				}
				else  {
					dataVal = max;
				}
			}
			else {
				var prevVal = curVal - step;
				if(min == undefined || prevVal >= parseFloat(min)) {
					if(fractionDigits > -1) {
						dataVal = prevVal.toFixed(fractionDigits);
					}
					else {
						dataVal = prevVal;
					}
				}
				else  {
					dataVal = min;
				}
			}
		}
		
		$txt.data('value', dataVal);
		switch(type) {
		case 'money' :
			viewVal = dataVal.toString().money() + suffix;
			break;
		default :
			viewVal = dataVal + suffix;
			break;
		}
		
	    $txt.val(viewVal);
	    hotplace.calc.profit[fnStr]();
	}
	
	sujibunseog.init = function() {
		//수지분석 상세보기 collapse
		$('#detailView').on('click', function() {
			if($(this).hasClass('glyphicon-chevron-up')) {
				$(this).removeClass('glyphicon-chevron-up');
				$(this).addClass('glyphicon-chevron-down');
				
				$('tr.collapse.out').each(function(idx) {
					$(this).removeClass('out');
					$(this).addClass('in');
				});
			}
			else {
				$(this).removeClass('glyphicon-chevron-down');
				$(this).addClass('glyphicon-chevron-up');
				
				$('tr.collapse.in').each(function(idx) {
					$(this).removeClass('in');
					$(this).addClass('out');
				});
			}
		});
		
		//수지분석 토지이용규제 변경 내역 보기
		$('#btnViewLandLimit').on('click', function(e) {
			if(!e.currentTarget.secondCall) {
				
				e.currentTarget.secondCall = true;
				dom.initTooltip('profitTooltip',{side: 'left'});
				//$(this).trigger('click');
			}
			
			var onOff = $(this).data('switch');
			if(onOff == 'off') {
				hotplace.dom.openTooltip('#btnViewLandLimit');
				$(this).data('switch', 'on');
				$(this).html(' 토지이용규제 변경내역닫기');
				$(this).removeClass('glyphicon-folder-close');
				$(this).addClass('glyphicon-folder-open');
			}
			else {
				hotplace.dom.closeTooltip('#btnViewLandLimit');
				$(this).data('switch', 'off');
				$(this).html(' 토지이용규제 변경내역보기');
				$(this).removeClass('glyphicon-folder-open');
				$(this).addClass('glyphicon-folder-close');
			}
		});
		
		var stepYangdose2 = $('#stepYangdose2');
		
		//매입주체 
		$('input[name="radioOwn"]').on('click', function(e) {
			var targetId = e.target.id;
			//개인 (양도세 세율)
			if(id == 'radioPrivate') {
				
			}
			else {
				
			}
			
		});
		
		//재산세 checkbox (주택)
		$('#chkJaesanse').on('change', function() {
			var $txtJaesanseH1 = $('#txtJaesanseH1');
			var $txtJaesanseH2 = $('#txtJaesanseH2');
			var $txtJaesanseH3 = $('#txtJaesanseH3');
			var $WJaesanse2    = $('#WJaesanse2');
			var $stepOwnTerm   = $('#stepOwnTerm');
			
			if($(this).is(':checked')) {
				$txtJaesanseH1.prop('disabled', false);
				$txtJaesanseH2.prop('disabled', false);
				$txtJaesanseH3.prop('disabled', false);
				$WJaesanse2.prop('disabled', false);
			}
			else {
				$txtJaesanseH1.prop('disabled', true);
				$txtJaesanseH2.prop('disabled', true);
				$txtJaesanseH3.prop('disabled', true);
				$WJaesanse2.prop('disabled', true);
			}
			
			hotplace.calc.profit.calcJaesanse2(false, true);
		});
		
		//양도세 비사업용 체크 
		$('#chkYangdose').on('click', function() {
			hotplace.calc.profit.calcYangdose();
		});
		
		//농지보전부담금 감면 체크
		$('#chkFarmBudam').on('click', function() {
			var $txtFarmBudam = $('#txtFarmBudam');
			var $WFarmBudam = $('#WFarmBudam');
			
			if($(this).is(':checked')) {
				$txtFarmBudam.prop('disabled', true);
				$WFarmBudam.prop('disabled', true);
				hotplace.calc.profit.calcFarmBudam(true);
			}
			else {
				$txtFarmBudam.prop('disabled', false);
				$WFarmBudam.prop('disabled', false);
				hotplace.calc.profit.calcFarmBudam(false);
			}
		});
		
		hotplace.validation.numberOnly('#txtJaesanseH1', function() {
			hotplace.calc.profit.calcJaesanse2();
		});
		
		hotplace.validation.numberOnly('#stepYangdose', function($this) {
			var step = hotplace.calc.profit.makeStep($this.data('value'), hotplace.config.yangdoseStepPercent);
			$this.data('step', step);
			hotplace.calc.profit.calcYangdose();
		});
		
		hotplace.validation.numberOnly('#stepGeonchugGongsa', function($this) {
			hotplace.calc.profit.calcGeonchugGongsa();
		});
		
		hotplace.validation.numberOnly('#stepTomogGongsa', function($this) {
			hotplace.calc.profit.calcTomogGongsa();
		});
		
		hotplace.validation.numberOnly('#stepPojangGongsa', function($this) {
			hotplace.calc.profit.calcPojangGongsa();
		});
		
		hotplace.validation.numberOnly('#stepInibGongsa', function($this) {
			hotplace.calc.profit.calcInibGongsa();
		});
		
		//spinner
		$('#tbProfit .spinner .btn:first-of-type').on('click', function() {
			var parentDv = $(this).parent();
			_workSpinner(parentDv.parent().children('input:first-child'), 'up', parentDv.data('fn'));
		});
		
		$('#tbProfit .spinner .btn:last-of-type').on('click', function() {
			var parentDv = $(this).parent();
			_workSpinner($(this).parent().parent().children('input:first-child'), 'down', parentDv.data('fn'));
		});
		
		/*var sliderTooltip = function(target, html, defaultV) {
		
			return function(event, ui) {
				console.log(event);
				console.log(ui);
				var v = (ui.value == undefined) ? defaultV : ui.value;
			    var tooltip = '<div style="display:none" class="tooltip"><div class="tooltip-inner">' + html + '(선택값: <span id="sp_' + target + '">' + v + '</span>) </div></div>';
			    $('#' + target + ' .ui-slider-handle').html(tooltip); //attach tooltip to the slider handle
			}
		}
		
		var event = function(target) { 
			return {
				mouseout: function() {
					$('#' + target +' .tooltip').hide();
				},
				mouseover: function() {
					$('#' + target +' .tooltip').show();
				},
				//label을 클릭했을때 발생 
				click: function(event) {
					var data = $(event.target).data('value');
					console.log(data);
					$('#sp_' + target).text(data);
				}
			};
		}
		
		var profitToolHtml = {
			stepPurchase:        '<div style="width:150px">최근 1년간 반경 1km이내 유사조건 물건의 실거래가 평균</div>',
			stepOwnTerm:         '<div><pre>한글</pre></div>',
			stepOtherAssetRatio: '<div style="width:150px">담보 가능여부와  매입주체의 신용도에 따라 대출규모 상이</div>',
			stepFinancialCost:   '<div style="width:150px">매입주체의 신용도에 따라 설정</div>',
			stepAcquisitionTax:  '<div style="width:300px">1.토지(농지외): 4.6%(취득세4%,농특세0.2%,교육세0.4%)<br/>' + 
								 '2.농지(전,답,과수원,목장용지): 3.4%(취득세 3.0% + 농특세 0.2% + 교육세 0.2%)</div>',
			stepPropertyTax:	 '<div style="width:300px">' +
								 '1.산식: 공시지가×요율×보유기간<br/>' +
								 '2.요율<br/>' + 
								 ' 1)주택: 3억원 초과시 57만원 + 3억원 초과금액의 0.4%<br/>' +
								 ' 2)일반 건축물: 0.25%<br/>' +
								 ' 3)특별시, 광역시내 건축물: 0.5%<br/>' +
								 ' 4)토지(농지): 0.07%<br/>' +
								 ' 5)토지(공장용지): 0.2%' +
								 '</div>',
			stepTransferTax:     '<div style="width:300px">' +
		    					 '1. 개인(양도세)<br/>' +
		    					 '  1)1년 미만: 50%(비사업용은 60%)<br/>' +
		    					 '  2)2년 미만: 40%(비사업용은 50%)<br/>' +
		    					 '  3)2년 이상: 기본세율<br/>' +
		    					 '  4)기본 세율<br/>' +
		    					 '    - 1200만원이하: 6%<br/>' +
		    					 '    - 1200만원초과 ~ 4600만원이하: 15%<br/>' +
		    					 '    - 4600만원초과 ~ 8800만원이하: 24%<br/>' +
		    					 '    - 8800만원초과 ~ 1억5천만원이하: 35%<br/>' +
		    					 '    - 1억5천만원초과 ~ 5억원이하: 38%<br/>' +
		    					 '    - 5억원초과: 40%<br/>' +
		    					 '2. 비사업토지는 토지 등 양도소득에 대한 법인세 10% 추가<br/>' +
		    					 '</div>',
		    stepCorporateTax:	 '<div style="width:300px">' +
		    					 '1. 법인세<br/>' +
		    					 ' 1)2억원 이하: 10%<br/>' +
		    					 ' 2)2억 초과 ~ 200억 이하: 20%<br/>' +
		    					 ' 3)200억 초과: 22%<br/>' +
		    					 '2. 비사업용 토지는 토지 등 양도소득에 대한 법인세 10% 추가<br/>' +
		    					 '</div>',
		    stepCivilWorksFee:   '<div style="width:150px">' +
		    					 '일반적인 기준: 15만원/3.3㎡<br/>' +
		    					 '</div>',
		    stepBuildingWorksFee:'<div style="width:150px">' +
		    					 '일반적인 기준: 450만원/3.3㎡<br/>' +
		    					 '</div>',
		    stepLicenseCost: 	 '<div style="width:150px">' +
		    					 '인허가 이행 여부에 따라 설정(매입가의 5% 적용)' +
		    					 '</div>',
		    stepDevBudamgeum:    '<div style="width:300px">' +
		    					 '1. 산식: 개발이익×25%<br/>' +
		    					 '2. 개발이익 = (종료시점지가 - 개시시점지가) - 개발비용 - 정상지가 상승분<br/>' +
		    					 '3. 부과대상 <br/>' +
		    					 '</div>',
		    stepFarmConserve:    '<div style="width:300px">' +
		    					 '1. 산식: 공시지가의 30%<br/>' +
		    					 '2. 산식에 따른 산출금액이 50천원/㎡을 초과할 경우, 50천원/㎡ 적용 <br/>' +
		    					 '3. 도로, 철도 등 주요산업 시설이나 농어업용 시설을 설치하는 경우에는 부담금 감면  <br/>' +
		    					 '</div>',
		    stepForestResource:  '<div style="width:300px">' +
		    					 '1. 산식: 산지전용면적×(단위면적당 금액 + 공시지가의 1%)<br/>' +
		    					 '2. 단위면적당 금액<br/>' +
		    					 ' 1)준보전산지: 4,010원/㎡<br/>' +
		    					 ' 2)보전산지: 5,210원/㎡<br/>' +
		    					 ' 3)산지전용 제한지역: 8,020원/㎡<br/>' +
		    					 '</div>',
		    stepBondPurchase:    '<div style="width:150px">4.5% 기준</div>',
		    stepGeunJeoDang:	 '<div style="width:150px">' +
		    					 '1. 산식: 대출금액의 130% × 요율<br/>' +
		    					 '2. 요율: 0.4% 적용'+
		    					 '</div>',
		    stepDeungGi: 		 '<div style="width:150px">공사비의 3.2% 내용</div>',
		    stepManageFee: 		 '<div style="width:150px">운영 수입의  50% 내용</div>',
		    stepSaleFee: 		 '<div style="width:150px">법정 수수료 = 매각금액의 0.9%이하</div>',
		    stepResolveMoney:    '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		    stepLandFee:		 '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		    stepBuildingFee:     '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		    stepEquipmentFee:    '<div style="width:150px">최근 5년간 실거래가 연평균 증감율을 반영, 보유기간 이후 추정되는 거래가격</div>',
		};
		
		//매입가격
		$('#stepPurchase')
		.slider({min: -10, max: 200, values: [100], step: 10, change: function(event,ui) {
			 $('#txtPurchase').val(ui.value);
		}, create:sliderTooltip('stepPurchase', profitToolHtml.stepPurchase, 100), slide: sliderTooltip('stepPurchase', profitToolHtml.stepPurchase)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(21);
			x[0] = '-10%', x[6] = '50%', x[11] = '100%', x[16] = '150%', x[21] = '200%';
			return x
		}()})
		.on(event('stepPurchase'));
		
		//$('#stepPurchase .ui-slider-handle').on(event('stepPurchase'));
		
		//보유기간
		$('#stepOwnTerm')
		.slider({min: 0, max: 10, values: [0,5], step: 1,  range: true, change: function(event,ui){
	        console.log(ui);
	        $('#resultTotalInvestmentPrice').val(ui.value);
	    }, create:sliderTooltip('stepOwnTerm', profitToolHtml.stepOwnTerm), slide: sliderTooltip('stepOwnTerm', profitToolHtml.stepOwnTerm)})
		.slider('pips',{rest: 'label', labels: false, prefix: '', suffix: '년'})
		//.on(event('stepOwnTerm'));
		
		//타인자본비율
		$('#stepOtherAssetRatio')
		.slider({min: 0, max: 100, values: [70], step: 10, change:function() {
			
		}, create:sliderTooltip('stepOtherAssetRatio', profitToolHtml.stepOtherAssetRatio, 70), slide: sliderTooltip('stepOtherAssetRatio', profitToolHtml.stepOtherAssetRatio)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: '%'})
		.on(event('stepOtherAssetRatio'));
		
		
		//대출 금리
		$('#stepFinancialCost')	
		.slider({min: 0, max: 20, values: [5], step: 0.5,  change: function(event,ui){
	        $('#txtFinancialCost').val(ui.value);
	    }, create:sliderTooltip('stepFinancialCost', profitToolHtml.stepFinancialCost, 5), slide: sliderTooltip('stepFinancialCost', profitToolHtml.stepFinancialCost)})
		.slider('pips',{labels: function() {
			var x = new Array(40);
			x[0] = '0%', x[10] = '5.0%', x[20] = '10.0%', x[30] = '15.0%', x[40] = '20.0%';
			return x
		}(), rest: 'label'})
		.on(event('stepFinancialCost'));
		
		//취득세
		$('#stepAcquisitionTax')	
		.slider({min: 0, max: 10, values: [5], step: 0.5, change: function(event,ui){
	        $('#txtAcquisitionTax').val(ui.value);
	    },create:sliderTooltip('stepAcquisitionTax', profitToolHtml.stepAcquisitionTax, 5.0), slide: sliderTooltip('stepAcquisitionTax', profitToolHtml.stepAcquisitionTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '2.5%', x[10] = '5.0%', x[15] = '7.5%', x[20] = '10.0%';
			return x
		}()})
		.on(event('stepAcquisitionTax'));
		
		//재산세
		$('#stepPropertyTax')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtPropertyTax').val(ui.value);
	    }, create:sliderTooltip('stepPropertyTax', profitToolHtml.stepPropertyTax, 100), slide: sliderTooltip('stepPropertyTax', profitToolHtml.stepPropertyTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepPropertyTax'));
		
		//양도세
		$('#stepTransferTax')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtTransferTax').val(ui.value);
	    }, create:sliderTooltip('stepTransferTax', profitToolHtml.stepTransferTax, 100), slide: sliderTooltip('stepTransferTax', profitToolHtml.stepTransferTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepTransferTax'));
		
		//법인세
		$('#stepCorporateTax')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtCorporateTax').val(ui.value);
	    }, create:sliderTooltip('stepCorporateTax', profitToolHtml.stepCorporateTax, 100), slide: sliderTooltip('stepCorporateTax', profitToolHtml.stepCorporateTax)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepCorporateTax'));
		
		//토목 공사비
		$('#stepCivilWorksFee')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtCivilWorksFee').val(ui.value);
	    }, create:sliderTooltip('stepCivilWorksFee', profitToolHtml.stepCivilWorksFee, 100), slide: sliderTooltip('stepCivilWorksFee', profitToolHtml.stepCivilWorksFee)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepCivilWorksFee'));
		
		//건축 공사비
		$('#stepBuildingWorksFee')	
		.slider({min: 0, max: 200, values: [100], step: 10, change: function(event,ui){
	        $('#txtBuildingWorksFee').val(ui.value);
	    }, create:sliderTooltip('stepBuildingWorksFee', profitToolHtml.stepBuildingWorksFee, 100), slide: sliderTooltip('stepBuildingWorksFee', profitToolHtml.stepBuildingWorksFee)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(20);
			x[0] = '0%', x[5] = '50%', x[10] = '100%', x[15] = '150%', x[20] = '200%';
			return x
		}()})
		.on(event('stepBuildingWorksFee'));
		
		//인허가 비용
		$('#stepLicenseCost')	
		.slider({min: 0, max: 19, values: [10], step: 1, change: function(event,ui){
			var val;
			if(ui.value > 10) {
				val = (((ui.value) % 10) + 1) * 1000;
			}
			else {
				val = (ui.value) * 100;
			}
	        $('#txtLicenseCost').val(val);
	    }, create:sliderTooltip('stepLicenseCost', profitToolHtml.stepLicenseCost, 10), slide: sliderTooltip('stepLicenseCost', profitToolHtml.stepLicenseCost)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(9);
			x[0] = '0', x[5] = '5백만', x[10] = '1천만', x[14] = '5천만', x[19] = '1억';
			return x
		}()})
		.on(event('stepLicenseCost'));
		
		//개발부담금
		$('#stepDevBudamgeum')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtDevBudamgeum').val(ui.value);
	    }, create:sliderTooltip('stepDevBudamgeum', profitToolHtml.stepDevBudamgeum), slide: sliderTooltip('stepDevBudamgeum', profitToolHtml.stepDevBudamgeum)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepDevBudamgeum'));
		
		//농지보전 부담금
		$('#stepFarmConserve')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtFarmConserve').val(ui.value);
	    }, create:sliderTooltip('stepFarmConserve', profitToolHtml.stepFarmConserve), slide: sliderTooltip('stepFarmConserve', profitToolHtml.stepFarmConserve)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepFarmConserve'));
		
		//대체산림자원 조성비 
		$('#stepForestResource')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtForestResource').val(ui.value);
	    }, create:sliderTooltip('stepForestResource', profitToolHtml.stepForestResource), slide: sliderTooltip('stepForestResource', profitToolHtml.stepForestResource)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepForestResource'));
		
		//채권 매입비
		$('#stepBondPurchase')	
		.slider({min: 0, max: 9, values: [4.5], step: 0.5, change: function(event,ui){
	        $('#txtBondPurchase').val(ui.value);
	    }, create:sliderTooltip('stepBondPurchase', profitToolHtml.stepBondPurchase, 4.5), slide: sliderTooltip('stepBondPurchase', profitToolHtml.stepBondPurchase)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(19);
			x[0] = '0%', x[4] = '2.0%', x[9] = '4.5%', x[14] = '7.0%', x[18] = '9.0%';
			return x
		}()})
		.on(event('stepBondPurchase'));
		
		//근저당 설정비
		$('#stepGeunJeoDang')	
		.slider({min: 0, max: 0.8, values: [0.4], step: 0.1, change: function(event,ui){
	        $('#txtGeunJeoDang').val(ui.value);
	    }, create:sliderTooltip('stepGeunJeoDang', profitToolHtml.stepGeunJeoDang, 0.4), slide: sliderTooltip('stepGeunJeoDang', profitToolHtml.stepGeunJeoDang)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: ['0', '0.1%','0.2%','0.3%','0.4%','0.5%','0.6%','0.7%','0.8%'], prefix: '', suffix: ''})
		.on(event('stepGeunJeoDang'));
		
		//보존등기비
		$('#stepDeungGi')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtDeungGi').val(ui.value);
	    }, create:sliderTooltip('stepDeungGi', profitToolHtml.stepDeungGi), slide: sliderTooltip('stepDeungGi', profitToolHtml.stepDeungGi)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepDeungGi'));
		
		//운영비
		$('#stepManageFee')	
		.slider({min: 0, max: 100, values: [50], step: 10, change: function(event,ui){
	        $('#txtManageFee').val(ui.value);
	    }, create:sliderTooltip('stepManageFee', profitToolHtml.stepManageFee, 50), slide: sliderTooltip('stepManageFee', profitToolHtml.stepManageFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepManageFee'));
		
		//매각 수수료
		$('#stepSaleFee')	
		.slider({min: 0, max: 1.8, values: [0.9], step: 0.1, change: function(event,ui){
	        $('#txtSaleFee').val(ui.value);
	    }, create:sliderTooltip('stepSaleFee', profitToolHtml.stepSaleFee, 0.9), slide: sliderTooltip('stepSaleFee', profitToolHtml.stepSaleFee)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(19);
			x[0] = '0%', x[3] = '0.3%', x[6] = '0.6%', x[9] = '0.9%', x[12] = '1.2%', x[15] = '1.5%', x[18] = '1.8%';
			return x
		}()})
		.on(event('stepSaleFee'));
		
		//예비비
		$('#stepResolveMoney')	
		.slider({min: 0, max: 20, values: [10], step: 1, change: function(event,ui){
	        $('#txtResolveMoney').val(ui.value);
	    }, create:sliderTooltip('stepResolveMoney', profitToolHtml.stepResolveMoney, 10), slide: sliderTooltip('stepResolveMoney', profitToolHtml.stepResolveMoney)})
		.slider('pips',{rest: 'label', labels: function() {
			var x = new Array(21);
			x[0] = '0%', x[5] = '5%', x[10] = '10%', x[15] = '15%', x[20] = '20%';
			return x
		}()})
		.on(event('stepResolveMoney'));
		
		//수입발생기간
		$('#stepIncomeOccurTerm')	
		.slider({min: 0, max: 10, values: [0, 2], step: 1, range: true, change: function(event,ui){
	        $('#txtIncomeOccurTerm').val(ui.value);
	    }})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: '년'});
		
		//연간수입 금액
		$('#stepIncomeYear')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtIncomeOccurTerm').val(ui.value);
	    }})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''});
		
		//토지매도 가격
		$('#stepLandFee')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtLandFee').val(ui.value);
	    }, create:sliderTooltip('stepLandFee', profitToolHtml.stepLandFee), slide: sliderTooltip('stepLandFee', profitToolHtml.stepLandFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepLandFee'));
		
		//건물매도 가격
		$('#stepBuildingFee')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtLandFee').val(ui.value);
	    }, create:sliderTooltip('stepBuildingFee', profitToolHtml.stepBuildingFee), slide: sliderTooltip('stepBuildingFee', profitToolHtml.stepBuildingFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepBuildingFee'));
		
		//설비매도 가격
		$('#stepEquipmentFee')	
		.slider({min: 0, max: 100, values: [40], step: 10, change: function(event,ui){
	        $('#txtEquipmentFee').val(ui.value);
	    }, create:sliderTooltip('stepEquipmentFee', profitToolHtml.stepEquipmentFee), slide: sliderTooltip('stepEquipmentFee', profitToolHtml.stepEquipmentFee)})
		.slider('pips',{first: 'label', last: 'label', rest: 'label', labels: false, prefix: '', suffix: ''})
		.on(event('stepEquipmentFee'));*/
	}
}(
	hotplace.sujibunseog = hotplace.sujibunseog || {},
	jQuery
));