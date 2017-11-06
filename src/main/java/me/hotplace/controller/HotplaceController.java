package me.hotplace.controller;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.mysql.jdbc.StringUtils;

import me.hotplace.domain.Address;
import me.hotplace.domain.BosangPyeonib;
import me.hotplace.domain.Gongmae;
import me.hotplace.domain.Gyeongmae;
import me.hotplace.domain.HpSearch;
import me.hotplace.domain.Silgeolae;
import me.hotplace.reporter.PdfItext;
import me.hotplace.service.HotplaceService;
import me.hotplace.types.MapTypes;
import me.hotplace.utils.DataUtil;

@Controller
@RequestMapping("/")
public class HotplaceController {

	@Resource(name = "hotplaceService")
	HotplaceService hotplaceService;
	
	@Resource(name="pdfItext")
	PdfItext pdfItext;
	
	@GetMapping("main")
	public String layout(@RequestParam(name="mType", required=false) String mType, HttpServletRequest request) {
		MapTypes mapType = StringUtils.isNullOrEmpty(mType) ? MapTypes.HEAT_MAP : MapTypes.getMapTypes(mType);
		request.setAttribute("mType", mapType.getType());
		return "main";
	}
	
	@GetMapping("signin")
	public String signinForm(HttpServletRequest request) {
		
		return "authresult";
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
		
		return hotplaceService.getAddressList(address);
	}
	
	@PostMapping(value="mulgeon/search", produces="application/text; charset=utf8")
	@ResponseBody
	public String getMulgeonAddress(@RequestBody Address address) {
		
		System.out.println(address);
		return hotplaceService.getMulgeonAddressList(address); 
	}
	
	@GetMapping("locationbounds")
	@ResponseBody
	public String getLocationBounds(@RequestParam(name="level") String level, 
									@RequestParam(name="nex") String nex,
									@RequestParam(name="swx") String swx,
									@RequestParam(name="swy") String swy,
									@RequestParam(name="ney") String ney,
									@RequestParam(name="year") String year) throws Exception  {
		
		Map<String, String> param = getBoundsParam(nex, swx, swy, ney);
		param.put("level", level);
		param.put("year", year);
		
		String data = hotplaceService.getLocationBounds(param);
		/*AjaxVO ajaxVO = new AjaxVO();
		ajaxVO.addObject(data);
		ajaxVO.setSuccess(true);*/
		//String s = "{\"success\":true, \"datas\":" + data + "}";
		String s = String.format(DataUtil.getAjaxFormats(), true, "", data);
		
		return s; 
	}
	
	@GetMapping("gyeongmaemarker")
	@ResponseBody
	public String getGyeongmaeMarker(@RequestParam(name="nex") String nex,
								  	 @RequestParam(name="swx") String swx,
								  	 @RequestParam(name="swy") String swy,
								  	 @RequestParam(name="ney") String ney,
								  	 @RequestParam(name="level") String level) throws Exception  {
		
		Map<String, String> param = getBoundsParam(nex, swx, swy, ney);
		
		return hotplaceService.getGyeongmaeMarker(param);
	}
	
	@GetMapping("gongmaemarker")
	@ResponseBody
	public String getGongmaemarker(@RequestParam(name="nex") String nex,
								   @RequestParam(name="swx") String swx,
								   @RequestParam(name="swy") String swy,
								   @RequestParam(name="ney") String ney) throws Exception  {
		
		Map<String, String> param = getBoundsParam(nex, swx, swy, ney);
		
		return hotplaceService.getGongmaeMarker(param);
	}
	
	@GetMapping("bosangmarker")
	@ResponseBody
	public String getBosangmarker(@RequestParam(name="nex") String nex,
								  @RequestParam(name="swx") String swx,
								  @RequestParam(name="swy") String swy,
								  @RequestParam(name="ney") String ney,
								  @RequestParam(name="level") String level) throws Exception  {
		
		Map<String, String> param = getBoundsParam(nex, swx, swy, ney);
		param.put("gubun", "보상");
		param.put("level", level);
		
		return hotplaceService.getBosangPyeonibMarker(param);
	}
	
