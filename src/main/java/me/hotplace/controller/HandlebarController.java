package me.hotplace.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import me.hotplace.service.HotplaceService;

@RequestMapping("/handlebar")
@Controller
public class HandlebarController {

	@Resource(name="hotplaceService")
	HotplaceService hotplaceService;
	
	@GetMapping("login")
	public String getJoinTos(ModelMap m) {
		
		m.addAttribute("yaggwan", hotplaceService.getYaggwanList());
		
		return "loginForm";
	}
}
