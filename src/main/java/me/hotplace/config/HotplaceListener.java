package me.hotplace.config;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import me.hotplace.domain.ApplicationConfig;
import me.hotplace.domain.SystemConfig;
import me.hotplace.service.SystemService;

@Component
public class HotplaceListener {

	@Resource(name="systemService")
	SystemService systemService;
	
	@Resource(name="applicationConfig")
	ApplicationConfig applicationConfig;
	
	@EventListener
	public void initApp(ContextRefreshedEvent event) {
		/*System.err.println("sdfsdfsdfsdfsdfsdf");
		ApplicationContext context = ((ContextRefreshedEvent)event).getApplicationContext();*/
		
		List<SystemConfig> config = systemService.getSystemConfigs();
		int cnt = config.size();
		
		for(int i=0; i<cnt; i++) {
			applicationConfig.setConfig(config.get(i).getNum(), config.get(i));
		}
	}

}
