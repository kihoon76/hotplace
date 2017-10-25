package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("Gongmae")
public class Gongmae {

	private String pnu;							//PNU 코드
	private String goyubeonho;					//고유번호
	private String mulgeonCode;					//물건코드
	private String mulgeonAddress;				//물건주소지
	private String yongdo;						//용도
	private String jimok;						//지목
	private String areaGubun;					//면적구분
	private String mulgeonStatus;				//물건상태
	private String yuchal;						//유찰횟수
	
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getMulgeonAddress() {
		return mulgeonAddress;
	}
	public void setMulgeonAddress(String mulgeonAddress) {
		this.mulgeonAddress = mulgeonAddress;
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
	public String getAreaGubun() {
		return areaGubun;
	}
	public void setAreaGubun(String areaGubun) {
		this.areaGubun = areaGubun;
	}
	public String getMulgeonStatus() {
		return mulgeonStatus;
	}
	public void setMulgeonStatus(String mulgeonStatus) {
		this.mulgeonStatus = mulgeonStatus;
	}
	public String getYuchal() {
		return yuchal;
	}
	public void setYuchal(String yuchal) {
		this.yuchal = yuchal;
	}
	public String getGoyubeonho() {
		return goyubeonho;
	}
	public void setGoyubeonho(String goyubeonho) {
		this.goyubeonho = goyubeonho;
	}
	public String getMulgeonCode() {
		return mulgeonCode;
	}
	public void setMulgeonCode(String mulgeonCode) {
		this.mulgeonCode = mulgeonCode;
	}
}
