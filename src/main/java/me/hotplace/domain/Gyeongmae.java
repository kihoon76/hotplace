package me.hotplace.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("Gyeongmae")
public class Gyeongmae {

	private String goyubeonho;									//고유번호
	private String pnu;											//PNU 코드
	private String sageonbeonho;								//사건번호
	private String damdang;										//담당
	private String deunglogbeonho;								//등록번호
	private String sojaeji;										//소재지
	private String yongdo;										//용도
	private String gamjeongpyeongga;							//감정평가액
	private String minmaegaggagyeog;							//최저매각가격
	private String yuchal;										//유찰회수
	private String ibchalbangbeob;								//입찰방법
	private String bigo;										//비고
	private String maegaggiil;									//매각기일
	private String baedangyogu;									//배당요구종기일
	private String cheonggu;									//청구금액
	private String sageonjeobsuil;								//사건접수일
	private String imgThumb;									//대표이미지
	private String imgThumbExt;									//대표이미지 확장자
	private List<GyeongmaeImage> images;						//이미지들
	private List<GyongmaeGiilHistory> giils; 					//기일내역
	private List<GyeongmaeListHistory> lists;					//목록내역
	private List<GyeongmaeMaegagtonggye> tonggyes;				//인근매각통계 
	private List<GyeongmaeMaegagmulgeon> maegagmulgeons;		//인근매각물건
	private List<GyeongaeJinhaengmulgeon> jinhaengmulgeons;		//인근진행물건
	
	public String getSageonjeobsuil() {
		return sageonjeobsuil;
	}
	public List<GyongmaeGiilHistory> getGiils() {
		return giils;
	}
	public void setGiils(List<GyongmaeGiilHistory> giils) {
		this.giils = giils;
	}
	public void setSageonjeobsuil(String sageonjeobsuil) {
		this.sageonjeobsuil = sageonjeobsuil;
	}
	public List<GyeongmaeImage> getImages() {
		return images;
	}
	public void setImages(List<GyeongmaeImage> images) {
		this.images = images;
	}
	public String getImgThumbExt() {
		return imgThumbExt;
	}
	public void setImgThumbExt(String imgThumbExt) {
		this.imgThumbExt = imgThumbExt;
	}
	public String getGoyubeonho() {
		return goyubeonho;
	}
	public List<GyeongmaeMaegagtonggye> getTonggyes() {
		return tonggyes;
	}
	public void setTonggyes(List<GyeongmaeMaegagtonggye> tonggyes) {
		this.tonggyes = tonggyes;
	}
	public String getImgThumb() {
		return imgThumb;
	}
	public void setImgThumb(String imgThumb) {
		this.imgThumb = imgThumb;
	}
	public void setGoyubeonho(String goyubeonho) {
		this.goyubeonho = goyubeonho;
	}
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getDeunglogbeonho() {
		return deunglogbeonho;
	}
	public void setDeunglogbeonho(String deunglogbeonho) {
		this.deunglogbeonho = deunglogbeonho;
	}
	public String getSojaeji() {
		return sojaeji;
	}
	public void setSojaeji(String sojaeji) {
		this.sojaeji = sojaeji;
	}
	public String getYongdo() {
		return yongdo;
	}
	public void setYongdo(String yongdo) {
		this.yongdo = yongdo;
	}
	public String getGamjeongpyeongga() {
		return gamjeongpyeongga;
	}
	public void setGamjeongpyeongga(String gamjeongpyeongga) {
		this.gamjeongpyeongga = gamjeongpyeongga;
	}
	public String getYuchal() {
		return yuchal;
	}
	public void setYuchal(String yuchal) {
		this.yuchal = yuchal;
	}
	public String getMaegaggiil() {
		return maegaggiil;
	}
	public void setMaegaggiil(String maegaggiil) {
		this.maegaggiil = maegaggiil;
	}
	public String getSageonbeonho() {
		return sageonbeonho;
	}
	public void setSageonbeonho(String sageonbeonho) {
		this.sageonbeonho = sageonbeonho;
	}
	public String getDamdang() {
		return damdang;
	}
	public void setDamdang(String damdang) {
		this.damdang = damdang;
	}
	public String getIbchalbangbeob() {
		return ibchalbangbeob;
	}
	public void setIbchalbangbeob(String ibchalbangbeob) {
		this.ibchalbangbeob = ibchalbangbeob;
	}
	public String getMinmaegaggagyeog() {
		return minmaegaggagyeog;
	}
	public void setMinmaegaggagyeog(String minmaegaggagyeog) {
		this.minmaegaggagyeog = minmaegaggagyeog;
	}
	public String getBaedangyogu() {
		return baedangyogu;
	}
	public void setBaedangyogu(String baedangyogu) {
		this.baedangyogu = baedangyogu;
	}
	public String getCheonggu() {
		return cheonggu;
	}
	public void setCheonggu(String cheonggu) {
		this.cheonggu = cheonggu;
	}
	public List<GyeongmaeListHistory> getLists() {
		return lists;
	}
	public void setLists(List<GyeongmaeListHistory> lists) {
		this.lists = lists;
	}
	public String getBigo() {
		return bigo;
	}
	public void setBigo(String bigo) {
		this.bigo = bigo;
	}
	
	public List<GyeongmaeMaegagmulgeon> getMaegagmulgeons() {
		return maegagmulgeons;
	}
	public void setMaegagmulgeons(List<GyeongmaeMaegagmulgeon> maegagmulgeons) {
		this.maegagmulgeons = maegagmulgeons;
	}
	public List<GyeongaeJinhaengmulgeon> getJinhaengmulgeons() {
		return jinhaengmulgeons;
	}
	public void setJinhaengmulgeons(List<GyeongaeJinhaengmulgeon> jinhaengmulgeons) {
		this.jinhaengmulgeons = jinhaengmulgeons;
	}
}
