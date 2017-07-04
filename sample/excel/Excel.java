import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.ss.usermodel.CellType;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;

//http://javaslave.tistory.com/78
public class Excel {
    
    private String filePath;
    private String fileOutPath;

    public Excel(String filePath, String fileOutPath) {
        this.filePath = filePath;
        this.fileOutPath = fileOutPath;
    }


    private List<ExcelVO> readXlsx() {
        List<ExcelVO> list = new ArrayList<ExcelVO>();

        FileInputStream fis = null;
        XSSFWorkbook workbook = null;

        try {
            fis = new FileInputStream(filePath);

            workbook = new XSSFWorkbook(fis);
            XSSFSheet curSheet;
            XSSFRow curRow;
            XSSFCell curCell;

            ExcelVO vo;

            for(int sheetIdx = 0; sheetIdx < workbook.getNumberOfSheets(); sheetIdx++) {
                curSheet = workbook.getSheetAt(sheetIdx);

                for(int rowIdx = 0; rowIdx < curSheet.getPhysicalNumberOfRows(); rowIdx++) {

                    //row 0은 헤더정보이기 때문에 무시
                    if(rowIdx !=0) {
                       curRow = curSheet.getRow(rowIdx);
                       vo = new ExcelVO();
                       String value;
                      
                       //row의 첫번째 cell 값이 비어있지 않는 경우만 cell 탐색
                       if(!"".equals(curRow.getCell(0).getStringCellValue())) {

                           //cell 탐색 for문
                            for(int cellIdx = 0; cellIdx < curRow.getPhysicalNumberOfCells(); cellIdx++) {
                                curCell = curRow.getCell(cellIdx);
                            
                                value = "";
                              
                                switch(curCell.getCellTypeEnum()) {
                                case FORMULA :
                                	value = curCell.getCellFormula();
                                	break;
                                case NUMERIC :
                                	value = curCell.getNumericCellValue() + "";
                                	break;
                                case STRING :
                                	value = curCell.getStringCellValue();
                                	break;
                                case BOOLEAN :
                                	value = curCell.getBooleanCellValue() + "";
                                	break;
                                case ERROR :
                                	value = curCell.getErrorCellValue() + "";
                                	break;
                                default :
                                	value = "";
                                	break;
                                }

                                switch(cellIdx) {
                                case 0 : //name
                                    vo.setName(value);
                                    break;
                                default :
                                    break;
                                }
                                
                                System.out.println("value=========="+value);
                           }

                           list.add(vo);
                       }

                    }
                } 
            }
        }
        catch(FileNotFoundException e) {
            System.err.println("FileNotFoundException : " + e.getMessage());
        }
        catch(IOException e) {
            System.err.println("IOException : " + e.getMessage());
        } 
        finally {
            try {
                if(workbook != null) workbook.close();
                if(fis != null) fis.close();
            }
            catch(IOException e) {
                System.err.println(e.getMessage());
            }
        }

        return list;
    }

    private void writeXlsx(List<ExcelVO> list, Map dbMap) {
        XSSFWorkbook workbook = null;
        FileOutputStream fos = null;
        XSSFSheet sheet = null;

        try {
            workbook = new XSSFWorkbook();
            sheet = workbook.createSheet("result");

            int rowCount = list.size();

            for(int r = 0; r < rowCount; r++) {
                XSSFRow row = sheet.createRow(r);
                //XSSFCell curCell;
                String kname = (String)dbMap.get(list.get(r).getName());
                int cellNum = 0;

                XSSFCell cell = row.createCell(cellNum);
                cell.setCellValue(kname);
            }

            fos = new FileOutputStream(fileOutPath);
            workbook.write(fos);
        }
        catch (FileNotFoundException e) {
            System.err.println("FileNotFoundException : " + e.getMessage());
        }
        catch (IOException e) {
            System.err.println("IOException : " + e.getMessage());
        } 
        catch (Exception e) {
            System.err.println("Exception : " + e.getMessage()); 
        }
        finally {
            try {
                if(fos != null) fos.close();
            }
            catch(IOException e) {
                System.err.println(e.getMessage());
            }
        }
    }

    private Map getDbData() {
        Map result = null;

        try {
            Db.connect();
            result = Db.getSample();
            Db.close();
        }
        catch(ClassNotFoundException e) {
            System.err.println("ClassNotFoundException : " + e.getMessage());
        }
        catch (Exception e) {
            System.err.println("Db Error : " + e.getMessage());
        }

        return result;
    }

    public void work() {
       List<ExcelVO> list = readXlsx(); 
       writeXlsx(list, getDbData());
    }
}