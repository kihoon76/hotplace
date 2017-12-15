package me.hotplace.controller;

import javax.annotation.Resource;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import me.hotplace.domain.Account;
import me.hotplace.domain.AjaxVO;
import me.hotplace.service.UserService;

@RequestMapping("/user")
@Controller
public class UserController {

	@Resource(name="userService")
	private UserService userService;
	
	@PostMapping("join")
	@ResponseBody
	public AjaxVO join(@RequestBody Account account) {
		
		AjaxVO vo = new AjaxVO();
		
		try {
			ObjectMapper m = new ObjectMapper();
			System.err.println(m.writeValueAsString(account));
			vo.setSuccess(true);
			userService.join(account);
			
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("checkId")
	@ResponseBody
	public AjaxVO checkDuplicateId(@RequestParam("id") String id) {
		
		AjaxVO vo = new AjaxVO();
		
		try {
			vo.setSuccess(true);
			boolean r = userService.checkDuplicateId(id);
			if(r) {
				vo.setErrCode("300"); //중복됨
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
}
