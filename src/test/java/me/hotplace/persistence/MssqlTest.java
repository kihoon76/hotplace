package me.hotplace.persistence;

import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.Test;

public class MssqlTest {

	@Test
	public void test01_connectionTest() throws ClassNotFoundException, SQLException {
		Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		//Connection conn = DriverManager.getConnection("jdbc:sqlserver://JNNASUS\\MSSQL2014;user=sa;password=1111");
		Connection conn = DriverManager.getConnection("jdbc:sqlserver://JNNASUS;instanceName=MSSQL2014;user=sa;password=1111");
		
		assertThat(conn, is(notNullValue()));
		
		if(conn != null) {
			conn.close();
		}
	}
	
	//@Test
	public void test02_queryTest() throws ClassNotFoundException, SQLException {
		Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		Connection conn = DriverManager.getConnection("jdbc:sqlserver://JNNASUS;instanceName=MSSQL2014;user=sa;password=1111");
		
		String sql = "select top 10 b.위도, b.경도, round(rand(convert(varbinary, newid()))*100, 2) [랜덤점수] ";
		  sql += "from [표준공시지가].[dbo].[20170109표준지공시지가] a ";
		  sql += "inner join [지번주소].[dbo].[전국지번통합] b on (b.PNU=a.PNU1) ";
          sql += "where (a.PNU1 like '11%' or a.PNU1 like '42%') and 위도 is not null";
		
		PreparedStatement pstmt = conn.prepareStatement(sql);  
		ResultSet rs = pstmt.executeQuery();
		
        while(rs.next()){
             System.out.println(rs.getString("랜덤점수")); //System.out.print(rs.getInt(1));
        }
         
        if(rs != null) {
	        try {
	        	 rs.close();
	        }
	        catch(SQLException e) {}
        }
       
        if(pstmt != null){ try{ pstmt.close(); }catch(SQLException e){} }
        if(conn != null){ try{ conn.close(); }catch(SQLException e){} }
	}
	
	
}
