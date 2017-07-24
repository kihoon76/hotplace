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
	public List<String> selectSample(String hcode) {
		System.out.println(hcode);
		List<String> result = msSqlSession.selectList(namespace + ".selectSample", hcode);
	
		return result;
	}

	
	
}
