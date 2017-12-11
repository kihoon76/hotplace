package me.hotplace.dao;

import java.util.List;

import me.hotplace.domain.GyeongGongmaeIn;
import me.hotplace.domain.GyeongGongmaeOut;

public interface SearchDao {

	List<GyeongGongmaeOut> selectGyeongGongList(GyeongGongmaeIn gyeongGongIn);

}
