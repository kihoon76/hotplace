package me.hotplace.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import me.hotplace.domain.AjaxVO;

@RequestMapping("/upload")
@Controller
public class UploadController {

	@Value("#{pathCfg['upload']}")
	private String UPLOAD_LOCATION;
	
	@PostMapping("maemul")
	@ResponseBody
	public AjaxVO uploadRegMaemul(@RequestParam("file") MultipartFile[] files) {
		
		AjaxVO vo = new AjaxVO();
		
		vo.setSuccess(true);
		
		List<String> fileNames = new ArrayList<String>();
		
		try {
			for(MultipartFile file: files) {
				System.err.println(file.getOriginalFilename());
				FileCopyUtils.copy(file.getBytes(), new File(UPLOAD_LOCATION + file.getOriginalFilename()));
			}
		}
		catch(IOException e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
}
