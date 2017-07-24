package me.hotplace.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import me.hotplace.dao.HotplaceDao;
import me.hotplace.domain.Address;
import me.hotplace.utils.DataUtil;

@Service("hotplaceService")
public class HotplaceService {

	@Resource(name="hotplaceDao")
	HotplaceDao hotplaceDao;
	
	public String getGuGunList(String si) {
		List<String> list = hotplaceDao.selectListGuGun(si);
		return DataUtil.makeAddress(list);
	}

	public String getRegionNameList(Address addr) {
		List<String> list = hotplaceDao.selectListRegionName(addr);
		return DataUtil.makeAddress(list);
	}

	public String getAddressList(Address address) {
		List<String> list = hotplaceDao.selectListAddress(address);
		return DataUtil.makeAddress(list);
		
	}
}
