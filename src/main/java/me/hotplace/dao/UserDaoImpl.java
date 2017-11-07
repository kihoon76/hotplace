package me.hotplace.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import me.hotplace.domain.Account;

@Repository("userDao")
public class UserDaoImpl implements UserDao {

	private final static String namespace = "mappers.mysql.userMapper";
	
	@Resource(name = "mySqlSession")
	SqlSession mySqlSession;
	
	@Override
	public Account getAccount(String id) {
		return mySqlSession.selectOne(namespace + ".selectUser", id);
	}

}
