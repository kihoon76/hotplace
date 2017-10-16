package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("GyeongmaeImage")
public class GyeongmaeImage {

	private String gubun;  		//이미지 타입(전경도, 지적도, 위치도, 관련사진)
	private String name;		//이미지명
	private String ext;			//이미지 확장자
	private String image;		//이미지
	
	public String getGubun() {
		return gubun;
	}
	public void setGubun(String gubun) {
		this.gubun = gubun;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getExt() {
		return ext;
	}
	public void setExt(String ext) {
		this.ext = ext;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
}
