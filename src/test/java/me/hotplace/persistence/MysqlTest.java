package me.hotplace.persistence;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.junit.Test;

public class MysqlTest {

	@Test
	public void test01_connectionTest() throws ClassNotFoundException, SQLException {
		Class.forName("com.mysql.jdbc.Driver");
		Connection conn = DriverManager.getConnection("jdbc:mysql://aws.mysql:3306/innodb?useSSL=false&amp;serverTimeZone=UTC",
													  "hoon",
													  "new1234!");
		
		assertThat(conn, is(notNullValue()));
		
		if(conn != null) {
			conn.close();
		}
	}
}
