/**
 * @namespace hotplace.notice
 */
(function(notice, $) {
	var pageSize = 10,
		pageBlock = 5,
		searchCondition = 'all',
		searchMode = false,
		searchParam = {
			type: '',
			text: ''
		};
	
	function _makePagination(total, pageNum) {
		
		var pageCnt = Math.ceil(total/pageSize);
		var pgBlockStart = pageBlock * Math.floor((pageNum - 1)/(pageBlock)) + 1;
		
		var block = pgBlockStart + pageBlock;
		var lastGroup = false;
		
		var $nav = $('#dvNoticePagination ul');
		var html = '';
		
		if(pgBlockStart > 1) {
			html += '<li><a href = "#" onclick="hotplace.notice.showPage(' + (pageNum - 1) + ')">&laquo;</a></li>';
		}
		
		for(var i=pgBlockStart; i<block; i++) {
			if(i > pageCnt) {
				lastGroup = true;
				break;
			}
			
			if(i == pageNum) {
				html +=	'<li class = "active"><a href = "#">' + i + '</a></li>';
			}
			else {
				html +=	'<li><a href = "#" onclick="hotplace.notice.showPage(' + i + ')">' + i + '</a></li>';
			}
		}
		
   		if(!lastGroup) html +=	'<li><a href = "#" onclick="hotplace.notice.showPage(' + block + ')">&raquo;</a></li>';
   		
   		$nav.html(html);
	} 
	
	function _makeTotalLabel(total) {
		$('#dvTotalNotice').html('총 ' + total + ' 건');
	}
	
	function _getNoticeList(pageNum) {
		var param = null;
		
		if(searchMode) {
			param = searchParam;
		}
		
		hotplace.getPlainText('notice/page/' + pageNum, param, function(jo) {
			console.log(jo.datas)
			_makeList(jo.datas);
			_makePagination(jo.datas.total, pageNum);
			_makeTotalLabel(jo.datas.total);
		},true, false, null, '#dvCenterModalContent');
	}
	
	function _makeList(data) {
		var list = data.list;
		var cnt = list.length;
		
		var $container = $('#dvNoticeTb');
		var table = '';
		if(cnt > 0) {
			table = '<table><colgroup><col style="width:5%"><col style="width:95%"></colgroup>';
			for(var i=0; i<cnt; i++) {
				table += '<tr data-index="' + list[i].num + '"><td>' + list[i].num + '</td><td>' + list[i].title + '</td><!--<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>--></tr>'; 
			}
			table += '</table>';
		}
		
		$container.html(table);
	}
	
	function _removeSelected() {
		$('#dvNoticeTb tr').each(function() {
			if($(this).hasClass('content')) {
				$(this).remove();
			}
			else {
				$(this).removeClass('selected');
			}
		});
	}
	
	function _makeContentTr($tr) {
		hotplace.getPlainText('notice/page/content/' + $tr.data('index'), null, function(jo) {
			console.log(jo.datas);
			var content = jo.datas.content;
			var tr = '<tr class="content"><td colspan="5">' + content + '</td></tr>';
			$(tr).insertAfter($tr);
			
		},true, false, null, '#dvCenterModalContent');
	}
	
	notice.showPage = function(pgNum) {
		_getNoticeList(pgNum || 1);
	}
	
	$(document).on('click', '#dvNoticeTb tr', function() {
		if($(this).hasClass('content')) return;
		var opened = $(this).hasClass('opened');
		if(opened) {
			$(this).next().remove();
			$(this).removeClass('opened')
		}
		else {
			_removeSelected();
			$(this).addClass('selected opened');
			_makeContentTr($(this));
		}
	
	});
	
	//검색 조건
	$(document).on('change', '#dvNoticeSearchItem select', function() {
		searchCondition = $(this).val();
		var $txt = $('#dvNoticeSearchItem input[type=text]');
		var $btn = $('#dvNoticeSearchItem button');
		
		if(searchCondition == 'all') {
			searchMode = false;
			$txt.val('');
			$txt.hide();
			$btn.hide();
			hotplace.notice.showPage(1);
		}
		else {
			$txt.show();
			$btn.show();
		}
	});
	
	$(document).on('click', '#dvNoticeSearchItem button', function(e, txt) {
		var search = txt || $.trim($('#dvNoticeSearchItem input[type=text]').val());
		
		if(search) {
			searchParam.type = searchCondition;
			searchParam.text = search;
			searchMode = true;
			_getNoticeList(1);
		}
	});
	
	$(document).on('keydown', '#dvNoticeSearchItem input[type=text]', function(e) {
		if (e.which == 13) {
			var txt = $.trim(e.target.value);
			if(txt) {
				$('#dvNoticeSearchItem button').trigger('click', txt);
			}
	    }
	});
}(
	hotplace.notice = hotplace.notice || {},
	jQuery
));