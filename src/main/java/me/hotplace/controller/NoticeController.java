package me.hotplace.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import me.hotplace.service.NoticeService;

@RequestMapping("/notice")
@Controller
public class NoticeController {

	@Resource(name="noticeService")
	NoticeService noticeService;
	
	@GetMapping(value="page/{pageNum}", produces="application/text; charset=utf8")
	@ResponseBody
	public String getPage(@PathVariable(name="pageNum") String pageNum) {
		
		return noticeService.getPage(pageNum);
	} 
}
