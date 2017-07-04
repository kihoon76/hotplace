import java.sql.*;
import java.util.*;

public class Db {
    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://aws.mysql/aws";

    private static final String USER_NAME = "hoon";
	private static final String PASSWORD = "john316!";

    private static Connection conn;
    public static void connect() throws Exception {
              
        Class.forName(JDBC_DRIVER);
        conn = DriverManager.getConnection(DB_URL,USER_NAME,PASSWORD);
        System.out.println("-------------------------------------------");
        System.out.println("DB Connected");
        System.out.println("-------------------------------------------");

        
    }

    public static Map getSample() throws Exception {
        String sql = "select kname, ename from SAMPLE";
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        Map<String, String> map = new HashMap<String, String>();

        rs = stmt.executeQuery(sql);

        while(rs.next()) {
            System.out.print(" kname : " + rs.getString("kname"));
            System.out.print(" ename : " + rs.getString("ename"));
            System.out.println();

            map.put(rs.getString("ename"), rs.getString("kname"));
        }

        rs.close();
        stmt.close();

        return map;
    }

    public static void close() throws Exception {
        if(conn != null) {
            conn.close();
            System.out.println("-------------------------------------------");
            System.out.println("DB Closed");
            System.out.println("-------------------------------------------");
        }
    }
}