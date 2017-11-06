package me.hotplace.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("Account")
public class Account {

	private String id;
	private String userName;
	private String password;
	private String phone;
	private String email;
	
	private List<Authority> authorities;
	
	public List<Authority> getAuthorities() {
		return authorities;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public void setAuthorities(List<Authority> authorities) {
		this.authorities = authorities;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
}
