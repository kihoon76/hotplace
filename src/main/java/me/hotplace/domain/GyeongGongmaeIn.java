package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongGongmaeIn")
public class GyeongGongmaeIn {

	private String[] jiyeog;

	public String[] getJiyeog() {
		return jiyeog;
	}

	public void setJiyeog(String[] jiyeog) {
		this.jiyeog = jiyeog;
	} 
}
