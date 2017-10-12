package me.hotplace.dao;

import java.util.List;
import java.util.Map;

import me.hotplace.domain.Address;

public interface HotplaceDao {

	public List<String> selectListGuGun(String si);

	public List<String> selectListRegionName(Address addr);

	public List<String> selectListAddress(Address address);

	public List<String> selectListLocationBounds(Map<String, String> param);

	public List<String> selectGyeongmaeMarker(Map<String, String> param);
}
