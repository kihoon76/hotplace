package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("Notice")
public class Notice {

	private String num;					//글번호
	private String title;				//제목
	private String content;				//내용
	
	public String getNum() {
		return num;
	}
	public void setNum(String num) {
		this.num = num;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
