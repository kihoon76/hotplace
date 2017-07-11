#! /bin/bash
mvn install:install-file -DgroupId=com.microsoft.sqlserver -DartifactId=sqljdbc4 -Dversion=4.0 -Dpackaging=jar -Dfile=sqljdbc4-4.0.jar
#mvn install:install-file -DgroupId=com.oracle -DartifactId=mysql-connector -Dversion=5.1.40 -Dpackaging=jar -Dfile=mysql-connector-java-5.1.40-bin.jar 