package me.hotplace.dao;

import java.util.List;

import me.hotplace.domain.SystemConfig;

public interface SystemDao {

	public List<SystemConfig> selectSystemConfigs();

	public SystemConfig selectSystemConfig(String configKey);
}
