package me.hotplace.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import me.hotplace.dao.UserDao;
import me.hotplace.domain.Account;

@Service("userService")
public class UserService {

	@Resource(name="userDao")
	private UserDao userDao;
	
	public Account getUserInfo(String username) {
		return userDao.getAccount(username);
	}
	
}
