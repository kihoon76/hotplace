package me.hotplace.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import me.hotplace.domain.Account;

@Repository("userDao")
public class UserDaoImpl implements UserDao {

	private final static String namespace = "mappers.mssql.userMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public Account getAccount(String id) {
		return msSqlSession.selectOne(namespace + ".selectUser", id);
	}

	@Override
	public int selectIdCount(String id) {
		return msSqlSession.selectOne(namespace + ".selectIdCount", id);
	}

	@Override
	public void insertJoin(Account account) {
		msSqlSession.insert(namespace + ".insertJoin", account);
		
	}

}
