package me.hotplace.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import me.hotplace.dao.SampleDao;
import me.hotplace.dao.SampleDaoImpl;
import me.hotplace.utils.DataUtil;

@Service("SampleService")
public class SampleService {

	@Resource(name="sampleDao")
	SampleDao sampleDao;
	
	public String getSample() {
		List<String> list = sampleDao.selectSample();
		return DataUtil.makeLatLng(list, "□");
		
		//return "[[125.4,37.75],[128.56,35.42],[128.34,35.57],[125.91,33.51],[125.89,33.53],[125.92,33.52]]";
	}
}
