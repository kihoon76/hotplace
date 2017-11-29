/**
 * @namespace hotplace.notice
 */
(function(notice, $) {
	var pageSize = 10;
	var pageBlock = 5;
	
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
		hotplace.getPlainText('notice/page/' + pageNum, null, function(jo) {
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
			table = '<table>';
			for(var i=0; i<cnt; i++) {
				table += '<tr><td>' + list[i].num + '</td><td>' + list[i].title + '</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
			}
			table += '</table>';
		}
		
		$container.html(table);
	}
	
	notice.showPage = function(pgNum) {
		_getNoticeList(pgNum || 1);
	}
}(
	hotplace.notice = hotplace.notice || {},
	jQuery
));