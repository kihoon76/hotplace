package me.hotplace.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mysql.jdbc.StringUtils;

import me.hotplace.domain.Address;
import me.hotplace.service.HotplaceService;
import me.hotplace.types.MapTypes;

@Controller
@RequestMapping("/")
public class HotplaceController {

	@Resource(name = "hotplaceService")
	HotplaceService hotplaceService;
	
	@GetMapping("main")
	public String layout(@RequestParam(name="mType", required=false) String mType, HttpServletRequest request) {
		MapTypes mapType = StringUtils.isNullOrEmpty(mType) ? MapTypes.HEAT_MAP : MapTypes.getMapTypes(mType);
		request.setAttribute("mType", mapType.getType());
		return "main";
	}
	
	@GetMapping("signin")
	public String signinForm(HttpServletRequest request) {
		
		return "signin";
	}
	
	@GetMapping(value="address/condition", produces="application/text; charset=utf8")
	@ResponseBody
	public String getAddressSearchCondition(@RequestParam(name="type", required=true) String type,
							 @RequestParam(name="si", required=true) String si,
							 @RequestParam(name="gugun", required=false) String gugun,
							 @RequestParam(name="road", required=false) String road) {
			
		if("".equals(gugun)) {
			return hotplaceService.getGuGunList(si);
		}
		
		if("R".equals(type)) {
			return "";
		}
		else {
			Address addr = new Address();
			addr.setSi(si);
			addr.setGugun(gugun);
			return hotplaceService.getRegionNameList(addr);
		}
		
	}
	
	@PostMapping(value="address/search", produces="application/text; charset=utf8")
	@ResponseBody
	public String getAddress(@RequestBody Address address) {
		
		System.out.println(address);
		return hotplaceService.getAddressList(address);
	}
	

}
