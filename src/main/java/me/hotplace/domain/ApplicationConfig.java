package me.hotplace.domain;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component("applicationConfig")
public class ApplicationConfig {

	private Map<String, SystemConfig> configs = new HashMap<String, SystemConfig>();
	
	public void setConfig(String key, SystemConfig value) {
		configs.put(key, value);
	}
	
	public String getName(String key) {
		return getItem(key, "name");
	}
	
	public String getValue(String key) {
		return getItem(key, "value");
	}
	
	public String getBigo(String key) {
		return getItem(key, "bigo");
	}
	
	private String getItem(String key, String item) {
		String r = "";
		SystemConfig sc = configs.get(key);
		
		if(sc != null) {
			switch(item) {
			case "name" :
				r = sc.getName();
				break;
			case "value" :
				r = sc.getValue();
				break;
			case "bigo" :
				r = sc.getBigo();
				break;
			}
		}
		
		return r;
	}
}
