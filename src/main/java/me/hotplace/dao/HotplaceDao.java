package me.hotplace.dao;

import java.util.List;
import java.util.Map;

import me.hotplace.domain.AcceptBuilding;
import me.hotplace.domain.Address;
import me.hotplace.domain.BosangPyeonib;
import me.hotplace.domain.Gongmae;
import me.hotplace.domain.Gyeongmae;
import me.hotplace.domain.Silgeolae;

public interface HotplaceDao {

	public List<String> selectListGuGun(String si);

	public List<String> selectListRegionName(Address addr);

	public List<String> selectListAddress(Address address);

	public List<String> selectListLocationBounds(Map<String, String> param);

	public List<String> selectGyeongmaeMarker(Map<String, String> param);
	
	public Gyeongmae selectGyeongmaeThumb(String unu);

	public Gyeongmae selectGyeongmaeDetail(Map<String, String> param);

	public List<String> selectGongmaeMarker(Map<String, String> param);

	public List<String> selectListMulgeonAddress(Address address);

	public Gongmae selectGongmaeThumb(String unu);

	public List<String> selectBosangMarker(Map<String, String> param);

	public BosangPyeonib selectBosangPyeonibThumb(String unu);

	public List<String> selectSilgeolaeMarker(Map<String, String> param);

	public Silgeolae selectSilgeolaeThumb(String pnu);

	public List<String> selectAcceptBuildingMarker(Map<String, String> param);

	public AcceptBuilding selectAcceptbuildingThumb(String unu);
}
