package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("Address")
public class Address {

	private String type;	//R:도로명 주소, N:지번주소
	private String si;		//시도코드
	private String gugun;	//시군구 코드 
	private String region;	//읍명동 코드
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSi() {
		return si;
	}
	public void setSi(String si) {
		this.si = si;
	}
	public String getGugun() {
		return gugun;
	}
	public void setGugun(String gugun) {
		this.gugun = gugun;
	}
	public String getRegion() {
		return region;
	}
	public void setRegion(String region) {
		this.region = region;
	}
	
	@Override
	public String toString() {
		
		return "[type:" + type + ",si: " + si + ",gugun: " + gugun + ", region: " + region + "]";
	}
	
	
}
