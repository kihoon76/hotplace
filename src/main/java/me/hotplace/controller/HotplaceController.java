package me.hotplace.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.mysql.jdbc.StringUtils;

import me.hotplace.types.MapTypes;

@Controller
@RequestMapping("/")
public class HotplaceController {

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
}
