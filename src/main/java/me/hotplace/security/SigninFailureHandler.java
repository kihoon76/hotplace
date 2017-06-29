package me.hotplace.security;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import me.hotplace.domain.AjaxVO;
import me.hotplace.exceptions.NotAuthorizedByAdmin;

@Component
public class SigninFailureHandler extends SimpleUrlAuthenticationFailureHandler{

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		
		AjaxVO<Map> ajax = new AjaxVO<Map>();
		ajax.setSuccess(false);
		
		Map<String, String> data = new HashMap<String, String>();
		//사용자정보 없음
		if(exception.getClass().isAssignableFrom(UsernameNotFoundException.class)) {
			data.put("type", "ID");
		}
		else if(exception.getClass().isAssignableFrom(BadCredentialsException.class)) {
			data.put("type", "PW");
		}
		else if(exception.getClass().isAssignableFrom(NotAuthorizedByAdmin.class)) {
			data.put("type", "AUTH");
		}
		else {
			data.put("type", "ETC");
		}
		
		ajax.addObject(data);
		
		PrintWriter out = response.getWriter();
		out.print(new Gson().toJson(ajax));
		out.flush();
		out.close();
	}
	
	
}
