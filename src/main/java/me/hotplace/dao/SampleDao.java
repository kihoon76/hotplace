package me.hotplace.dao;

import java.util.List;
import java.util.Map;

public interface SampleDao {

	public List<String> selectSample(String level);

	public List<String> selectGyeongmaeTest(Map<String, String> param);
}
