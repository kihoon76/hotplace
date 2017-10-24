package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("Address")
public class Address {

	private String pnu;				//PNU 코드
	private String type;			//R:도로명 주소, N:지번주소
	private String si;				//시도코드
	private String gugun;			//시군구 코드 
	private String region;			//읍명동 코드
	private String san;     		//산 (2) 일반(1)
	private String detail;
	private String beonjiF;
	private String beonjiS;
	
	public String getBeonjiF() {
		return beonjiF;
	}
	public void setBeonjiF(String beonjiF) {
		this.beonjiF = beonjiF;
	}
	public String getBeonjiS() {
		return beonjiS;
	}
	public void setBeonjiS(String beonjiS) {
		this.beonjiS = beonjiS;
	}
	public String getSan() {
		return san;
	}
	public void setSan(String san) {
		this.san = san;
	}
	public String getDetail() {
		return detail;
	}
	public void setDetail(String detail) {
		this.detail = detail;
	}
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
	
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	@Override
	public String toString() {
		
		return "[type:" + type + ",si: " + si + ",gugun: " + gugun + ", region: " + region + "]";
	}
	
	
}
