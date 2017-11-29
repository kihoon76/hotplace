package me.hotplace.dao;

import java.util.List;

import me.hotplace.domain.Notice;
import me.hotplace.domain.NoticePage;

public interface NoticeDao {

	List<Notice> selectNoticeList();

	NoticePage selectPage(String pageNum);

	String selectNoticeContent(int writeNum);

}
