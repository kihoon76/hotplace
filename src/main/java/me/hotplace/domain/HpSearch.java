package me.hotplace.domain;

public class HpSearch {

	private MinMax rq;		/*RQ(종합부동산 투자지수)*/
	private MinMax cpgr;	/*건축허가면적 증가율(Construction Permit Growth Rate)*/
	private MinMax bpgr;	/*개발행위 허가면적 증가율(Betterment Permit Growth Rate)*/
	private MinMax rtWgr;	/*부동산실거래 면적 증가율(Real estate Transactions Width Growth Rate)*/
	private MinMax rtPgr;	/*부동산실거래 가격 증가율(Real estate Transactions Price Growth Rate)*/
	private MinMax fpgr; 	/*유동인구 증가율(Floating Population Growth Rate)*/
	private MinMax dpgr;	/*개발사업 면적 증가율(Development Project Growth Rate)*/
	private MinMax tigr;	/*기반시설편입 필지수 증가율(Tranfer to Infra Growth Rate)*/
	private MinMax blgr; 	/*영업허가 면적 증가율(Business License Growth Rate)*/
	
	public MinMax getRq() {
		return rq;
	}
	public void setRq(MinMax rq) {
		this.rq = rq;
	}
	public MinMax getCpgr() {
		return cpgr;
	}
	public void setCpgr(MinMax cpgr) {
		this.cpgr = cpgr;
	}
	public MinMax getBpgr() {
		return bpgr;
	}
	public void setBpgr(MinMax bpgr) {
		this.bpgr = bpgr;
	}
	public MinMax getRtWgr() {
		return rtWgr;
	}
	public void setRtWgr(MinMax rtWgr) {
		this.rtWgr = rtWgr;
	}
	public MinMax getRtPgr() {
		return rtPgr;
	}
	public void setRtPgr(MinMax rtPgr) {
		this.rtPgr = rtPgr;
	}
	public MinMax getFpgr() {
		return fpgr;
	}
	public void setFpgr(MinMax fpgr) {
		this.fpgr = fpgr;
	}
	public MinMax getDpgr() {
		return dpgr;
	}
	public void setDpgr(MinMax dpgr) {
		this.dpgr = dpgr;
	}
	public MinMax getTigr() {
		return tigr;
	}
	public void setTigr(MinMax tigr) {
		this.tigr = tigr;
	}
	public MinMax getBlgr() {
		return blgr;
	}
	public void setBlgr(MinMax blgr) {
		this.blgr = blgr;
	}
	
	
}
