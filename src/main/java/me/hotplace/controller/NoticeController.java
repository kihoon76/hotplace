package me.hotplace.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import me.hotplace.service.NoticeService;
import me.hotplace.utils.DataUtil;

@RequestMapping("/notice")
@Controller
public class NoticeController {

	@Resource(name="noticeService")
	NoticeService noticeService;
	
	@GetMapping(value="page/{pageNum}", produces="application/text; charset=utf8")
	@ResponseBody
	public String getPage(@PathVariable(name="pageNum") int pageNum,
						  @RequestParam(name="type", required=false) String type,
						  @RequestParam(name="text", required=false) String text) {
		
		Map map = new HashMap();
		map.put("pageNum", pageNum);
		map.put("type", type);
		map.put("text", DataUtil.getMssqlEscape(text));
		
		return noticeService.getPage(map);
	} 
	
	@GetMapping(value="page/content/{writeNum}", produces="application/text; charset=utf8")
	@ResponseBody
	public String getNoticeContent(@PathVariable(name="writeNum") int writeNum) {
		
		return noticeService.getNoticeContent(writeNum);
	}
}
