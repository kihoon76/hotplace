package me.hotplace.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("Maemul")
public class Maemul {

	private int maemulBeonho;
	private String accountId;
	private String pnu;
	private String addressJibeon;
	private String description;
	private String regDate;
	private String phone;
	private String register;
	private float lng;
	private float lat;
	private List<FileBucket> files;
	
	public int getMaemulBeonho() {
		return maemulBeonho;
	}

	public void setMaemulBeonho(int maemulBeonho) {
		this.maemulBeonho = maemulBeonho;
	}

	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	public String getPnu() {
		return pnu;
	}

	public void setPnu(String pnu) {
		this.pnu = pnu;
	}

	public String getAddressJibeon() {
		return addressJibeon;
	}

	public void setAddressJibeon(String addressJibeon) {
		this.addressJibeon = addressJibeon;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getRegDate() {
		return regDate;
	}

	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getRegister() {
		return register;
	}

	public void setRegister(String register) {
		this.register = register;
	}

	public float getLng() {
		return lng;
	}

	public void setLng(float lng) {
		this.lng = lng;
	}

	public float getLat() {
		return lat;
	}

	public void setLat(float lat) {
		this.lat = lat;
	}

	public List<FileBucket> getFiles() {
		return files;
	}

	public void setFiles(List<FileBucket> files) {
		this.files = files;
	}
}
