/**
 * @namespace hotplace.calc
 */
(function(calc, $) {
	/**
	 * @memberof hotplace.calc
	 * @name profit
	 * @type {object} 
	 * @property {object} defaultValue
	 * @property {string} defaultValue.own - 매입(보유)주체 ('gaein' | 'beobin')
	 * @property {number} defaultValue.ownTerm - 보유기간 (0 - 10년)
	 * @property {number} defaultValue.otherAssetRatio - 타인자본비율(0 - 100%)   
	 * 
	 * @property {function} initCalc 				로딩시 기본적으로 수행하는 연산 초기화
	 * @property {function} calcOwnTerm				보유기간 연산함수  
	 * @property {function} calcPurchase 			매입금액 연산함수
	 * @property {function} calcMyeongdobi 			명도비 연산함수
	 * @property {function} calcAcceptLandUse 		토지사용승낙 연산함수
	 * @property {function} calcDaechulIja 			대출이자 연산함수
	 * @property {function} calcChwideugse 			취득세 연산함수
	 * @property {function} calcJaesanse 			재산세 연산함수
	 * @property {function} calcYangdose 			양도세 연산함수
	 * @property {function} calcGeonchugGongsa		건축공사비 연산함수  
	 * @property {function} calcTomogGongsa			토목공사비 연산함수
	 * @property {function} calcPojangGongsa		포장공사비 연산함수
	 * @property {function} calcInibGongsa  		인입공사비 연산함수
	 * @property {function} calcAcceptGaebal  		개발행위허가 연산함수
	 * @property {function} calcGamri  		    	감리비 연산함수
	 * @property {function} calcCheuglyang	    	측량비 연산함수
	 * @property {function} calcEvalueGamjeung  	감정평가비 연산함수
	 * @property {function} calcSplitPilji      	필지분할비 연산함수
	 * @property {function} calcDevBudam			개발부담금 연산함수
	 * @property {function} calcFarmBudam  			농지보전부담금 연산함수
	 * @property {function} calcAlterSanrim  		대체산림자원조성비 연산함수
	 * @property {function} calcPurchaseChaegwon	채권매입비 연산함수
	 * @property {function} calcSetGeunjeodang      근저당설정비 연산함수
	 * @property {function} calcPreserveDeunggi     보존등기비 연산함수
	 * @property {function} calcManagement          운영비 연산함수
	 * @property {function} calcSellSusulyo         매각수수료 연산함수
	 * @property {function} calcPreparation         예비비 연산함수
	 * @property {function} calcIncomeSellBuilding  수입>매각>건물 연산함수
	 * @property {function} calcIncomeSellSeolbi    수입>매각>설비 연산함수
	 * @property {function} calcIncomeSellLand  	수입>매각>토지 연산함수
	 * @property {function} calcIncomeManageImdae	수입>운영>임대 연산함수
	 */
	calc.profit = function() {
		/**
		 * @private
		 * @property {object} defaultValue 
		 * @property {string} own - 매입(보유)주체 ('gaein' | 'beobin')
		 * @property {number} ownTerm - 보유기간 (0 - 10년)
		 * @property {number} otherAssetRatio - 타인자본비율(0 - 100%)    
		 */
		var defaultValue = {
			own: 'gaein',
			ownTerm:2,
			otherAssetRatio:70,
			myeongdobi:0,
			acceptLandUse:0,
			daechulIja:5.0,
			chwideugse:4.6,
			jaesanse:0.07,
		}
		
		/**
		 * @private
		 * @function onChangeOwn
		 * @desc 매입(보유)주체 event
		 */
		function onBindOwn() {
			$(document).on('click', 'input[type="radio"][name="radioOwn"]', function(e) {
				own = $(this).val();
			});
		}
		
		var data = null;
		var moneyUnit = 1;
		/**
		 * @private 
		 * @function initCalc
		 * @desc 로딩시 기본적으로 수행하는 연산 초기화
		 */
		function initCalc(params) {
			/*data = params;
			var $txtPurchase = $('#txtPurchase');
			var area = $txtPurchase.data('value');
			//var pyeung = Math.round(area * 0.3025);
			var val = (pyeung * data.valPerPyeung)/moneyUnit;
			$txtPurchase.val(pyeung + '㎡');
			$txtPurchase.data('value', pyeung);*/
			
			calc.profit.calcPurchase();
			calc.profit.calcYangdose(true);
			calc.profit.calcGeonchugGongsa(true);
			calc.profit.calcTomogGongsa(true);
			calc.profit.calcPojangGongsa(true);
			calc.profit.calcInibGongsa(true);
			calc.profit.calcAcceptGaebal();				//인허가비 > 개발행위허가 등
			calc.profit.calcCheuglyang();				//인허가비 > 측량비
			calc.profit.calcEvalueGamjeung();			//인허가비 > 감정평가
			calc.profit.calcSplitPilji();				//인허가비 > 필지분할
			calc.profit.calcDevBudam();					//부담금 > 개별부담금
			calc.profit.calcFarmBudam();				//부담금 > 농지보전부담금
			calc.profit.calcAlterSanrim();				//부담금 > 대체산림자원조성비
			calc.profit.calcManagement();				//사업경비 > 운영비
			calc.profit.calcIncomeSellSeolbi();			//매각 > 설비
			calc.profit.calcIncomeSellLand();			//매각 > 토지
			calc.profit.calcIncomeManageImdae();		//운영 > 임대
		}
		
		/**
		 * @private 
		 * @function makeStep
		 * @returns {number} 입력값의 백분율 값
		 * @desc 입력값의 백분율 값으로 spinner의 step값을 설정
		 */
		function makeStep(value, percent) {
			value = value.toString();
			var len = value.length;
			var s = value.slice(0,1);
			
			for(var i=0; i<len-1; i++) {
				s += '0';
			}
			
			return Math.round(parseInt(s) * 0.01 * percent);
		}
		
		
		function calcRatio(selectorRatio, Warray, sum) {
			var WarrayLen = Warray.length;
			var v = 0;
			
			for(var i=0; i<WarrayLen; i++) {
				v += parseInt($(Warray[i]).data('value'));
			}
			
			$(selectorRatio).text(Math.floor((v/sum) * 100 * 100)/100);
		}
		/**
		 * @private 
		 * @function calcJichoolRatio
		 * @desc 비율
		 */
		function calcJichoolRatio(sum) {
			
			calcRatio('#ratioPurchase', ['#WPurchase'], sum);					//매입금액 
			calcRatio('#ratioMyeongdobi', ['#WMyeongdobi'], sum);				//명도비 
			calcRatio('#ratioAcceptLandUse', ['#WAcceptLandUse'], sum);			//토지사용승낙 
			calcRatio('#ratioTojibi', ['#WTojibi'], sum);						//[토지비 비율]
			calcRatio('#ratioDaechulIja', ['#WDaechulIja'], sum);				//대출이자
			calcRatio('#ratioChwideugse', ['#WChwideugse'], sum);				//취득세
			calcRatio('#ratioJaesanse', ['#WJaesanse', '#WJaesanse2'], sum);	//재산세
			calcRatio('#ratioYangdose', ['#WYangdose'], sum);					//양도세
			calcRatio('#ratioJesegeum', ['#WJesegeum'], sum);					//[제세금 비율]
			calcRatio('#ratioGeonchugGongsa', ['#WGeonchugGongsa'], sum);		//건축공사비
			calcRatio('#ratioTomogGongsa', ['#WTomogGongsa'], sum);				//토목공사비
			calcRatio('#ratioPojangGongsa', ['#WPojangGongsa'], sum);			//포장공사비
			calcRatio('#ratioInibGongsa', ['#WInibGongsa'], sum);				//인입공사비
			calcRatio('#ratioGongsabi', ['#WGongsabi'], sum);					//[공사비 비율]
			calcRatio('#ratioAcceptGaebal', ['#WAcceptGaebal'], sum);			//개발행위허가 등
			calcRatio('#ratioGamri', ['#WGamri'], sum);							//감리비
			calcRatio('#ratioCheuglyang', ['#WCheuglyang'], sum);				//측량비
			calcRatio('#ratioEvalueGamjeung', ['#WEvalueGamjeung'], sum);		//감정평가
			calcRatio('#ratioSplitPilji', ['#WSplitPilji'], sum);				//필지분할
			calcRatio('#ratioInheogabi', ['#WInheogabi'], sum);					//[인허가비 비율]
			calcRatio('#ratioDevBudam', ['#WDevBudam'], sum);					//개발부담금
			calcRatio('#ratioFarmBudam', ['#WFarmBudam'], sum);					//농지보전부담금
			calcRatio('#ratioAlterSanrim', ['#WAlterSanrim'], sum);				//대체산림자원조성비
			calcRatio('#ratioBudamgeum', ['#WBudamgeum'], sum);					//부담금
			calcRatio('#ratioPurchaseChaegwon', ['#WPurchaseChaegwon'], sum);	//채권매입비
			calcRatio('#ratioSetGeunjeodang', ['#WSetGeunjeodang'], sum);		//근저당설정비
			calcRatio('#ratioPreserveDeunggi', ['#WPreserveDeunggi'], sum);		//보존등기비
			calcRatio('#ratioManagement', ['#WManagement'], sum);				//운영비
			calcRatio('#ratioSellSusulyo', ['#WSellSusulyo'], sum);				//매각수수료
			calcRatio('#ratioPreparation', ['#WPreparation'], sum);				//예비비
			calcRatio('#ratioSaeobgyeongbi', ['#WSaeobgyeongbi'], sum);			//[사업경비 비율]
			
			
		}
		
		function calcIncomeRatio(sum) {
			calcRatio('#ratioIncomeSellBuilding', ['#WIncomeSellBuilding'], sum);		//건물
			calcRatio('#ratioIncomeSellSeolbi', ['#WIncomeSellBuilding'], sum);			//설비
			calcRatio('#ratioIncomeSellLand', ['#WIncomeSellLand'], sum);				//토지
			calcRatio('#ratioIncomeSell', ['#WIncomeSell'], sum);						//[매각 비율]
			calcRatio('#ratioIncomeManageImdae', ['#WIncomeManageImdae'], sum);			//임대
			calcRatio('#ratioIncomeManage', ['#WIncomeManage'], sum);					//[운영 비율]
			calcRatio('#ratioIncomeManage', ['#WIncomeManage'], sum);
		}
		
		/**
		 * @private 
		 * @function calcTojibi
		 * @desc 토지비 (매입금액, 명도비, 토지사용승낙)
		 */
		function calcTojibi(changedEl) {
			console.log('토지비 (매입금액, 명도비, 토지사용승낙)');
			
			var $$1 = $('#WPurchase').data('value');
			var $$2 = $('#WMyeongdobi').data('value');
			var $$3 = $('#WAcceptLandUse').data('value');
			var $$r = parseFloat($$1) + parseFloat($$2) + parseFloat($$3);
			
			var $WTojibi = $('#WTojibi');
			$WTojibi.data('value', $$r)
			$WTojibi.val($$r.toString().money());
			calcJichool();
		}
		

		
		/**
		 * @private 
		 * @function calcJesegeum
		 * @desc 제세금 (취득세,재산세,양도세)
		 */
		function calcJesegeum() {
			console.log('제세금 (취득세,재산세,양도세)');
			
			var $$1 = $('#WChwideugse').data('value');
			var $$2 = $('#WJaesanse').data('value');
			var $$2_1 = $('#WJaesanse2').data('value');
			var $$3 = $('#WYangdose').data('value');
			var $$r = parseFloat($$1) + parseFloat($$2) + parseFloat($$2_1) + parseFloat($$3);
			
			var $WJesegeum = $('#WJesegeum');
			$WJesegeum.data('value', $$r)
			$WJesegeum.val($$r.toString().money());
			
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcGongsabi
		 * @desc 공사비 (건축공사비, 토목공사비, 포장공사비, 인입공사비)
		 */
		function calcGongsabi() {
			console.log('공사비 (건축공사비, 토목공사비, 포장공사비, 인입공사비)');
			
			var $$1 = $('#WGeonchugGongsa').data('value');
			var $$2 = $('#WTomogGongsa').data('value');
			var $$3 = $('#WPojangGongsa').data('value');
			var $$4 = $('#WInibGongsa').data('value');
			
			var $$r = $$1 + $$2 + $$3 + $$4;
			
			var $WGongsabi = $('#WGongsabi');
			$WGongsabi.data('value', $$r);
			$WGongsabi.val($$r.toString().money());
			
			//감리비 : 공사비 X 비율
			hotplace.calc.profit.calcGamri(true);
			//보존등기비 : 공사비 X 비율
			hotplace.calc.profit.calcPreserveDeunggi(true);
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcInheogabi
		 * @desc 인허가비 (개발행위, 감리비, 측량비, 감정평가, 필지분할)
		 */
		function calcInheogabi() {
			console.log('인허가비 (개발행위, 감리비, 측량비, 감정평가, 필지분할)');
			
			var $WAcceptGaebal = $('#WAcceptGaebal');
			var $WGamri = $('#WGamri');
			var $WCheuglyang = $('#WCheuglyang');
			var $WEvalueGamjeung = $('#WEvalueGamjeung');
			var $WSplitPilji = $('#WSplitPilji');
			
			var $WInheogabi = $('#WInheogabi');
			
			var $$1 = parseInt($WAcceptGaebal.data('value'));
			var $$2 = parseInt($WGamri.data('value'));
			var $$3 = parseInt($WCheuglyang.data('value'));
			var $$4 = parseInt($WEvalueGamjeung.data('value'));
			var $$5 = parseInt($WSplitPilji.data('value'));
			var $$r = $$1 + $$2 + $$3 + $$4 + $$5;
			
			$WInheogabi.data('value', $$r);
			$WInheogabi.val($$r.toString().money());
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcBudamgeum
		 * @desc 부담금 (개발부담금, 농지보전부담금, 대체산림자원조성비)
		 */
		function calcBudamgeum() {
			console.log('부담금 (개발부담금, 농지보전부담금, 대체산림자원조성비)');
			
			var $WBudamgeum = $('#WBudamgeum');
			
			var $WDevBudam = $('#WDevBudam');
			var $WFarmBudam = $('#WFarmBudam');
			
			var $$1 = $WDevBudam.data('value');
			var $$2 = $WFarmBudam.data('value');
			
			var $$r = $$1 + $$2;
			
			$WBudamgeum.data('value', $$r);
			$WBudamgeum.val($$r.toString().money());
			
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcSaeobgyeongbi
		 * @desc 사업경비(채권매입비, 근저당설정비, 보존등기비, 운영비, 매각수수료, 예비비)
		 */
		function calcSaeobgyeongbi() {
			console.log('사업경비(채권매입비, 근저당설정비, 보존등기비, 운영비, 매각수수료, 예비비)');
			
			var $WPurchaseChaegwon =$('#WPurchaseChaegwon');
			var $WSetGeunjeodang = $('#WSetGeunjeodang');
			var $WPreserveDeunggi = $('#WPreserveDeunggi');
			var $WManagement = $('#WManagement');
			var $WSellSusulyo = $('#WSellSusulyo');
			var $WPreparation = $('#WPreparation');
			
			var $$1 = parseInt($WPurchaseChaegwon.data('value'));
			var $$2 = parseInt($WSetGeunjeodang.data('value'));
			var $$3 = parseInt($WPreserveDeunggi.data('value'));
			var $$4 = parseInt($WManagement.data('value'));
			var $$5 = parseInt($WSellSusulyo.data('value'));
			var $$6 = parseInt($WPreparation.data('value'));
			var $$r = $$1 + $$2 + $$3 + $$4 + $$5 + $$6;
			
			var $WSaeobgyeongbi = $('#WSaeobgyeongbi');
			$WSaeobgyeongbi.data('value', $$r);
			$WSaeobgyeongbi.val($$r.toString().money());
			calcJichool();
		}
		
		/**
		 * @private 
		 * @function calcJichool
		 * @desc 지출합계(토지비, 제세금, 공사비, 인허가비, 부담금, 사업경비)
		 */
		function calcJichool() {
			console.log('지출합계(토지비, 금융비용, 제세금, 공사비, 인허가비, 부담금, 사업경비)');
			
			//토지비
			var WTojibi = $('#WTojibi').data('value');
			//대출이자
			var WDaechulIja = $('#WDaechulIja').data('value');
			//제세금
			var WJesegeum = $('#WJesegeum').data('value');
			//공사비
			var WGongsabi = $('#WGongsabi').data('value');
			//인허가비
			var WInheogabi = $('#WInheogabi').data('value');
			//부담금
			var WBudamgeum = $('#WBudamgeum').data('value');
			//사업경비
			var WSaeobgyeongbi = $('#WSaeobgyeongbi').data('value');
			
			var $WJichool = $('#WJichool');
			var $$r = parseFloat(WTojibi) + parseFloat(WDaechulIja) + parseFloat(WJesegeum) + 
					  parseFloat(WGongsabi) + parseFloat(WInheogabi) + parseFloat(WBudamgeum) + parseFloat(WSaeobgyeongbi);
			
			$WJichool.data('value', $$r);
			$WJichool.val($$r.toString().money());
			
			calcJichoolRatio($$r);
			calcMaechool();
		}
		
		/**
		 * @private 
		 * @function calcIncomeSell
		 * @desc 수입>매각(건물,설비,토지)
		 */
		function calcIncomeSell() {
			console.log('수입>매각(건물,설비,토지)');
			
			var $WIncomeSellBuilding = $('#WIncomeSellBuilding');
			var $WIncomeSellSeolbi = $('#WIncomeSellSeolbi');
			var $WIncomeSellLand = $('#WIncomeSellLand')
			
			var $$r = parseInt($WIncomeSellBuilding.data('value')) + parseInt($WIncomeSellSeolbi.data('value')) + parseInt($WIncomeSellLand.data('value'))
			var $WIncomeSell = $('#WIncomeSell');
			$WIncomeSell.data('value', $$r);
			$WIncomeSell.val($$r.toString().money());
			
			//사업경비 > 매각수수료
			calc.profit.calcSellSusulyo(true);
			calcIncome();
		}
		
		/**
		 * @private 
		 * @function calcIncomeManage
		 * @desc 수입>운영(임대)
		 */
		function calcIncomeManage() {
			console.log('수입>운영(임대)');
			var $WIncomeManageImdae = $('#WIncomeManageImdae');
			
			var $$r = parseInt($WIncomeManageImdae.data('value'));
			
			var $WIncomeManage = $('#WIncomeManage');
			$WIncomeManage.data('value', $$r);
			$WIncomeManage.val($$r.toString().money());
			calcIncome();
		}
		
		/**
		 * @private 
		 * @function calcIncome
		 * @desc 수입합계
		 */
		function calcIncome() {
			console.log('수입합계');
			//매각 + 운영
			var $WIncomeSell = $('#WIncomeSell');
			var $WIncomeManage = $('#WIncomeManage');
			var $$1 = parseInt($WIncomeSell.data('value'));
			var $$2 = parseInt($WIncomeManage.data('value'));
			var $$r = $$1 + $$2;
			
			var $WIncome = $('#WIncome');
			$WIncome.data('value', $$r);
			$WIncome.val($$r.toString().money());
			
			//사업경비 > 예비비
			calc.profit.calcPreparation(true);
			
			calcIncomeRatio($$r);
			calcMaechool();
		}
		
		/**
		 * @private 
		 * @function calcMymoney
		 * @desc 자기자본 총액 (매입금액 + 명도비 + 토지사용승낙 + 취득세 + 공사비 + 개발행위허가 + 부담금 + 
		 *          		채권매입비 + 근저당설정비 + 보존등기비)
		 */
		function calcMymoney() {
			console.log('자기자본 총액');
			//매입금액의 30%
			var purchase30 = parseFloat($('#WPurchase').data('value') || 0) * 0.3;
			//명도비
			var myeongdobi = parseFloat($('#WMyeongdobi').data('value') || 0);
			//토지사용승낙
			var acceptLandUse = parseFloat($('#WAcceptLandUse').data('value') || 0);
			//취득세
			var chwideugse = parseFloat($('#WChwideugse').data('value') || 0);
			//건축공사비
			var geonchugGongsa = parseFloat($('#WGeonchugGongsa').data('value') || 0);
			//토목공사비
			var tomogGongsa = parseFloat($('#WTomogGongsa').data('value') || 0);
			//포장공사비
			var pojangGongsa = parseFloat($('#WPojangGongsa').data('value') || 0);
			//인입공사비
			var inibGongsa = parseFloat($('#WInibGongsa').data('value') || 0);
			//개발행위허가
			var acceptGaebal = parseFloat($('#WAcceptGaebal').data('value') || 0);
			//개발부담금
			var devBudam = parseFloat($('#WDevBudam').data('value') || 0);
			//농지보전부담금
			var farmBudam = parseFloat($('#WFarmBudam').data('value') || 0);
			//대체산림자원조성비
			var alterSanrim = parseFloat($('#WAlterSanrim').data('value') || 0);
			//채권매입비
			var purchaseChaegwon = parseFloat($('#WPurchaseChaegwon').data('value') || 0);
			//근저당설정비
			var setGeunjeodang = parseFloat($('#WSetGeunjeodang').data('value') || 0);
			//보존등기비
			var preserveDeunggi = parseFloat($('#WPreserveDeunggi').data('value') || 0);
			
			var sum = 0;
				sum += purchase30  + myeongdobi   + acceptLandUse;
			    sum += chwideugse;
			    sum += geonchugGongsa + tomogGongsa + pojangGongsa + inibGongsa;
			    sum += acceptGaebal;
			    sum += devBudam + farmBudam + alterSanrim;
			    sum += purchaseChaegwon + setGeunjeodang + preserveDeunggi;
			sum = Math.round(sum) + '';
			    
			$('#WMymoney').val(sum.money());
		}
		
		/**
		 * @private 
		 * @function calcMaechool
		 * @desc 매출이익 (수입-지출)
		 */
		function calcMaechool() {
			console.log('매출이익 (수입-지출)');
			
			var $WJichool = $('#WJichool');
			var $WIncome = $('#WIncome');
			
			var $$1 = parseInt($WIncome.data('value'));
			var $$2 = parseInt($WJichool.data('value'));
			var $$r = $$1 - $$2;
			
			var $WMaechool = $('#WMaechool');
			$WMaechool.data('value', $$r);
			$WMaechool.val($$r.toString().money());
		}
		
		/**
		 * @private 
		 * @function calcDevIig
		 * @desc 개발부담금(개발이익) 
		 */
		function calcDevIig() {
			return 10000000;
		}
		
		return {
			init: function() {
				onBindOwn();
			},
			initCalc: initCalc,
			makeStep: makeStep,
			defaultValue: defaultValue,
			calcOwnTerm: function() {
				hotplace.calc.profit.calcJaesanse(true);
				hotplace.calc.profit.calcJaesanse2(true);
				hotplace.calc.profit.calcYangdose();
			},
			calcOtherAssetRatio: function() {
				console.log('타인자본비율');
				hotplace.calc.profit.calcDaechulIja(true);
			},
			calcPurchase: function(initFn) {
				console.log('매입금액');
				//if(initFn) initFn();
				
				var $$1 = $('#txtPurchase').data('value');
				var $$2 = $('#stepPurchase').data('value');
				var $$r = parseFloat($$1) * parseFloat($$2);
				
				var $WPurchase = $('#WPurchase');
				$WPurchase.data('value', $$r);
				$WPurchase.val($$r.toString().money());
				
				//명도비 : 매입금액 * 비율
				hotplace.calc.profit.calcMyeongdobi(true);
				//토지승낙비 : 매입금액 * 비율
				hotplace.calc.profit.calcAcceptLandUse(true);
				//대출이자 : 매입가 * 타인자본비율
				hotplace.calc.profit.calcDaechulIja(true);
				//취득세 : 매입가 * 비율
				hotplace.calc.profit.calcChwideugse(true);
				//재산세
				hotplace.calc.profit.calcJaesanse(true);
				//채권매입비
				hotplace.calc.profit.calcPurchaseChaegwon(true);
				
				calcMymoney();//자기자본
				calcTojibi();
			},
			calcMyeongdobi: function(isSet) {
				console.log('명도비');
				
				var $txtMyeongdobi = $('#txtMyeongdobi');
				
				if(isSet) {
					var WPurchase = $('#WPurchase').data('value');
					$txtMyeongdobi.data('value', WPurchase);
					$txtMyeongdobi.val(WPurchase.toString().money());
				}
				
				var $stepMyeongdobi = $('#stepMyeongdobi');
				
				var $$1 = $txtMyeongdobi.data('value');
				var $$2 = $stepMyeongdobi.data('value');
				var $$r = parseFloat($$1) * (0.01 * parseFloat($$2));
				
				var $WMyeongdobi = $('#WMyeongdobi');
				$WMyeongdobi.data('value', $$r);
				$WMyeongdobi.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcTojibi();
			},
			calcAcceptLandUse: function(isSet) {
				console.log('토지사용승낙');
				
				var $txtAcceptLandUse = $('#txtAcceptLandUse');
				
				if(isSet) {
					var WPurchase = $('#WPurchase').data('value');
					$txtAcceptLandUse.data('value', WPurchase);
					$txtAcceptLandUse.val(WPurchase.toString().money());
				}
				
				var $stepAcceptLandUse = $('#stepAcceptLandUse');
				
				var $$1 = $txtAcceptLandUse.data('value');
				var $$2 = $stepAcceptLandUse.data('value');
				var $$r = parseFloat($$1) * (0.01 * parseFloat($$2));
				
				var $WAcceptLandUse = $('#WAcceptLandUse');
				$WAcceptLandUse.data('value', $$r);
				$WAcceptLandUse.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcTojibi();
			},
			calcDaechulIja: function(isSet) {
				console.log('대출이자(매입가 X 타인자본 비율)');
				
				var $txtDaechulIja = $('#txtDaechulIja');
				
				if(isSet) {
					//매입가
					var _$$1 = $('#WPurchase').data('value');
					var _$$2 = $('#stepOtherAssetRatio').data('value');
					var _$$r = Math.round(parseFloat(_$$1) * (0.01 * parseFloat(_$$2)));
					
					$txtDaechulIja.data('value', _$$r);
					$txtDaechulIja.val(_$$r.toString().money());
					
					//근저당비 : 대출금 X 130%
					hotplace.calc.profit.calcSetGeunjeodang(true);
				}
				
				var $stepDaechulIja = $('#stepDaechulIja');
				
				var $$1 = $txtDaechulIja.data('value');
				var $$2 = $stepDaechulIja.data('value');
				var $$r = Math.round(parseFloat($$1) * (0.01 * parseFloat($$2)));
				
				var $WDaechulIja = $('#WDaechulIja');
				$WDaechulIja.data('value', $$r);
				$WDaechulIja.val($$r.toString().money());
				calcJichool();
			},
			calcChwideugse: function(isSet) {
				console.log('취득세(매입가 X 비율)');
				
				var $txtChwideugse = $('#txtChwideugse');
				
				if(isSet) {
					var WPurchase = $('#WPurchase').data('value');
					$txtChwideugse.data('value', WPurchase);
					$txtChwideugse.val(WPurchase.toString().money());
				}
				
				var $stepChwideugse = $('#stepChwideugse');
				
				var $$1 = $txtChwideugse.data('value');
				var $$2 = $stepChwideugse.data('value');
				var $$r = parseFloat($$1) * (0.01 * parseFloat($$2));
				
				var $WChwideugse = $('#WChwideugse');
				$WChwideugse.data('value', $$r);
				$WChwideugse.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcJesegeum();
			},
			calcJaesanse: function(isSet) {
				console.log('재산세');
				
				//주택외
				var $txtJaesanseT1 = $('#txtJaesanseT1');
				var $txtJaesanseT2 = $('#txtJaesanseT2');
				var $stepJaesanseT3 = $('#stepJaesanseT3');
				
				if(isSet) {
					//매입가
					var _$$1 = $('#WPurchase').data('value');
					var _$$2 = $('#stepOwnTerm').data('value');
					
					$txtJaesanseT1.data('value', _$$1);
					$txtJaesanseT1.val(_$$1.toString().money());
					
					$txtJaesanseT2.data('value', _$$2);
					$txtJaesanseT2.val($('#stepOwnTerm').val());
				}
				
				var $$1 = $txtJaesanseT1.data('value');
				var $$2 = $txtJaesanseT2.data('value');
				var $$3 = $stepJaesanseT3.data('value');
				var $$r = Math.round(parseFloat($$1) * parseFloat($$2) * (0.01 * parseFloat($$3)));
				
				var $WJaesanse = $('#WJaesanse');
				$WJaesanse.data('value', $$r);
				$WJaesanse.val($$r.toString().money());
				
				calcJesegeum();
			},
			calcJaesanse2: function(isSet, isInit) {
				
				var $txtJaesanseH1 = $('#txtJaesanseH1');
				var $txtJaesanseH2 = $('#txtJaesanseH2');
				var $txtJaesanseH3 = $('#txtJaesanseH3');
				var $stepOwnTerm = $('#stepOwnTerm');
				
				if(isSet) {
					$txtJaesanseH2.data('value', $stepOwnTerm.data('value'));
					$txtJaesanseH2.val($stepOwnTerm.val());
				}
				
				if(isInit) {
					$txtJaesanseH1.val('0');
					$txtJaesanseH1.data('value', '0');
					$txtJaesanseH2.val($stepOwnTerm.val());
					$txtJaesanseH2.data('value', $stepOwnTerm.data('value'));
					$txtJaesanseH3.val('0');
					$txtJaesanseH3.data('value', '0');
				}
				
				var $$1 = parseFloat($txtJaesanseH1.data('value'));
				var $$2 = parseFloat($txtJaesanseH2.data('value'));
				var $$3 = 0;
				var $$r = 0;
				
				//6천만원 이하 0.1%
				if($$1 <= 60000000) {
					$$3 = Math.round($$1 * 0.001);
				}
				else if($$1 > 60000000 && $$1 <= 150000000) {
					$$3 = Math.round(60000 + ($$1 - 60000000) * 0.0015);
				}
				else if($$1 > 150000000 && $$1 <= 300000000) {
					$$3 = Math.round(195000 + ($$1 - 150000000) * 0.0025);
				}
				else {
					$$3 = Math.round(570000 + ($$1 - 300000000) * 0.004);
				}
				
				$$r = Math.round($$2 * $$3);
				
				$txtJaesanseH3.data('value', $$3);
				$txtJaesanseH3.val($$3.toString().money());
				
				var $WJaesanse2 = $('#WJaesanse2');
				$WJaesanse2.data('value', $$r);
				$WJaesanse2.val($$r.toString().money());
				calcJesegeum();
			},
			calcYangdose: function(isSet) {
				console.log('양도세');
				var $stepYangdose = $('#stepYangdose');
				var $stepYangdose2 = $('#stepYangdose2');
				var $WYangdose = $('#WYangdose');
				
				if(isSet) {
					var $WPurchase = $('#WPurchase');
					var _$$1 = $WPurchase.data('value');
					
					$stepYangdose.data('value', _$$1);
					$stepYangdose.val($WPurchase.val() + $stepYangdose.data('suffix'));
					
					$stepYangdose.data('step', makeStep(_$$1, hotplace.config.yangdoseStepPercent));
				}
				
				var $$1 = parseInt($stepYangdose.data('value')); 
				var $$2 = 0;
				var isNonSaeob = $('#chkYangdose').is(':checked');
				
				//개인
				if($('#radioPrivate').is(':checked')) {
					//보유기간
					var term = parseFloat($('#stepOwnTerm').data('value'));
					if(term < 1) {
						$$2 = isNonSaeob ? 60 : 50;
					}
					else if(term >=1 && term < 2) {
						$$2 = isNonSaeob ? 50 : 40;
					}
					else {
						if($$1 <= 12000000) {
							$$2 = isNonSaeob ? 16 : 6;
						}
						else if($$1 > 12000000 && $$1 <= 46000000) {
							$$2 = isNonSaeob ? 25 : 15;
						}
						else if($$1 > 46000000 && $$1 <= 88000000) {
							$$2 = isNonSaeob ? 34 : 24;
						}
						else if($$1 > 88000000 && $$1 <= 150000000) {
							$$2 = isNonSaeob ? 45 : 35;
						}
						else if($$1 > 150000000 && $$1 <= 500000000) {
							$$2 = isNonSaeob ? 48 : 38;
						}
						else {
							$$2 = isNonSaeob ? 50 : 40;
						}
					}
				}
				else {//법인
					if($$1 <= 200000000) {
						$$2 = isNonSaeob ? 20 : 10;
					}
					else if($$1 > 200000000 && $$1 <= 20000000000) {
						$$2 = isNonSaeob ? 30 : 20;
					}
					else {
						$$2 = isNonSaeob ? 32 : 22;
					}
				}
				
				$stepYangdose2.data('value', $$2);
				$stepYangdose2.val($$2 + $stepYangdose2.data('suffix'));
				
				var $$r = Math.round($$1 * 0.01 * $$2);
				$WYangdose.data('value', $$r);
				$WYangdose.val($$r.toString().money());
				calcJesegeum();
			},
			calcGeonchugGongsa: function(isSet) {
				console.log('건축공사비');
				var $txtGeonchugGongsa = $('#txtGeonchugGongsa');
				var $stepGeonchugGongsa = $('#stepGeonchugGongsa');
				var $WGeonchugGongsa = $('#WGeonchugGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtGeonchugGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 4500000;
					$txtGeonchugGongsa.data('value', _$$1);
					$txtGeonchugGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtGeonchugGongsa.data('value'));
				var $$2 = parseInt($stepGeonchugGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WGeonchugGongsa.data('value', $$r);
				$WGeonchugGongsa.val($$r.toString().money());
				
				//수입 > 매각 > 건물
				hotplace.calc.profit.calcIncomeSellBuilding(true);
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcTomogGongsa: function(isSet) {
				console.log('토목공사비');
				
				var $txtTomogGongsa = $('#txtTomogGongsa');
				var $stepTomogGongsa = $('#stepTomogGongsa');
				var $WTomogGongsa = $('#WTomogGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtTomogGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 1500000;
					$txtTomogGongsa.data('value', _$$1);
					$txtTomogGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtTomogGongsa.data('value'));
				var $$2 = parseInt($stepTomogGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WTomogGongsa.data('value', $$r);
				$WTomogGongsa.val($$r.toString().money());
				
				//수입 > 매각 > 건물
				hotplace.calc.profit.calcIncomeSellBuilding(true);
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcPojangGongsa: function(isSet) {
				console.log('포장공사비');
				
				var $txtPojangGongsa = $('#txtPojangGongsa');
				var $stepPojangGongsa = $('#stepPojangGongsa');
				var $WPojangGongsa = $('#WPojangGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtPojangGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 1500000;
					$txtPojangGongsa.data('value', _$$1);
					$txtPojangGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtPojangGongsa.data('value'));
				var $$2 = parseInt($stepPojangGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WPojangGongsa.data('value', $$r);
				$WPojangGongsa.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcInibGongsa: function(isSet) {
				console.log('인입공사비');
				
				var $txtInibGongsa = $('#txtInibGongsa');
				var $stepInibGongsa = $('#stepInibGongsa');
				var $WInibGongsa = $('#WInibGongsa');
				
				if(isSet) {
					var _$$1 = Math.round(parseFloat($txtInibGongsa.data('area') / 3.3));
					_$$1 = _$$1 * 1500000;
					$txtInibGongsa.data('value', _$$1);
					$txtInibGongsa.val(_$$1.toString().money());
				}
				
				var $$1 = parseInt($txtInibGongsa.data('value'));
				var $$2 = parseInt($stepInibGongsa.data('value'));
				var $$r = Math.round($$1 * 0.01 * $$2);
				
				$WInibGongsa.data('value', $$r);
				$WInibGongsa.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcGongsabi();
			},
			calcAcceptGaebal: function() {
				console.log('개발행위허가');
				
				var $stepAcceptGaebal = $('#stepAcceptGaebal');
				var $WAcceptGaebal = $('#WAcceptGaebal');
				
				$WAcceptGaebal.data('value', $stepAcceptGaebal.data('value'));
				$WAcceptGaebal.val($stepAcceptGaebal.data('value').toString().money());
				
				//수입 > 매각 > 건물
				hotplace.calc.profit.calcIncomeSellBuilding(true);
				calcMymoney();//자기자본
				calcInheogabi();
			},
			calcGamri: function(isSet) {
				console.log('감리비');
				//공사비 X 비율
				
				var $txtGamri = $('#txtGamri');
				var $stepGamri = $('#stepGamri');
				var $WGamri = $('#WGamri');
				var $WGongsabi;
				
				if(isSet) {
					$WGongsabi = $('#WGongsabi');
					$txtGamri.data('value', $WGongsabi.data('value'));
					$txtGamri.val($WGongsabi.data('value').toString().money());
				}
				
				var $$1 = $txtGamri.data('value');
				var $$2 = $stepGamri.data('value');
				var $$r = Math.round($$1 * (0.01 * $$2));
				
				$WGamri.data('value', $$r);
				$WGamri.val($$r.toString().money());
				
				calcInheogabi();
			},
			calcCheuglyang: function() {
				console.log('측량비');
				
				var $stepCheuglyang = $('#stepCheuglyang');
				var $WCheuglyang = $('#WCheuglyang');
				
				$WCheuglyang.data('value', $stepCheuglyang.data('value'));
				$WCheuglyang.val($stepCheuglyang.data('value').toString().money());
				
				calcInheogabi();
			},
			calcEvalueGamjeung: function() {
				console.log('감정평가');
				
				var $stepEvalueGamjeung = $('#stepEvalueGamjeung');
				var $WEvalueGamjeung = $('#WEvalueGamjeung');
				
				$WEvalueGamjeung.data('value', $stepEvalueGamjeung.data('value'));
				$WEvalueGamjeung.val($stepEvalueGamjeung.data('value').toString().money());
				
				calcInheogabi();
			},
			calcSplitPilji: function() {
				console.log('필지분할');
				
				var $stepSplitPilji = $('#stepSplitPilji');
				var $WSplitPilji = $('#WSplitPilji');
				
				$WSplitPilji.data('value', $stepSplitPilji.data('value'));
				$WSplitPilji.val($stepSplitPilji.data('value').toString().money());
				
				calcInheogabi();
			},
			calcDevBudam: function() {
				console.log('개발부담금');
				//개발이익 X 비율
				
				var devIig = calcDevIig();
				var $txtDevBudam = $('#txtDevBudam');
				var $stepDevBudam = $('#stepDevBudam');
				var $WDevBudam = $('#WDevBudam');
				
				$txtDevBudam.data('value', devIig);
				$txtDevBudam.val(devIig.toString().money())
				
				var $$1 = devIig;
				var $$2 = $stepDevBudam.data('value');
				var $$r = Math.round($$1 * (0.01 * $$2));
				
				$WDevBudam.data('value', $$r);
				$WDevBudam.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcBudamgeum();
			},
			calcFarmBudam: function(isGammyeon) {
				console.log('농지보전부담금');
				
				var $txtFarmBudam = $('#txtFarmBudam');
				var $stepFarmBudam = $('#stepFarmBudam');
				var $WFarmBudam = $('#WFarmBudam');
				
				var $$r = 0;
				
				if(!isGammyeon) {
					var $$1 = parseInt($txtFarmBudam.data('value'));
					var $$2 = parseInt($stepFarmBudam.data('value'));
					$$r = Math.round($$1 * (0.01 * $$2));
					
					if($$r > 50000000) {
						$$1 = 50000000;
						$$r = Math.round($$1 * (0.01 * $$2));
					}
				}
				
				$WFarmBudam.data('value', $$r);
				$WFarmBudam.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcBudamgeum();
			},
			calcAlterSanrim: function() {
				console.log('대체산림자원조성비');
				
				var $txtAlterSanrim = $('#txtAlterSanrim');
				var $stepAlterSanrim = $('#stepAlterSanrim');
				
				var $$1 = parseInt($txtAlterSanrim.data('value'));
				var $$2 = parseInt($stepAlterSanrim.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WAlterSanrim = $('#WAlterSanrim');
				$WAlterSanrim.data('value', $$r);
				$WAlterSanrim.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcBudamgeum();
			},
			calcPurchaseChaegwon: function(isSet) {
				console.log('채권매입비');
				
				var $txtPurchaseChaegwon = $('#txtPurchaseChaegwon');
				var $stepPurchaseChaegwon = $('#stepPurchaseChaegwon');
				var WPurchase;
				
				if(isSet) {
					WPurchase = $('#WPurchase').data('value');
					$txtPurchaseChaegwon.data('value', WPurchase);
					$txtPurchaseChaegwon.val(WPurchase.toString().money());
				}
				
				var $$1 = parseInt($txtPurchaseChaegwon.data('value'));
				var $$2 = parseFloat($stepPurchaseChaegwon.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WPurchaseChaegwon = $('#WPurchaseChaegwon');
				$WPurchaseChaegwon.data('value', $$r);
				$WPurchaseChaegwon.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcSaeobgyeongbi();
			},
			calcSetGeunjeodang: function(isSet) {
				console.log('근저당 설정비');
				var $txtDaechulIja;
				var $txtSetGeunjeodang = $('#txtSetGeunjeodang');
				var $stepSetGeunjeodang = $('#stepSetGeunjeodang');
				var $WSetGeunjeodang = $('#WSetGeunjeodang');
				
				if(isSet) {
					$txtDaechulIja = $('#txtDaechulIja');
					var _$$1 = $txtDaechulIja.data('value');
					var _$$2 = 1.3;
					var _$$r = Math.round(_$$1 * _$$2);
					
					$txtSetGeunjeodang.data('value', _$$r);
					$txtSetGeunjeodang.val(_$$r.toString().money());
				}
				
				var $$1 = parseInt($txtSetGeunjeodang.data('value'));
				var $$2 = parseFloat($stepSetGeunjeodang.data('value'));
				var $$r = Math.round($$1 * 0.001 * $$2);
				
				$WSetGeunjeodang.data('value', $$r);
				$WSetGeunjeodang.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcSaeobgyeongbi();
			},
			calcPreserveDeunggi: function(isSet) {
				console.log('보존등기비');
				//공사비의 3.2% 내외
				
				var WGongsabi;
				var $txtPreserveDeunggi = $('#txtPreserveDeunggi');
				var $stepPreserveDeunggi = $('#stepPreserveDeunggi');
				
				if(isSet) {
					WGongsabi = $('#WGongsabi').data('value');
					$txtPreserveDeunggi.data('value', WGongsabi);
					$txtPreserveDeunggi.val(WGongsabi.toString().money());
				}
				
				var $$1 = parseInt($txtPreserveDeunggi.data('value'));
				var $$2 = parseFloat($stepPreserveDeunggi.data('value'));
				var $$r = Math.round($$1 * $$2* 0.01);
				
				var $WPreserveDeunggi = $('#WPreserveDeunggi');
				$WPreserveDeunggi.data('value', $$r);
				$WPreserveDeunggi.val($$r.toString().money());
				
				calcMymoney();//자기자본
				calcSaeobgyeongbi();
			},
			calcManagement: function() {
				console.log('운영비');
				
				var $txtManagement = $('#txtManagement');
				var $stepManagement = $('#stepManagement');
				
				var $$1 = parseInt($txtManagement.data('value'));
				var $$2 = parseFloat($stepManagement.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WManagement = $('#WManagement');
				$WManagement.data('value', $$r);
				$WManagement.val($$r.toString().money());
				
				calcSaeobgyeongbi();
			},
			calcSellSusulyo: function(isSet) {
				console.log('매각수수료');
				
				//매각 X 비율
				var WIncomeSell;
				var $txtSellSusulyo = $('#txtSellSusulyo');
				var $stepSellSusulyo = $('#stepSellSusulyo');
				
				if(isSet) {
					WIncomeSell= $('#WIncomeSell').data('value');
					$txtSellSusulyo.data('value', WIncomeSell);
					$txtSellSusulyo.val(WIncomeSell.toString().money());
				}
				
				var $$1 = parseInt($txtSellSusulyo.data('value'));
				var $$2 = parseFloat($stepSellSusulyo.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WSellSusulyo = $('#WSellSusulyo');
				$WSellSusulyo.data('value', $$r);
				$WSellSusulyo.val($$r.toString().money());
				
				calcSaeobgyeongbi();
			},
			calcPreparation: function(isSet) {
				console.log('예비비');
				
				var WIncome;
				var $txtPreparation = $('#txtPreparation');
				var $stepPreparation = $('#stepPreparation');
				
				if(isSet) {
					WIncome = $('#WIncome').data('value');
					$txtPreparation.data('value', WIncome);
					$txtPreparation.val(WIncome.toString().money());
				}
				
				var $$1 = parseInt($txtPreparation.data('value'));
				var $$2 = parseInt($stepPreparation.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WPreparation = $('#WPreparation');
				$WPreparation.data('value', $$r);
				$WPreparation.val($$r.toString().money());
				
				calcSaeobgyeongbi();
			},
			calcIncomeSellBuilding: function(isSet) {
				console.log('수입>매각>건물');
				
				//건물 : 건축공사비 + 토목공사비 + 개발행위 허가등
				var $txtIncomeSellBuilding = $('#txtIncomeSellBuilding');
				var $stepIncomeSellBuilding = $('#stepIncomeSellBuilding');
				
				var WGeonchugGongsa, WTomogGongsa, WAcceptGaebal, _$$r;
				
				if(isSet) {
					WGeonchugGongsa = $('#WGeonchugGongsa').data('value');
					WTomogGongsa = $('#WTomogGongsa').data('value');
					WAcceptGaebal = $('#WAcceptGaebal').data('value');
					_$$r = parseInt(WGeonchugGongsa) + parseInt(WTomogGongsa) + parseInt(WAcceptGaebal);
					$txtIncomeSellBuilding.data('value', _$$r);
					$txtIncomeSellBuilding.val(_$$r.toString().money());
				}
				
				var $$1 = parseInt($txtIncomeSellBuilding.data('value'));
				var $$2 = parseInt($stepIncomeSellBuilding.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WIncomeSellBuilding = $('#WIncomeSellBuilding');
				$WIncomeSellBuilding.data('value', $$r);
				$WIncomeSellBuilding.val($$r.toString().money());
				
				calcIncomeSell();
			},
			calcIncomeSellSeolbi: function() {
				console.log('수입>매각>설비');
				
				var $txtIncomeSellSeolbi = $('#txtIncomeSellSeolbi');
				var $stepIncomeSellSeolbi = $('#stepIncomeSellSeolbi');
				
				var $$1 = parseInt($txtIncomeSellSeolbi.data('value'));
				var $$2 = parseInt($stepIncomeSellSeolbi.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WIncomeSellSeolbi = $('#WIncomeSellSeolbi');
				$WIncomeSellSeolbi.data('value', $$r);
				$WIncomeSellSeolbi.val($$r.toString().money());
				
				calcIncomeSell();
			},
			calcIncomeSellLand: function() {
				console.log('수입>매각>토지');
				
				var $txtIncomeSellLand = $('#txtIncomeSellLand');
				var $stepIncomeSellLand = $('#stepIncomeSellLand');
				
				var $$1 = parseInt($txtIncomeSellLand.data('value'));
				var $$2 = parseInt($stepIncomeSellLand.data('value'));
				var $$r = Math.round($$1 * $$2 * 0.01);
				
				var $WIncomeSellLand = $('#WIncomeSellLand');
				$WIncomeSellLand.data('value', $$r);
				$WIncomeSellLand.val($$r.toString().money());
				
				calcIncomeSell();
			},
			calcIncomeManageImdae: function() {
				console.log('수입>운영>임대');
				
				var $stepIncomeManageImdae = $('#stepIncomeManageImdae');
				var $txtIncomeManageImdae = $('#txtIncomeManageImdae');
				var $$1 = parseInt($stepIncomeManageImdae.data('value'));
				var $$2 = parseInt($txtIncomeManageImdae.data('value'));
				var $$r = $$1 * $$2;
				
				var $WIncomeManageImdae = $('#WIncomeManageImdae');
				$WIncomeManageImdae.data('value', $$r);
				$WIncomeManageImdae.val($$r.toString().money());
				
				calcIncomeManage();
			},
			calcGyeongsang: function() {
				
			}
		}
	}();
}(
	hotplace.calc = hotplace.calc || {},
	jQuery
));