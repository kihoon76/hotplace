package me.hotplace.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import me.hotplace.domain.AjaxVO;
import me.hotplace.domain.ApplicationConfig;
import me.hotplace.service.SystemService;

@RequestMapping("/system")
@Controller
public class SystemController {

	@Resource(name="applicationConfig")
	ApplicationConfig applicationConfig;
	
	@Resource(name="systemService")
	SystemService systemService;
	
	@GetMapping("notice")
	public String noticeSystemError() {
		return "noticeError";
	}
	
	@GetMapping("config/{configKey}")
	@ResponseBody
	public AjaxVO configApp(@PathVariable("configKey") String configKey) {
		AjaxVO vo = new AjaxVO();
		
		try {
			applicationConfig.setConfig(configKey, systemService.getSystemConfig(configKey));
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		return vo;
	}
}
