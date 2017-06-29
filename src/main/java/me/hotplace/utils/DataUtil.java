package me.hotplace.utils;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class DataUtil {

	public static <T> String convertListToString(List<T> list, char deli) {
		StringBuilder sb;
		if(list == null || list.size() == 0) return "";
		
		sb = new StringBuilder();
		
		for(T token : list) {
			if(token instanceof String) {
				sb.append(token);
				sb.append(deli);
			}
		}
		
		return sb.toString();
	}
	
	public static String makeLatLng(List<String> list, String deli) {
		StringBuilder sb;
		if(list == null || list.size() == 0) return "";
		
		sb = new StringBuilder();
		sb.append("[");
		
		for(String token : list) {
			String[] s = StringUtils.splitByWholeSeparator(token, deli);
			sb.append("[");
			sb.append(s[0]);
			sb.append(",");
			sb.append(s[1]);
			sb.append("]");
			sb.append(",");
		}
		
		sb.deleteCharAt(sb.length()-1);
		sb.append("]");
		return sb.toString();
		
	}
}
