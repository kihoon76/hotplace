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
	
	@Override
	public List<GyeongGongmaeOut> selectGyeongGongList(GyeongGongmaeIn gyeongGongIn) {
		
		return msSqlSession.selectList(namespace + ".selectGyeongGongList", gyeongGongIn);
	}

}
