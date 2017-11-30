package me.hotplace.utils;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class DataUtil {
	
	private static String AJAX_FORMATS = "{\"success\":%b, \"err\":\"%s\", \"datas\":%s}";

	private static abstract class Make {
		abstract void run(List<String> list, StringBuilder sb, String deli);
		
		String build(List<String> list, String deli) {
			if(list == null || list.size() == 0) return "[]";
			StringBuilder sb = new StringBuilder();
			sb.append("[");
			run(list, sb, deli);
			sb.deleteCharAt(sb.length()-1);
			sb.append("]");
			return sb.toString();
		}
	}
	
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
		 Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("[");
					sb.append(s[0]);
					sb.append(",");
					sb.append(s[1]);
					sb.append("]");
					sb.append(",");
				}
			}
		};
		
		return m.build(list, deli);
	}
	
	/*
	 * 129.19678142091|129.19903093874|35.94412733348|35.94547893685|[{type:0, value:645, colorV:1}] row
	 * */
	public static String makeLatLngWeight(List<String> list, String deli) {
		
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"weight\":");
					sb.append(s[4]);
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[0]);
					sb.append(",");
					sb.append(s[1]);
					sb.append(",");
					sb.append(s[2]);
					sb.append(",");
					sb.append(s[3]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}
	
	public static String makeLatLngGyeongmaeMarker(List<String> list, String deli) {
		
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"info\":{\"pnu\":\"" + s[0] + "\", \"unu\":\"" + s[1] + "\", \"rnu\":\"" + s[2] + "\"}");
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[3]);
					sb.append(",");
					sb.append(s[4]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}
	
	public static String makeLatLngGongmaeMarker(List<String> list, String deli) {
		
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"info\":{\"pnu\":\"" + s[0] + "\", \"unu\":\"" + s[1] + "\", \"mnu\":\"" + s[2] + "\"}");
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[3]);
					sb.append(",");
					sb.append(s[4]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}
	
	public static String makeAddress(List<String> list) {
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("[");
					sb.append(token);
					sb.append("]");
					sb.append(",");
				}
			}
		};
		
		return m.build(list, null);
	}
	
	public static byte[] hexStringToByteArray(String s) {
		 byte[] b = new byte[s.length() / 2];
		 for (int i = 0; i < b.length; i++) {
			int index = i * 2;
	 		int v = Integer.parseInt(s.substring(index, index + 2), 16);
	 		b[i] = (byte) v;
		 }
	    
		 return b;
	}
	
	public static String getAjaxFormats() {
		return AJAX_FORMATS;
	}

	public static String makeLatLngBosangPyeonibMarker(List<String> list, String deli) {
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"info\":{\"pnu\":\"" + s[0] + "\",");
					sb.append( "\"unu\":\"" + s[1] + "\",");
					sb.append( "\"radius\":\"" + s[4] + "\",");
					sb.append( "\"xg\":\"" + s[5] + "\",");
					sb.append( "\"xgo\":\"" + s[6] + "\",");
					sb.append( "\"xgc\":\"" + s[7] + "\",");
					sb.append( "\"gunu\":\"" + s[8] + "\"}");
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[2]);
					sb.append(",");
					sb.append(s[3]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}
	
	public static String makeLatLngBosangPyeonibMarkerNoGroup(List<String> list, String deli) {
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"info\":{\"pnu\":\"" + s[0] + "\",");
					sb.append( "\"unu\":\"" + s[1] + "\"}");
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[2]);
					sb.append(",");
					sb.append(s[3]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}

	public static String makeLatLngSilgeolaeMarker(List<String> list, String deli) {
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"info\":{");
					sb.append("\"pnu\":\"" + s[0] + "\",");
					sb.append("\"gyeyagnyeonwol\":\"" + s[3]+ "\",");
					sb.append("\"gyeyagil\":\"" + s[4] + "\",");
					sb.append("\"gyeyagarea\":\"" + s[5] + "\",");
					sb.append("\"geolaegeumaeg\":\"" + s[6] + "\",");
					sb.append("\"yongdo\":\"" + s[8] + "\",");
					sb.append("\"jimok\":\"" + s[9] + "\"");
					sb.append("}");
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[1]);
					sb.append(",");
					sb.append(s[2]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}

	public static String makeLatLngAcceptBuildingMarker(List<String> list, String deli) {
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"info\":{");
					sb.append("\"pnu\":\"" + s[0] + "\",");
					sb.append( "\"unu\":\"" + s[1] + "\"");
					sb.append("}");
					sb.append(",");
					sb.append("\"location\":[");
					sb.append(s[2]);
					sb.append(",");
					sb.append(s[3]);
					sb.append("]},");
				}
			}
		};
		
		return m.build(list, deli);
	}

	public static String makeLatLngBosangPyeonibGroupList(List<String> list, String deli) {
		Make m = new Make() {
			
			@Override
			void run(List<String> list, StringBuilder sb, String deli) {
				// TODO Auto-generated method stub
				for(String token : list) {
					String[] s = StringUtils.splitByWholeSeparator(token, deli);
					sb.append("{\"unu\":\"" + s[0] + "\",\"addr\":\"" + s[1] + "\"},");
				}
			}
		};
		
		return m.build(list, deli);
	}
	
	public static String makeReturn(String data, boolean result) {
		return String.format(AJAX_FORMATS, result, "", data);
	}
	
	public static String getMssqlEscape(String str) {
		if(StringUtils.isEmpty(str)) return str;
			
		return str.replaceAll("%", "\\%");
	}
	
}