	@GetMapping("pyeonibmarker")
	@ResponseBody
	public String getPyeonibmarker(@RequestParam(name="nex") String nex,
								  @RequestParam(name="swx") String swx,
								  @RequestParam(name="swy") String swy,
								  @RequestParam(name="ney") String ney,
								  @RequestParam(name="level") String level) throws Exception  {
		
		Map<String, String> param = getBoundsParam(nex, swx, swy, ney);
		param.put("gubun", "편입");
		param.put("level", level);
		
		return hotplaceService.getBosangPyeonibMarker(param);
	}
	
	@GetMapping(value="silgeolaemarker",  produces="text/plain; charset=utf8")
	@ResponseBody
	public String getSilgeolaemarker(@RequestParam(name="nex") String nex,
								     @RequestParam(name="swx") String swx,
								     @RequestParam(name="swy") String swy,
								     @RequestParam(name="ney") String ney) throws Exception  {
		
		Map<String, String> param = getBoundsParam(nex, swx, swy, ney);
		
		return hotplaceService.getSilgeolaeMarker(param);
	}
	
	@GetMapping("silgeolae/thumb")
	@ResponseBody
	public Silgeolae getSilgeolaeThumb(@RequestParam("pnu") String pnu) {
		
		return hotplaceService.getSilgeolaeThumb(pnu);
	}
	
	@PostMapping("hpgrade/search")
	@ResponseBody
	public HpSearch getHpgradeSearch(@RequestBody HpSearch hpSearch) throws InterruptedException {
		
		Thread.sleep(2000);
		return hpSearch;
	}
	
	@PostMapping("/download/{type}")
	public void downloadReport(@PathVariable("type") String type, 
							   @RequestParam(name="json") String data, HttpServletRequest request, HttpServletResponse response) throws Exception  {
		
		if(!"pdf".equals(type)) throw new Exception();
		
		Gson gson = new Gson();
		JsonElement element = gson.fromJson(data, JsonElement.class);
		JsonObject jsonObject = element.getAsJsonObject();
		
		String fileName = jsonObject.get("docName").getAsString();
		
		//한글파일명 라우저 별 처리
		
		if(request.getHeader("User-Agent").contains("MSIE") || request.getHeader("User-Agent").contains("Trident")) {
			fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
		}
		else {
			fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
		}
		
		response.setHeader("Content-Transper-Encoding", "binary");
		response.setHeader("Content-Disposition", "inline; filename=" + fileName + "." + type);
		response.setContentType("application/octet-stream");
		
		
		pdfItext.make(response, jsonObject);
		

	}
	
	@GetMapping("gyeongmae/thumb")
	@ResponseBody
	public Gyeongmae getGyeongmaeThumb(@RequestParam("unu") String unu) {
		
		return hotplaceService.getGyeongmaeThumb(unu);
	}
	
	@GetMapping("gyeongmae/detail")
	@ResponseBody
	public Gyeongmae getGyeongmaeDetail(@RequestParam("goyubeonho") String goyubeonho,
									    @RequestParam("deunglogbeonho") String deunglogbeonho,
									    @RequestParam("pnu") String pnu) {
		
		Gyeongmae g = hotplaceService.getGyeongmaeDetail(goyubeonho, deunglogbeonho);
		
		return g;
	}
	
	@GetMapping("gongmae/thumb")
	@ResponseBody
	public Gongmae getGongmaeThumb(@RequestParam("unu") String unu) {
		
		return hotplaceService.getGongmaeThumb(unu);
	}
	
	@GetMapping("bosangpyeonib/thumb")
	@ResponseBody
	public BosangPyeonib getBosangPyeonibThumb(@RequestParam("unu") String unu) {
		
		return hotplaceService.getBosangPyeonibThumb(unu);
	}
	
	
	private Map<String, String> getBoundsParam(String nex, String swx, String swy, String ney) {
		Map<String, String> param = new HashMap<String, String>();
		param.put("nex", nex);
		param.put("swx", swx);
		param.put("swy", swy);
		param.put("ney", ney);
		
		return param;
	}
}
