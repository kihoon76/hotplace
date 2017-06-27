package me.hotplace.persistence;

import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.junit.Test;

public class MssqlTest {

	@Test
	public void test01_connectionTest() throws ClassNotFoundException, SQLException {
		Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		Connection conn = DriverManager.getConnection("jdbc:sqlserver://JNNASUS\\MSSQL2014;user=sa;password=1111");
		
		assertThat(conn, is(notNullValue()));
		
		if(conn != null) {
			conn.close();
		}
	}
}
