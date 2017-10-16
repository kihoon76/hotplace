package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyongmaeGiilHistory")
public class GyongmaeGiilHistory {

	private String goyubeonho;			//경매목록 고유번호
	private String giil;				//기일
	private String giiljonglyu;			//기일종류
	private String giiljangso;			//기일장소
	private String minmaegaggagyeog;	//최저매각가격
	private String giilresult;			//기일결과
	
	public String getGoyubeonho() {
		return goyubeonho;
	}
	public void setGoyubeonho(String goyubeonho) {
		this.goyubeonho = goyubeonho;
	}
	public String getGiil() {
		return giil;
	}
	public void setGiil(String giil) {
		this.giil = giil;
	}
	public String getGiiljonglyu() {
		return giiljonglyu;
	}
	public void setGiiljonglyu(String giiljonglyu) {
		this.giiljonglyu = giiljonglyu;
	}
	public String getGiiljangso() {
		return giiljangso;
	}
	public void setGiiljangso(String giiljangso) {
		this.giiljangso = giiljangso;
	}
	public String getMinmaegaggagyeog() {
		return minmaegaggagyeog;
	}
	public void setMinmaegaggagyeog(String minmaegaggagyeog) {
		this.minmaegaggagyeog = minmaegaggagyeog;
	}
	public String getGiilresult() {
		return giilresult;
	}
	public void setGiilresult(String giilresult) {
		this.giilresult = giilresult;
	}
}
