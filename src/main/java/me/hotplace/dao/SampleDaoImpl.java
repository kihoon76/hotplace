package me.hotplace.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Repository;

@Repository("sampleDao")
public class SampleDaoImpl implements SampleDao {

	private final static String namespace = "mappers.mssql.sampleMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<String> selectSample(String level) {
		List<String> result = msSqlSession.selectList(namespace + ".selectSample", level);
	
		return result;
	}

	@Override
	public List<String> selectGyeongmaeTest(Map<String, String> param) {
		// TODO Auto-generated method stub
		return msSqlSession.selectList(namespace + ".selectGyeongmaeTest", param);
	}

	
	
}
