package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("Silgeolae")
public class Silgeolae {

	private String pnu;				//pnu코드
	private String gyeyagnyeonwol;	//계약년월
	private String gyeyagil;		//계약일
	private String gyeyagarea;		//계약면적
	private String geolaegeumaeg;	//거래금액
	private String yongdo;			//용도
	private String jimok;			//지목
	
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getGyeyagnyeonwol() {
		return gyeyagnyeonwol;
	}
	public void setGyeyagnyeonwol(String gyeyagnyeonwol) {
		this.gyeyagnyeonwol = gyeyagnyeonwol;
	}
	public String getGyeyagil() {
		return gyeyagil;
	}
	public void setGyeyagil(String gyeyagil) {
		this.gyeyagil = gyeyagil;
	}
	public String getGyeyagarea() {
		return gyeyagarea;
	}
	public void setGyeyagarea(String gyeyagarea) {
		this.gyeyagarea = gyeyagarea;
	}
	public String getGeolaegeumaeg() {
		return geolaegeumaeg;
	}
	public void setGeolaegeumaeg(String geolaegeumaeg) {
		this.geolaegeumaeg = geolaegeumaeg;
	}
	public String getYongdo() {
		return yongdo;
	}
	public void setYongdo(String yongdo) {
		this.yongdo = yongdo;
	}
	public String getJimok() {
		return jimok;
	}
	public void setJimok(String jimok) {
		this.jimok = jimok;
	}
	
	
}
