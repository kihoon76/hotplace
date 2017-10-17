package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongaeJinhaengmulgeon")
public class GyeongaeJinhaengmulgeon {

	private String sageonbeonho;				//사건번호
	private String numyongdo;					//물건번호용도
	private String sojaejinaeyeog;				//소재지 및 용도
	private String bigo;						//비고
	private String gamjeongpyeongga;			//감정평가액
	private String minmaegaggagyeog;			//최저매각가격
	private String damdangmaegaggiil;			//담당계매각기일
	private String status;						//진행상태
	
	public String getSageonbeonho() {
		return sageonbeonho;
	}
	public void setSageonbeonho(String sageonbeonho) {
		this.sageonbeonho = sageonbeonho;
	}
	public String getNumyongdo() {
		return numyongdo;
	}
	public void setNumyongdo(String numyongdo) {
		this.numyongdo = numyongdo;
	}
	public String getSojaejinaeyeog() {
		return sojaejinaeyeog;
	}
	public void setSojaejinaeyeog(String sojaejinaeyeog) {
		this.sojaejinaeyeog = sojaejinaeyeog;
	}
	public String getBigo() {
		return bigo;
	}
	public void setBigo(String bigo) {
		this.bigo = bigo;
	}
	public String getGamjeongpyeongga() {
		return gamjeongpyeongga;
	}
	public void setGamjeongpyeongga(String gamjeongpyeongga) {
		this.gamjeongpyeongga = gamjeongpyeongga;
	}
	public String getMinmaegaggagyeog() {
		return minmaegaggagyeog;
	}
	public void setMinmaegaggagyeog(String minmaegaggagyeog) {
		this.minmaegaggagyeog = minmaegaggagyeog;
	}
	public String getDamdangmaegaggiil() {
		return damdangmaegaggiil;
	}
	public void setDamdangmaegaggiil(String damdangmaegaggiil) {
		this.damdangmaegaggiil = damdangmaegaggiil;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
