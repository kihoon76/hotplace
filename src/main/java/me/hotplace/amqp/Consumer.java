package me.hotplace.amqp;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import me.hotplace.domain.LogVO;

@Component
public class Consumer {
	
private final static String namespace = "mappers.mssql.logMapper";
	
	@Resource(name = "msSqlSession")
	private SqlSession msSqlSession;
	private Gson gson = new Gson();
	

	public void handleMessage(Object message) {
		
		LogVO log = gson.fromJson((String)message, LogVO.class);
		msSqlSession.insert(namespace + ".insertLog", log);
		
	}
}
