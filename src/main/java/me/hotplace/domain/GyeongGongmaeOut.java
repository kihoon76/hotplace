package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongGongmaeOut")
public class GyeongGongmaeOut {

	private String gubun;
	private String type;
	private String address;
	private String pnu;
	private String unu;
	private float lat;
	private float lng;
	
	public String getGubun() {
		return gubun;
	}
	public void setGubun(String gubun) {
		this.gubun = gubun;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public float getLat() {
		return lat;
	}
	public void setLat(float lat) {
		this.lat = lat;
	}
	public float getLng() {
		return lng;
	}
	public void setLng(float lng) {
		this.lng = lng;
	}
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getUnu() {
		return unu;
	}
	public void setUnu(String unu) {
		this.unu = unu;
	}
}
