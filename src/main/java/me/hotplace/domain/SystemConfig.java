package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("SystemConfig")
public class SystemConfig {

	private String num;
	private String name;
	private String value;
	private String bigo;
	
	public String getNum() {
		return num;
	}
	public void setNum(String num) {
		this.num = num;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getBigo() {
		return bigo;
	}
	public void setBigo(String bigo) {
		this.bigo = bigo;
	}
}
