package me.hotplace.dao;

import java.util.List;
import java.util.Map;

import me.hotplace.domain.Notice;
import me.hotplace.domain.NoticePage;

public interface NoticeDao {

	List<Notice> selectNoticeList();

	NoticePage selectPage(Map map);

	String selectNoticeContent(int writeNum);

}
