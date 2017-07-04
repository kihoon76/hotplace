실행방법(Visual Studio Code 기준)

1. cmd => set CLASSPATH=E:\source\lib\mysql-connector-java-5.1.42-bin.jar;E:\source\lib\poi-ooxml-3.16.jar;E:\source\lib\poi-3.16.jar;E:\source\lib\commons-collections4-4.1.jar;E:\source\lib\xmlbeans-2.6.0.jar;E:\source\lib\poi-ooxml-schemas-3.16.jar;.
   (창을 다시열면 다시 set 해줘야함, 아니면 환경변수에 CLASSPATH 설정)
   (다운로드 받은 위치로 설정 E:\가 아니라 본인위치로)

2. MYSQL => sqlgate for mysql 사용시 암호밑에 유니코드 사용 체크(안되있으면 한글입력안됨)

3. Db.java 파일에 본인 Db 계정으로 수정

4. javac Db.java

5. javac ExcelVO.java

6. javac Excel.java -encoding utf-8

7. javac ExcelParser.java

8. java ExcelParser E:\source\sample.xlsx E:\source\result.xlsx