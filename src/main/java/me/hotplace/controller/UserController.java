package me.hotplace.controller;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import me.hotplace.domain.Account;
import me.hotplace.domain.AjaxVO;

@RequestMapping("/user")
@Controller
public class UserController {

	@PostMapping("join")
	@ResponseBody
	public AjaxVO join(@RequestBody Account account) {
		
		AjaxVO vo = new AjaxVO();
		
		try {
			ObjectMapper m = new ObjectMapper();
			System.err.println(m.writeValueAsString(account));
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
}
