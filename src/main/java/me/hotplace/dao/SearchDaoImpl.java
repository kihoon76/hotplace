package me.hotplace.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import me.hotplace.domain.GyeongGongmaeIn;
import me.hotplace.domain.GyeongGongmaeOut;

@Repository("searchDao")
public class SearchDaoImpl implements SearchDao {

	private final static String namespace = "mappers.mssql.searchMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Resource(name = "msSqlSessionAgent2")
	SqlSession msSqlSessionAgent2;
	
	@Override
	public List<GyeongGongmaeOut> selectGyeongGongList(GyeongGongmaeIn gyeongGongIn) {
		
		return msSqlSessionAgent2.selectList(namespace + ".selectGyeongGongList", gyeongGongIn);
	}

}
