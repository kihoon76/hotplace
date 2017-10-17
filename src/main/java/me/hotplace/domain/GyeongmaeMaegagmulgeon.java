package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongmaeMaegagmulgeon")
public class GyeongmaeMaegagmulgeon {

	private String sageonbeonho;		//사건번호
	private String yongdo;				//용도
	private String sojaeji;				//소재지
	private String gamjeongpyeongga;	//감정평가액
	private String maegagmonth;			//매각월
	private String maegagdaegeum;		//매각대금
	
	public String getSageonbeonho() {
		return sageonbeonho;
	}
	public void setSageonbeonho(String sageonbeonho) {
		this.sageonbeonho = sageonbeonho;
	}
	public String getYongdo() {
		return yongdo;
	}
	public void setYongdo(String yongdo) {
		this.yongdo = yongdo;
	}
	public String getSojaeji() {
		return sojaeji;
	}
	public void setSojaeji(String sojaeji) {
		this.sojaeji = sojaeji;
	}
	public String getGamjeongpyeongga() {
		return gamjeongpyeongga;
	}
	public void setGamjeongpyeongga(String gamjeongpyeongga) {
		this.gamjeongpyeongga = gamjeongpyeongga;
	}
	public String getMaegagmonth() {
		return maegagmonth;
	}
	public void setMaegagmonth(String maegagmonth) {
		this.maegagmonth = maegagmonth;
	}
	public String getMaegagdaegeum() {
		return maegagdaegeum;
	}
	public void setMaegagdaegeum(String maegagdaegeum) {
		this.maegagdaegeum = maegagdaegeum;
	}
}
