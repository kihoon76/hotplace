/**
 * @namespace hotplace.gyeongmae
 */
(function(gyeongmae, $) {
	
	function _makeGyeongmaeJinhaengmulgeons(jinhaengmulgeons) {
		var cnt = jinhaengmulgeons.length;
		var html = '';
		
		if(cnt >= 1) {
			html += '<table class="table table-bordered">';
			html += '<colgroup>';
			html += '<col style="width:15%">';
	    	html += '<col style="width:10%">';
	    	html += '<col style="width:25%">';
	    	html += '<col style="width:10%">';
	    	html += '<col style="width:15%">';
	    	html += '<col style="width:15%">';
	    	html += '<col style="width:10%">';
	    	html += '</colgroup>';
	    	html += '<tr>';
	    	html += '<td>사건번호</td>';
	    	html += '<td>물건번호<br/>용도</td>';
	    	html += '<td>소재지 및 내역</td>';
	    	html += '<td>비고</td>';
	    	html += '<td>감정평가액<br/>최저매각가격</td>';
	    	html += '<td>담당계<br/>매각기일<br/>(입찰기간)</td>';
	    	html += '<td>진행<br/>상태</td>';
	    	html += '</tr>';
			
	    	var num, yongdo, maegaggiil, damdang;
			for(var i=0; i<cnt; i++) {
				num = jinhaengmulgeons[i].numyongdo.match(/\s*^[0-9]+/g);
				yongdo = jinhaengmulgeons[i].numyongdo.match(/[^0-9]+\d*/g);
				maegaggiil = jinhaengmulgeons[i].damdangmaegaggiil.match(/\s*[0-9]+\.\d*\.\d+/g);
				damdang = jinhaengmulgeons[i].damdangmaegaggiil.match(/\s*[^0-9\.]+\d*\W*/g);
				
				html += '<tr>';
				html += '<td>' + jinhaengmulgeons[i].sageonbeonho + '</td>';
				html += '<td>' + num + '<br/>' + yongdo + '</td>';
				html += '<td>' + jinhaengmulgeons[i].sojaejinaeyeog + '</td>';
				html += '<td>' + jinhaengmulgeons[i].bigo + '</td>';
				html += '<td>' + jinhaengmulgeons[i].gamjeongpyeongga.money() + '원<hr/>' + jinhaengmulgeons[i].minmaegaggagyeog.money() + '원</td>';
				html += '<td>' + damdang + '<br/>' + maegaggiil + '</td>';
				html += '<td>' + jinhaengmulgeons[i].status + '</td>';
				html += '</tr>';
			}
			
			html += '</table>';
		}
		else {
			html = '정보가 존재하지 않습니다.';
		}
		
		$('#tabJinhaengmulgeon').html(html);
	}
	
	function _makeGyeongmaeMaegagmulgeons(maegagmulgeons) {
		var cnt = maegagmulgeons.length;
		var html = '';
		
		if(cnt >= 1) {
			html += '<table class="table table-bordered">';
			html += '<colgroup>';
			html += '<col style="width:15%">';
	    	html += '<col style="width:10%">';
	    	html += '<col style="width:25%">';
	    	html += '<col style="width:25%">';
	    	html += '<col style="width:10%">';
	    	html += '<col style="width:25%">';
	    	html += '</colgroup>';
	    	html += '<tr>';
	    	html += '<td>사건번호</td>';
	    	html += '<td>용도</td>';
	    	html += '<td>소재지 및 내역</td>';
	    	html += '<td>감정평가액</td>';
	    	html += '<td>매각월</td>';
	    	html += '<td>매각대금</td>';
	    	html += '</tr>';
			
			for(var i=0; i<cnt; i++) {
				html += '<tr>';
				html += '<td>' + maegagmulgeons[i].sageonbeonho + '</td>';
				html += '<td>' + maegagmulgeons[i].yongdo + '</td>';
				html += '<td>' + maegagmulgeons[i].sojaeji + '</td>';
				html += '<td>' + maegagmulgeons[i].gamjeongpyeongga.money() + ' 원</td>';
				html += '<td>' + maegagmulgeons[i].maegagmonth + '</td>';
				html += '<td>' + maegagmulgeons[i].maegagdaegeum.money() + ' 원</td>';
				html += '</tr>';
			}
			
			html += '</table>';
		}
		else {
			html = '정보가 존재하지 않습니다.';
		}
		
		$('#tabMaegagmulgeon').html(html);
	}
	
	function _makeGyeongmaeTonggyes(tonggyes) {
		var cnt = tonggyes.length;
		var html = '';
		
		if(cnt >= 1) {
			html += '<table class="table table-bordered">';
			html += '<colgroup>';
			html += '<col style="width:10%">';
	    	html += '<col style="width:10%">';
	    	html += '<col style="width:20%">';
	    	html += '<col style="width:20%">';
	    	html += '<col style="width:10%">';
	    	html += '<col style="width:10%">';
	    	html += '</colgroup>';
	    	html += '<tr>';
	    	html += '<td>기간</td>';
	    	html += '<td>매각건수</td>';
	    	html += '<td>평균감정가</td>';
	    	html += '<td>평균매각가</td>';
	    	html += '<td>매각가율</td>';
	    	html += '<td>평균유찰횟수</td>';
	    	html += '</tr>';
			
			for(var i=0; i<cnt; i++) {
				html += '<tr>';
				html += '<td>' + tonggyes[i].gigan + '</td>';
				html += '<td>' + tonggyes[i].maegaggeonsu + ' 건</td>';
				html += '<td>' + tonggyes[i].avggamjeongga.money() + ' 원</td>';
				html += '<td>' + tonggyes[i].avgmaegagga.money() + ' 원</td>';
				html += '<td>' + tonggyes[i].maegaggaratio + ' %</td>';
				html += '<td>' + tonggyes[i].avgyuchal + ' 회</td>';
				html += '</tr>';
			}
			
			html += '</table>';
		}
		else {
			html = '정보가 존재하지 않습니다.';
		}
		
		$('#tabMaegagtonggye').html(html);
	}
	
	function _makeGyeongmaeLists(lists) {
		var cnt = lists.length;
		var html = '';
		if(cnt >= 1) {
			for(var i=0; i<cnt; i++) {
				html += '<tr>';
				html += '<td>' + lists[i].listnum + '</td>';
				html += '<td>' + lists[i].listgubun + '</td>';
				html += '<td>' + lists[i].detailhistory + '</td>';
				html += '</tr>';
			}
		}
		
		$('#tbGyeongmaeListHistory tbody').html(html);
	}
	
	function _makeGyeongmaeGiils(giils) {
		var cnt = giils.length;
		var html = '';
		if(cnt >= 1) {
			for(var i=0; i<cnt; i++) {
				html += '<tr>';
				html += '<td colspan="2">' + giils[i].giil + '</td>';
				html += '<td>' + giils[i].giiljonglyu + '</td>';
				html += '<td>' + giils[i].giiljangso + '</td>';
				html += '<td>' + ((giils[i].minmaegaggagyeog != undefined) ? giils[i].minmaegaggagyeog.money() : '') + '</td>';
				html += '<td>' + giils[i].giilresult + '</td>';
				html += '</tr>';
			}
		}
		else {
			html = '<tr><td colspan="6">기일내역이 없습니다.</td></tr>';
		}
		
		$(html).insertAfter('#gDgiilhistory');
	}
	
	/**
	 * {@link https://bootsnipp.com/snippets/kEK7M bootstrap carousel}
	 */
	function _makeGyeongmaeImages(images) {
		var cnt = images.length;
		var $gDimageCarousels = $('#gDimageCarousels');
		var currentRow = 0;
		var html = '';
		var gwanlyeonsajin = 0;
		var jeongyeongdo = 0;
		var wichido = 0;
		var jijeogdo = 0;
		var naebugujo = 0;
		var etc = 0;
		
		if(cnt >= 1) {
			
			$('#gDimages').carousel({
				interval: hotplace.config.gyeongmaeDetailImgInterval
			});
			
			for(var i=0; i<cnt; i++) {
				if(i%4 == 0) { //새로운 row
					if(i == 0) {
						html += '<div class="item active">';
					}
					else {
						html += '<div class="item">';
					}
					
					html += '<div class="row">';
				}
				
				html += '<div class="col-sm-3"><a href="#x"  data-toggle="modal" class="thumbnail" onclick="hotplace.gyeongmae.imageClick(this);"><img src="' + images[i].image + '" class="img-responsive" style="width:250px; height:250px;" data-gubun="' + images[i].gubun + '"></a></div>';
				
				if(i%4 == 3) {
					html += '</div></div>';
				}
				
				//사진구분
				switch(images[i].gubun) {
				case '관련사진':
					gwanlyeonsajin++;
					break;
				case '전경도':
					jeongyeongdo++;
					break;
				case '지적도':
					jijeogdo++;
					break;
				case '위치도':
					wichido++;
					break;
				case '내부구조도':
					naebugujo++;
					break;
				default : 
					etc++;
					break;
				}
			}
			
			if((cnt - 1)%4 < 3) {
				html += '</div></div>';
			}
			
			html += '<a class="left carousel-control" href="#gDimages" data-slide="prev">‹</a>';
			html += '<a class="right carousel-control" href="#gDimages" data-slide="next">›</a>';
			
			$('#gDjeongyeongdo').text(jeongyeongdo);
			$('#gDjijeogdo').text(jijeogdo);
			$('#gDwichido').text(wichido);
			$('#gDgwanlyeonsajin').text(gwanlyeonsajin);
			$('#gDnaebugujo').text(naebugujo);
			$('#gDetc').text(etc);
		}
		
		$gDimageCarousels.html(html);
	}
	
	function _bindDetailClickHandler(win) {
		
		//경매 물건상세보기 handler
		$('#btnGyeongmaeDetail').on('click', function() {
			var param = {
				goyubeonho: $(this).data('goyubeonho'),
				pnu: $(this).data('pnu'),
				deunglogbeonho: $(this).data('deunglogbeonho')
			}
			
			hotplace.dom.insertFormInmodal('gyeongmaeDetailForm');
			hotplace.dom.openModal('', 'fullsize', function() {
				win.close();
			});
			
			hotplace.ajax({
				url: 'gyeongmae/detail',
				method: 'GET',
				dataType: 'json',
				data: param,
				loadEl: '#dvGyeongmaeDetail',
				success: function(data, textStatus, jqXHR) {
					console.log(data)
					$('#gDsageonbeonho').text(data.sageonbeonho);
					$('#gDdamdang').text(data.damdang);
					$('#gDsageonjeobsuil').text(data.sageonjeobsuil);
					$('#gDsojaeji').text(data.sojaeji);
					$('#gDyongdo').text(data.yongdo);
					$('#gDibchalbangbeob').text(data.ibchalbangbeob);
					$('#gDgamjeongpyeongga').text((data.gamjeongpyeongga) ? data.gamjeongpyeongga.money() + ' 원' : '');
					$('#gDminmaegaggagyeog').text((data.minmaegaggagyeog) ? data.minmaegaggagyeog.money() + ' 원' : '');
					$('#gDyuchal').text(data.yuchal);
					$('#gDbaedangyogu').text(data.baedangyogu);
					$('#gDcheonggu').text((data.cheonggu) ? data.cheonggu.money() + ' 원': '');
					$('#gDmaegaggiil').text(data.maegaggiil);
					$('#gDbigo').text(data.bigo);
					
					_makeGyeongmaeImages(data.images);
					_makeGyeongmaeGiils(data.giils);
					_makeGyeongmaeLists(data.lists);
					_makeGyeongmaeTonggyes(data.tonggyes);
					_makeGyeongmaeMaegagmulgeons(data.maegagmulgeons);
					_makeGyeongmaeJinhaengmulgeons(data.jinhaengmulgeons);
				},
				error:function() {
					
				}
			});
		});
	}
	
	function _getThumb(data) {
		hotplace.ajax({
			url: 'gyeongmae/thumb',
			method: 'GET',
			dataType: 'json',
			data: {unu: data.info.unu},
			loadEl: '#dvGyeongmae',
			success: function(data, textStatus, jqXHR) {
				//hotplace.dom.createChart('canvas');
				console.log(data);
				$('#gSojaeji').text(data.sojaeji || '');
				$('#gYongdo').text((data.yongdo || '').replace(/\|/gm, ','));
				$('#gGamjeongpyeongga').text((data.gamjeongpyeongga || '').money());
				$('#gYuchal').text(data.yuchal || '');
				$('#gMaegaggiil').text(data.maegaggiil || '');
				
				if(data.imgThumb) {
					$('#gImgThumb').prop('src', data.imgThumb);
				}
				
				$('#btnGyeongmaeDetail').data('goyubeonho', data.goyubeonho);
				$('#btnGyeongmaeDetail').data('pnu', data.pnu);
				$('#btnGyeongmaeDetail').data('deunglogbeonho', data.deunglogbeonho);
			},
			error:function() {
				
			}
		});
	}
	
	/** 
	 * @memberof hotplace.gyeongmae 
	 * @function imageClick 
	 * @param {object} me (a 태그 > img 태그)
	 * @desc  경매상세보기에서 이미지 클릭시 확대이미지 보여주는 handler
	 * {@link http://api.jqueryui.com/dialog/#method-open jquery-ui-dialog}
	 */
	gyeongmae.imageClick = function(me) {
		var $img = $(me).children();
		var img = $img.prop('src');
		var gubun = $img.data('gubun');
		
		$('#enlargeImageModalSource').prop('src', img);
		$('#enlargeImageModal').modal('show');
		$('#enlargeImageModalTitle').text(gubun);
		return false;
	}
	
	/** 
	 * @memberof hotplace.gyeongmae 
	 * @function markerClick 
	 * @param {object} map 맵
	 * @param {object} marker 마커
	 * @param {object} win InfoWindow
	 */
	gyeongmae.markerClick = function(map, marker, win) {
		var data = marker._data;
		win.open(map, marker);
		var tForm = hotplace.dom.getTemplate('gyeongmaeForm');
		
		//win.setOptions('anchorSkew', true);
		win.setOptions('maxWidth', 300);
		win.setOptions('content', tForm());
		
		$('#btnGyeongmaeClose').on('click', function() {
			win.close();
		});
		
		_bindDetailClickHandler(win);
		_getThumb(data);
	}
	
	$(document).on('click', '#btnGyeongmaeImageClose', function() {
		$('#enlargeImageModal').modal('hide');
	});
}(
	hotplace.gyeongmae = hotplace.gyeongmae || {},
	jQuery
));