#! /bin/bash
if [ -d hotplace ]
then
        echo 'git pull'
        cd hotplace/
        git pull
else
        echo 'git clone'
        git clone https://github.com/kihoon76/hotplace
        cd hotplace/
fi

echo 'maven install.....'
mvn clean install -Dmaven.test.skip=true

echo 'tomcat stop............'
sudo systemctl stop tomcat

echo 'copy war file to tomcat.........'
sudo rm -rf /opt/tomcat/webapps/hot*.war
sudo cp ~/hotplace/target/hot*.war /opt/tomcat/webapps/hotplace.war

echo 'tomcat start.............'
sudo systemctl start tomcat
