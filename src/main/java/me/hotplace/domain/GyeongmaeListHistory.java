package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongmaeListHistory")
public class GyeongmaeListHistory {

	private String listnum;			//목록번호
	private String listgubun;		//목록구분
	private String detailhistory;	//상세내역
	
	public String getListnum() {
		return listnum;
	}
	public void setListnum(String listnum) {
		this.listnum = listnum;
	}
	public String getListgubun() {
		return listgubun;
	}
	public void setListgubun(String listgubun) {
		this.listgubun = listgubun;
	}
	public String getDetailhistory() {
		return detailhistory;
	}
	public void setDetailhistory(String detailhistory) {
		this.detailhistory = detailhistory;
	}
	
	
}
