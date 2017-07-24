package me.hotplace.types;

import java.util.EnumSet;

public enum MapTypes {

	HEAT_MAP("heatmap"), DOT_MAP("dotmap"), CELL_MAP("cellmap");
	
	private String type;
	
	MapTypes(String type) {
		this.type = type;
	}
	
	public String getType() {
		return type;
	}
	
	public static MapTypes getMapTypes(String type) {
		for(MapTypes m : EnumSet.allOf(MapTypes.class)) {
			if(m.getType().equals(type)) {
				return m;
			}
		}
		
		throw new IllegalArgumentException("타입오류 : " + type);
	}
	
	
}
