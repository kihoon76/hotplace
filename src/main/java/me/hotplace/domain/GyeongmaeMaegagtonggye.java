package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongmaeMaegagtonggye")
public class GyeongmaeMaegagtonggye {

	private String gigan;			//기간
	private String maegaggeonsu;	//매각건수
	private String avggamjeongga;	//평균감정가
	private String avgmaegagga;		//평균매각가
	private String maegaggaratio;	//매각가율
	private String avgyuchal;		//평균유찰횟수
	
	public String getGigan() {
		return gigan;
	}
	public void setGigan(String gigan) {
		this.gigan = gigan;
	}
	public String getMaegaggeonsu() {
		return maegaggeonsu;
	}
	public void setMaegaggeonsu(String maegaggeonsu) {
		this.maegaggeonsu = maegaggeonsu;
	}
	public String getAvggamjeongga() {
		return avggamjeongga;
	}
	public void setAvggamjeongga(String avggamjeongga) {
		this.avggamjeongga = avggamjeongga;
	}
	public String getAvgmaegagga() {
		return avgmaegagga;
	}
	public void setAvgmaegagga(String avgmaegagga) {
		this.avgmaegagga = avgmaegagga;
	}
	public String getMaegaggaratio() {
		return maegaggaratio;
	}
	public void setMaegaggaratio(String maegaggaratio) {
		this.maegaggaratio = maegaggaratio;
	}
	public String getAvgyuchal() {
		return avgyuchal;
	}
	public void setAvgyuchal(String avgyuchal) {
		this.avgyuchal = avgyuchal;
	}
}
