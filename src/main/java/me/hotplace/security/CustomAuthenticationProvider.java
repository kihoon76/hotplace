package me.hotplace.security;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import me.hotplace.exceptions.NotAuthorizedByAdmin;


@Component
public class CustomAuthenticationProvider implements AuthenticationProvider{

	private final static Logger logger = LoggerFactory.getLogger(CustomAuthenticationProvider.class);
	
	@Resource(name="userDetailsService")
	UserDetailsServiceImpl userDetailsService;
	
	@Autowired 
	private PasswordEncoder passwordEncoder;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username = (String) authentication.getPrincipal();
		String password = (String) authentication.getCredentials();
		
		logger.info("사용자가 입력한 로그인정보입니다. {}", username + "/" + password);
		UserDetailsImpl user;
		
		try {
			user = userDetailsService.loadUserByUsername(username);
			if(!password.equals(user.getPassword())) throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");

			logger.info("정상로그인 입니다.");
				
		}
		catch(UsernameNotFoundException e) {
			throw e;
		}
		catch(BadCredentialsException e) {
			throw e; 
		}
		catch(NotAuthorizedByAdmin e) {
			throw e;
		}
		catch(Exception e) {
			logger.info(e.toString());
			throw new RuntimeException(e.getMessage());

		}
		
		//return new UsernamePasswordAuthenticationToken(username, password, user.getAuthorities());
		return new UsernamePasswordAuthenticationToken(username, password, user.getAuthorities());
		
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
