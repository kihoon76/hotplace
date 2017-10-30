package me.hotplace.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import me.hotplace.domain.Address;
import me.hotplace.domain.BosangPyeonib;
import me.hotplace.domain.Gongmae;
import me.hotplace.domain.Gyeongmae;
import me.hotplace.domain.Silgeolae;

@Repository("hotplaceDao")
public class HotplaceDaoImpl implements HotplaceDao {

	private final static String namespace = "mappers.mssql.hotplaceMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Resource(name = "msSqlSessionAgent")
	SqlSession msSqlSessionAgent;
	
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

	@Override
	public List<String> selectGongmaeMarker(Map<String, String> param) {
		return msSqlSessionAgent.selectList(namespace + ".selectGongmaeMarker", param);
	}

	@Override
	public List<String> selectListMulgeonAddress(Address address) {
		return msSqlSession.selectList(namespace + ".selectMulgeonAddress", address);
	}

	@Override
	public Gongmae selectGongmaeThumb(String unu) {
		// TODO Auto-generated method stub
		return msSqlSessionAgent.selectOne(namespace + ".selectGongmaeThumb", unu);
	}

	@Override
	public List<String> selectBosangMarker(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectBosangPyeonibMarker", param);
	}

	@Override
	public BosangPyeonib selectBosangPyeonibThumb(String unu) {
		// TODO Auto-generated method stub
		return msSqlSession.selectOne(namespace + ".selectBosangPyeonibThumb", unu);
	}

	@Override
	public List<String> selectSilgeolaeMarker(Map<String, String> param) {
		return msSqlSessionAgent.selectList(namespace + ".selectSilgeolaeMarker", param);
	}

	@Override
	public Silgeolae selectSilgeolaeThumb(String pnu) {
		return msSqlSessionAgent.selectOne(namespace + ".selectSilgeolaeThumb", pnu);
	}

}
