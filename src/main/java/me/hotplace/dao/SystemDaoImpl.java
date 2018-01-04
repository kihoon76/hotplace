package me.hotplace.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import me.hotplace.domain.SystemConfig;

@Repository("systemDao")
public class SystemDaoImpl implements SystemDao {

	private final static String namespace = "mappers.mssql.systemMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public List<SystemConfig> selectSystemConfigs() {
		return msSqlSession.selectList(namespace + ".selectSystemConfigAll");
	}

	@Override
	public SystemConfig selectSystemConfig(String configKey) {
		return msSqlSession.selectOne(namespace + ".selectSystemConfig", configKey);
	}

}
