package me.hotplace.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import me.hotplace.dao.SystemDao;
import me.hotplace.domain.SystemConfig;

@Service("systemService")
public class SystemService {
	@Resource(name="systemDao")
	SystemDao systemDao;
	
	public List<SystemConfig> getSystemConfigs() {
		return systemDao.selectSystemConfigs();
	}

	public SystemConfig getSystemConfig(String configKey) {
		return systemDao.selectSystemConfig(configKey);
	}
}
