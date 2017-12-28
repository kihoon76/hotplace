package me.hotplace.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class NoticeInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		String url = request.getRequestURL().toString();
		
		if(url.indexOf("/system/notice") > -1)  return true;
		
		if(false) {
			response.sendRedirect("/system/notice");
			return false;
		}
		
		return true;
	}

	
}
