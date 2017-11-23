package me.hotplace.controller;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import me.hotplace.domain.AjaxVO;
import me.hotplace.service.SampleService;
import me.hotplace.utils.DataUtil;

@Controller
@RequestMapping("/preview")
public class SampleController {

	//@Value("#{settings['samplepath']}")
	//private String PATH;
	@Autowired
	SampleService sampleService;
	
	@GetMapping("standard")
	@ResponseBody
	public String getStandardData(@RequestParam(name="level") String level) throws Exception  {
		String data = sampleService.getSample(level);
		/*AjaxVO ajaxVO = new AjaxVO();
		ajaxVO.addObject(data);
		ajaxVO.setSuccess(true);*/
		//String s = "{\"success\":true, \"datas\":" + data + "}";
		String s = String.format(DataUtil.getAjaxFormats(), true, "", data);
		
		return s;
	}
	
	@GetMapping("celldetail")
	@ResponseBody
	public AjaxVO getCellDetail() throws InterruptedException {
		Thread.sleep(2000);
		return new AjaxVO();
	}
	
	@GetMapping(value="naver", produces="application/text; charset=utf8")
	@ResponseBody
	public String proxy(@RequestParam("key") String key, 
						@RequestParam("secret") String screte,
						@RequestParam("lat") String lat,
						@RequestParam("lng") String lng,
						HttpServletRequest request) throws ClientProtocolException, IOException {
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet httpGet = new HttpGet("https://openapi.naver.com/v1/map/reversegeocode.xml?encoding=utf-8&coordType=latlng&query=" + lat + "," + lng);
		
		httpGet.addHeader("X-Naver-Client-Id", key/*"ycKINrzbWFsin5J3z5y0"*/);
		httpGet.addHeader("X-Naver-Client-Secret", screte/*"HWF4Fos02l"*/);

		HttpResponse httpResponse = httpClient.execute(httpGet);
		HttpEntity responseEntity = httpResponse.getEntity();
		BufferedReader br = new BufferedReader(new InputStreamReader(responseEntity.getContent()));

        String input;
        String ausgabe = "";

        while ((input = br.readLine()) != null) {
            ausgabe += input + "\n";
        }
        br.close();
        System.err.println(ausgabe);
        return ausgabe;
	}
	
	@GetMapping("demo/{num}")
	public String demo(@PathVariable("num") String num) throws Exception  {
		
		
		return "preview/demo" + num;
	}
}
