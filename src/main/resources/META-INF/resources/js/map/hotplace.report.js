/**
 * @namespace hotplace.report 
 * https://brunch.co.kr/@ourlove/60
 * @desc printThis jquery library
 */
(function(report, $) {
	
	function send(type, cfg) {
		var form = document.createElement('form');
		form.action = hotplace.getContextUrl() + 'download/' + type;
		form.method = 'POST';
		form.target = '_self';
		
		var input = document.createElement('input');
		input.type = 'hidden';
	    input.name = 'json';
	    input.value = JSON.stringify(cfg);
	   
	    form.appendChild(input);
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
	}
	
	report.PDF = {
		profit : function() {
			var cfg = {
				fileName:'profitFormPdf',
				cssName: 'profitPdf',
				docName: '수지분석',
				address: '서울시 강남구 도곡동 963',
				jimok: '전',
				valPerPyeung:'21,000',
				area: '132',
				gongsi: '4,040,000',
				limitChange:'Y',
				ownTerm: $('#stepOwnTerm').val(),
				otherAssetRatio: $('#stepOtherAssetRatio').val(),
				tPurchase: $('#txtPurchase').val(),
				sPurchase: $('#stepPurchase').val(),
				wPurchase: $('#WPurchase').val(),
				rPurchase: $('#ratioPurchase').text(),
				tMyeongdobi: $('#txtMyeongdobi').val(),
				sMyeongdobi: $('#stepMyeongdobi').val(),
				wMyeongdobi: $('#WMyeongdobi').val(),
				rMyeongdobi: $('#ratioMyeongdobi').text(),
				
				tAcceptLandUse: $('#txtAcceptLandUse').val(),
				sAcceptLandUse: $('#stepAcceptLandUse').val(),
				wAcceptLandUse: $('#WAcceptLandUse').val(),
				rAcceptLandUse: $('#ratioAcceptLandUse').text(),
				
				wTojibi: $('#WTojibi').val(),
				rTojibi: $('#ratioTojibi').text(),
				
				tDaechulIja: $('#txtDaechulIja').val(),
				sDaechulIja: $('#stepDaechulIja').val(),
				wDaechulIja: $('#WDaechulIja').val(),
				rDaechulIja: $('#ratioDaechulIja').text(),
				
				tChwideugse: $('#txtChwideugse').val(),
				sChwideugse: $('#stepChwideugse').val(),
				wChwideugse: $('#WChwideugse').val(),
				rChwideugse: $('#ratioChwideugse').text(),
				
				//재산세
				tYangdose: $('#stepYangdose').val(),
				sYangdose: $('#stepYangdose2').val(),
				wYangdose: $('#WYangdose').val(),
				rYangdose: $('#ratioYangdose').text(),
				
				wJesegeum: $('#WJesegeum').val(),
				rJesegeum: $('#ratioJesegeum').text(),
				
				tGeonchugGongsa: $('#txtGeonchugGongsa').val(),
				sGeonchugGongsa: $('#stepGeonchugGongsa').val(),
				wGeonchugGongsa: $('#WGeonchugGongsa').val(),
				rGeonchugGongsa: $('#ratioGeonchugGongsa').text(),
				
				tTomogGongsa: $('#txtTomogGongsa').val(),
				sTomogGongsa: $('#stepTomogGongsa').val(),
				wTomogGongsa: $('#WTomogGongsa').val(),
				rTomogGongsa: $('#ratioTomogGongsa').text(),
				
				tPojangGongsa: $('#txtPojangGongsa').val(),
				sPojangGongsa: $('#stepPojangGongsa').val(),
				wPojangGongsa: $('#WPojangGongsa').val(),
				rPojangGongsa: $('#ratioPojangGongsa').text(),
				
				tInibGongsa: $('#txtInibGongsa').val(),
				sInibGongsa: $('#stepInibGongsa').val(),
				wInibGongsa: $('#WInibGongsa').val(),
				rInibGongsa: $('#ratioInibGongsa').text(),
				
				wGongsabi: $('#WGongsabi').val(),
				rGongsabi: $('#ratioGongsabi').text(),
				
				tAcceptGaebal: $('#txtAcceptGaebal').val(),
				sAcceptGaebal: $('#stepAcceptGaebal').val(),
				wAcceptGaebal: $('#WAcceptGaebal').val(),
				rAcceptGaebal: $('#ratioAcceptGaebal').text(),
				
				tGamri: $('#txtGamri').val(),
				sGamri: $('#stepGamri').val(),
				wGamri: $('#WGamri').val(),
				rGamri: $('#ratioGamri').text(),
				
				tCheuglyang: $('#txtCheuglyang').val(),
				sCheuglyang: $('#stepCheuglyang').val(),
				wCheuglyang: $('#WCheuglyang').val(),
				rCheuglyang: $('#ratioCheuglyang').text(),
				
				tEvalueGamjeung: $('#txtEvalueGamjeung').val(),
				sEvalueGamjeung: $('#stepEvalueGamjeung').val(),
				wEvalueGamjeung: $('#WEvalueGamjeung').val(),
				rEvalueGamjeung: $('#ratioEvalueGamjeung').text(),
				
				tSplitPilji: $('#txtSplitPilji').val(),
				sSplitPilji: $('#stepSplitPilji').val(),
				wSplitPilji: $('#WSplitPilji').val(),
				rSplitPilji: $('#ratioSplitPilji').text(),
				
				wInheogabi: $('#WInheogabi').val(),
				rInheogabi: $('#ratioInheogabi').text(),
				
				tDevBudam: $('#txtDevBudam').val(),
				sDevBudam: $('#stepDevBudam').val(),
				wDevBudam: $('#WDevBudam').val(),
				rDevBudam: $('#ratioDevBudam').text(),
				
				tAlterSanrim: $('#txtAlterSanrim').val(),
				sAlterSanrim: $('#stepAlterSanrim').val(),
				wAlterSanrim: $('#WAlterSanrim').val(),
				rAlterSanrim: $('#ratioAlterSanrim').text(),
				
				wBudamgeum: $('#WBudamgeum').val(),
				rBudamgeum: $('#ratioBudamgeum').text(),
				
				tPurchaseChaegwon: $('#txtPurchaseChaegwon').val(),
				sPurchaseChaegwon: $('#stepPurchaseChaegwon').val(),
				wPurchaseChaegwon: $('#WPurchaseChaegwon').val(),
				rPurchaseChaegwon: $('#ratioPurchaseChaegwon').text(),
				
				tSetGeunjeodang: $('#txtSetGeunjeodang').val(),
				sSetGeunjeodang: $('#stepSetGeunjeodang').val(),
				wSetGeunjeodang: $('#WSetGeunjeodang').val(),
				rSetGeunjeodang: $('#ratioSetGeunjeodang').text(),
				
				tPreserveDeunggi: $('#txtPreserveDeunggi').val(),
				sPreserveDeunggi: $('#stepPreserveDeunggi').val(),
				wPreserveDeunggi: $('#WPreserveDeunggi').val(),
				rPreserveDeunggi: $('#ratioPreserveDeunggi').text(),
				
				tManagement: $('#txtManagement').val(),
				sManagement: $('#stepManagement').val(),
				wManagement: $('#WManagement').val(),
				rManagement: $('#ratioManagement').text(),
				
				tSellSusulyo: $('#txtSellSusulyo').val(),
				sSellSusulyo: $('#stepSellSusulyo').val(),
				wSellSusulyo: $('#WSellSusulyo').val(),
				rSellSusulyo: $('#ratioSellSusulyo').text(),
				
				tPreparation: $('#txtPreparation').val(),
				sPreparation: $('#stepPreparation').val(),
				wPreparation: $('#WPreparation').val(),
				rPreparation: $('#ratioPreparation').text(),
				
				wSaeobgyeongbi: $('#WSaeobgyeongbi').val(),
				rSaeobgyeongbi: $('#ratioSaeobgyeongbi').text(),
				
				wJichool: $('#WJichool').val(),
				rJichool: '100',
			};
			
			console.log(cfg);
			send('pdf', cfg);
		}
	}

}(
	hotplace.report = hotplace.report || {},
	jQuery
));