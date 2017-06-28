package me.hotplace.controller;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import me.hotplace.domain.AjaxVO;
import sample.Heatmap;

@Controller
@RequestMapping("/sample")
public class SampleController {

	@PostMapping("heatmap")
	@ResponseBody
	public AjaxVO getHeatmapData() throws Exception  {
		
		Gson gson = new Gson();
		
		BufferedReader br = new BufferedReader(new FileReader("E:\\hoons\\workspace\\hotplace\\sample\\heatmap.json"));
		
		Heatmap obj = gson.fromJson(br, Heatmap.class);
		
		AjaxVO ajaxVO = new AjaxVO();
		ajaxVO.addObject(obj);
		ajaxVO.setSuccess(true);
		
		
		return ajaxVO;
	}
}
