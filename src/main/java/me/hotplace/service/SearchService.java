package me.hotplace.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import me.hotplace.dao.SearchDao;
import me.hotplace.domain.GyeongGongmaeIn;
import me.hotplace.domain.GyeongGongmaeOut;

@Service("searchService")
public class SearchService {

	@Resource(name="searchDao")
	SearchDao searchDao; 
	
	public List<GyeongGongmaeOut> getGyeongGongSearch(GyeongGongmaeIn gyeongGongIn) {
		
		return searchDao.selectGyeongGongList(gyeongGongIn);
	}
}
