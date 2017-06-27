package me.hotplace.utils;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpHeaderUtil {

	private static final Logger logger = LoggerFactory.getLogger(HttpHeaderUtil.class);
	
	public static String getClientIP(HttpServletRequest request) {
		
		/*
		 * https://www.lesstif.com/pages/viewpage.action?pageId=20775886
		 * 
		 * */
		 String ip = request.getHeader("X-Forwarded-For");
		 String header = "X-Forwarded-For";
		 
		 if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
		     ip = request.getHeader("Proxy-Client-IP");
		     header = "Proxy-Client-IP";
		 } 
		 if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
		     ip = request.getHeader("WL-Proxy-Client-IP");
		     header = "WL-Proxy-Client-IP";
		 } 
		 if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
		     ip = request.getHeader("HTTP_CLIENT_IP"); 
		     header = "HTTP_CLIENT_IP";
		 } 
		 if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
		     ip = request.getHeader("HTTP_X_FORWARDED_FOR"); 
		     header = "HTTP_X_FORWARDED_FOR";
		 } 
		 if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
		     ip = request.getRemoteAddr(); 
		     header = "RemoteAddr";
		 }
		 
		logger.info("####################################################");
		logger.info("# " + header + " : " + ip);
		logger.info("####################################################");
		
		return ip;
	}
}
