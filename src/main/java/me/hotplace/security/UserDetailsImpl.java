package me.hotplace.security;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import me.hotplace.domain.Account;
import me.hotplace.domain.Authority;

public class UserDetailsImpl implements UserDetails {

	private Account account;
	
	public UserDetailsImpl(Account account) {
		
		this.account = account;
		
	}
	
	@Override
	public String getPassword() {
		return account.getPassword();
	}

	@Override
	public String getUsername() {
		return account.getId();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public Account getAccount() {
		return account;
	}

	@Override
	public List<Authority> getAuthorities() {
		// TODO Auto-generated method stub
		return account.getAuthorities();
	}
}
