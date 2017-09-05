package me.hotplace.controller;

import java.util.HashMap;
import java.util.Map;

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
import me.hotplace.domain.HpSearch;
import me.hotplace.service.HotplaceService;
import me.hotplace.types.MapTypes;
import me.hotplace.utils.DataUtil;

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
							 @RequestParam(name="gugun", required=false) String gugun) {
			
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
	
	@GetMapping("locationbounds")
	@ResponseBody
	public String getLocationBounds(@RequestParam(name="level") String level, 
									@RequestParam(name="nex") String nex,
									@RequestParam(name="swx") String swx,
									@RequestParam(name="swy") String swy,
									@RequestParam(name="ney") String ney,
									@RequestParam(name="year") String year) throws Exception  {
		
		Map<String, String> param = new HashMap<String, String>();
		param.put("level", level);
		param.put("nex", nex);
		param.put("swx", swx);
		param.put("swy", swy);
		param.put("ney", ney);
		param.put("year", year);
		
		String data = hotplaceService.getLocationBounds(param);
		/*AjaxVO ajaxVO = new AjaxVO();
		ajaxVO.addObject(data);
		ajaxVO.setSuccess(true);*/
		//String s = "{\"success\":true, \"datas\":" + data + "}";
		String s = String.format(DataUtil.getAjaxFormats(), true, "", data);
		
		return s;
	}
	
	@GetMapping("gongsi")
	@ResponseBody
	public String getGongsiBounds(@RequestParam(name="level") String level, 
								  @RequestParam(name="nex") String nex,
								  @RequestParam(name="swx") String swx,
								  @RequestParam(name="swy") String swy,
								  @RequestParam(name="ney") String ney) throws Exception  {
		
		Map<String, String> param = new HashMap<String, String>();
		param.put("level", level);
		param.put("nex", nex);
		param.put("swx", swx);
		param.put("swy", swy);
		param.put("ney", ney);
		
		String data = hotplaceService.getGongsiBounds(param);
		/*AjaxVO ajaxVO = new AjaxVO();
		ajaxVO.addObject(data);
		ajaxVO.setSuccess(true);*/
		//String s = "{\"success\":true, \"datas\":" + data + "}";
		String s = String.format(DataUtil.getAjaxFormats(), true, "", data);
		
		return s;
	}
	
	@PostMapping("hpgrade/search")
	@ResponseBody
	public HpSearch getHpgradeSearch(@RequestBody HpSearch hpSearch) {
		
		System.out.println(hpSearch.getBlgr().getMax());
		return hpSearch;
	}

}
