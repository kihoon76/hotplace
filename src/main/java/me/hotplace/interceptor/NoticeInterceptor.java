package me.hotplace.interceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import me.hotplace.domain.ApplicationConfig;
import me.hotplace.utils.HttpHeaderUtil;

public class NoticeInterceptor extends HandlerInterceptorAdapter {
	
	@Resource(name="applicationConfig")
	ApplicationConfig applicationConfig;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		String url = request.getRequestURL().toString();
		
		if(url.indexOf("/system/notice") > -1)  return true;
		
		System.err.println(applicationConfig.getValue("C1"));
		if("on".equals(applicationConfig.getValue("C1"))) {
			if(HttpHeaderUtil.isByPassIP(applicationConfig.getBigo("C1").split(","), request)) {
				return true;
			}
			
			//ajax call 처리
			if("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
				response.getWriter().write("something");
			}
			else {
				response.sendRedirect("/system/notice");
			}
			
			return false;
		}
		
		return true;
	}

	
}
