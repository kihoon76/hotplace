import java.util.*;

public class ExcelParser {
    public static void main(String[] args) {
       try {
             /*Db.connect();
             Map m = Db.getSample();
             System.out.println("Map Result");
             System.out.println(m.get("KOREA"));
             Db.close();

             Excel xlsx = new Excel();
             xlsx.xlsxToExcelVOList(args[0]);*/
             Excel xlsx = new Excel(args[0], args[1]);
             xlsx.work();
        }
        // catch(ClassNotFoundException e) {
        //     System.err.println("ClassNotFoundException : " + e.getMessage());
        // }
        catch(Exception e) {
           System.err.println(e.getMessage()); 
        }
       
    }
}