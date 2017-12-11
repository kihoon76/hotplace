package me.hotplace.controller;

import java.util.List;

import javax.annotation.Resource;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import me.hotplace.domain.AjaxVO;
import me.hotplace.domain.GyeongGongmaeIn;
import me.hotplace.domain.GyeongGongmaeOut;
import me.hotplace.service.SearchService;

@RequestMapping("/search")
@Controller
public class SearchController {

	@Resource(name="searchService")
	private SearchService searchService;
	
	@PostMapping("gyeonggong")
	@ResponseBody
	public  AjaxVO<GyeongGongmaeOut> getGyeonggongSearchResult(@RequestBody GyeongGongmaeIn gyeongGongIn) {
		
		AjaxVO<GyeongGongmaeOut> vo = new AjaxVO<GyeongGongmaeOut>();
		
		try {
			ObjectMapper o = new ObjectMapper();
			System.err.println(o.writeValueAsString(gyeongGongIn));
			vo.setSuccess(true);
//			GyeongGongmaeOut gg = new GyeongGongmaeOut();
//			gg.setGubun("G");
//			gg.setType("대");
//			gg.setAddress("서울시 강남구 도곡동 963");
//			gg.setLat(127.152615967f);
//			gg.setLng(37.539648921f);
			
			List<GyeongGongmaeOut> list = searchService.getGyeongGongSearch(gyeongGongIn);
			int size = list.size();
			for(int i=0; i<size; i++) {
				vo.addObject(list.get(i));
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
}
