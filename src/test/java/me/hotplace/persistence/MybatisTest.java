package me.hotplace.persistence;

import java.util.List;

import javax.annotation.Resource;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.gson.Gson;

import me.hotplace.dao.HotplaceDao;
import me.hotplace.dao.SampleDao;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={
	"file:src/main/webapp/WEB-INF/spring/ds-context.xml",
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	//"file:src/test/resources/servletTest-context.xml"
})
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MybatisTest {

	@Resource(name="sampleDao")
	SampleDao dao;
	
	@Resource(name = "hotplaceDao")
	HotplaceDao hotplaceDao;
	
	//@Test
	public void test01_selectSample() {
		List<String> r = dao.selectSample("11");
		Gson gson = new Gson();
		System.out.println(gson.toJson(r));
	}
	
	@Test
	public void test01_selectGuGun() {
		List<String> r = hotplaceDao.selectListGuGun("11");
		Gson gson = new Gson();
		System.out.println(gson.toJson(r));
	}
	
}
