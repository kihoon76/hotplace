package me.hotplace.security;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import me.hotplace.domain.Account;
import me.hotplace.service.UserService;

@Service("userDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService{

	private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
	
	@Autowired
	UserService userService;
	
	//@Autowired
	//private HttpServletRequest request;
	
	@Override
	public UserDetailsImpl loadUserByUsername(String username) throws UsernameNotFoundException {
		logger.info("username ==> " + username);
		
		//회원정보 dao에서 데이터 읽어옴
		Account user = null;
		try {
			user = userService.getUserInfo(username);
		}
		catch(Exception e) {
			throw new UsernameNotFoundException("접속자 정보 DB에서  문제가 발생했습니다. ");
		}
		
		if(user == null) throw new UsernameNotFoundException("접속자 정보(ID)를 찾을수 없습니다 ");
		
		// TODO 디비에서 가져온 정보로 비교로직
		
		
		UserDetailsImpl userDetails = new UserDetailsImpl(user); 
		
		
		return userDetails;
	}
}
