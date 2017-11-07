package me.hotplace.domain;

import java.util.ArrayList;
import java.util.List;

public class AjaxVO<T> {

	private boolean success;
	private String errCode;
	private String errMsg;
	private List<T> datas;
	
	public AjaxVO() {
		datas = new ArrayList<T>();
	}
	
	public boolean isSuccess() {
		return success;
	}
	public void setErrCode(String errCode) {
		this.errCode = errCode;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getErrMsg() {
		return errMsg;
	}
	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}
	
	public void addObject(T t) {
		datas.add(t);
	}
}
