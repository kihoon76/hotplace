package me.hotplace.dao;

import me.hotplace.domain.Account;

public interface UserDao {

	public Account getAccount(String id);

	public int selectIdCount(String id);

	public void insertJoin(Account account);
}
