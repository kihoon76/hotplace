package me.hotplace.service;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import me.hotplace.dao.NoticeDao;
import me.hotplace.domain.Notice;
import me.hotplace.domain.NoticePage;
import me.hotplace.utils.DataUtil;

@Service("noticeService")
public class NoticeService {
	
	@Resource(name="noticeDao")
	NoticeDao noticeDao;
	
	public String getPage(String pageNum) {
		// TODO Auto-generated method stub
		NoticePage noticePage = noticeDao.selectPage(pageNum);
		ObjectMapper om = new ObjectMapper();
		String data = "";
		boolean result = true;
		
		try {
			data = om.writeValueAsString(noticePage);
		} 
		catch (JsonGenerationException e) {
			result = false;
		} 
		catch (JsonMappingException e) {
			result = false;
		}
		catch (IOException e) {
			result = false;
		}
		
		return DataUtil.makeReturn(data, result);
	}

	public List<Notice> getNoticeList() {
		List<Notice> list = noticeDao.selectNoticeList();
		
		return list;
	}

	public String getNoticeContent(int writeNum) {
		String content =  noticeDao.selectNoticeContent(writeNum);
		return DataUtil.makeReturn("{\"content\":\"" + content + "\"}", true);
	}
}
