package me.hotplace.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import me.hotplace.domain.Address;
import me.hotplace.domain.Gyeongmae;

@Repository("hotplaceDao")
public class HotplaceDaoImpl implements HotplaceDao {

	private final static String namespace = "mappers.mssql.hotplaceMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public List<String> selectListGuGun(String si) {
		
		return msSqlSession.selectList(namespace + ".selectGuGun", si);
	}

	@Override
	public List<String> selectListRegionName(Address addr) {
		return msSqlSession.selectList(namespace + ".selectRegionName", addr);
	}

	@Override
	public List<String> selectListAddress(Address address) {
		return msSqlSession.selectList(namespace + ".selectAddress", address);
	}

	@Override
	public List<String> selectListLocationBounds(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectLocationBounds", param);
	}
	
	@Override
	public List<String> selectGyeongmaeMarker(Map<String, String> param) {
		// TODO Auto-generated method stub
		return msSqlSession.selectList(namespace + ".selectGyeongmaeMarker", param);
	}

	@Override
	public Gyeongmae selectGyeongmaeThumb(String unu) {
		return msSqlSession.selectOne(namespace + ".selectGyeongmaeThumb", unu);
	}

	@Override
	public Gyeongmae selectGyeongmaeDetail(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectGyeongmaeDetail", param);
	}

}
