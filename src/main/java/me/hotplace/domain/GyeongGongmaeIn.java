package me.hotplace.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("GyeongGongmaeIn")
public class GyeongGongmaeIn {

	private String[] jiyeog;
	private String[] jimok;
	private List<MinMax> gamjeongga;
	private List<MinMax> minIbchalga;
	

	public String[] getJiyeog() {
		return jiyeog;
	}

	public void setJiyeog(String[] jiyeog) {
		this.jiyeog = jiyeog;
	}

	public String[] getJimok() {
		return jimok;
	}

	public void setJimok(String[] jimok) {
		this.jimok = jimok;
	}

	public List<MinMax> getGamjeongga() {
		return gamjeongga;
	}

	public void setGamjeongga(List<MinMax> gamjeongga) {
		this.gamjeongga = gamjeongga;
	}

	public List<MinMax> getMinIbchalga() {
		return minIbchalga;
	}

	public void setMinIbchalga(List<MinMax> minIbchalga) {
		this.minIbchalga = minIbchalga;
	} 
}
