<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    
    <!-- Bootstrap -->
    <link rel="stylesheet" href="/resources/bootstrap/3.3.7-1/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/resources/css/layout.css" />
    
    <!-- loading -->
    <link rel="stylesheet" href="/resources/js/plugins/loading/waitMe.min.css" />
	
	<title><sitemesh:write property="title" /></title>
	<sitemesh:write property="head" />
	
</head>
<body>
<form>
<div class="form-group">
        <label class="col-md-2 control-label">apikey</label>
        <div class="col-md-10  inputGroupContainer">
          <div class="input-group">
            <input id="apikey" name="apikey" placeholder="API_KEY" class="form-control"  type="text">
          </div>
        </div>
</div>
<div class="form-group">
        <label class="col-md-2 control-label">secret</label>
        <div class="col-md-10  inputGroupContainer">
          <div class="input-group">
            <input id="secret" name="secret" placeholder="secret" class="form-control"  type="text">
          </div>
        </div>
</div>
<div class="form-group">
        <label class="col-md-2 control-label">lat</label>
        <div class="col-md-10  inputGroupContainer">
          <div class="input-group">
            <input id="lat" name="lat" placeholder="lat" class="form-control"  type="text">
          </div>
        </div>
</div>
<div class="form-group">
        <label class="col-md-2 control-label">lng</label>
        <div class="col-md-10  inputGroupContainer">
          <div class="input-group">
            <input id="lng" name="lng" placeholder="lng" class="form-control"  type="text">
          </div>
        </div>
</div>
 <div class="form-group">
        <label class="col-md-2 control-label"></label>
        <div class="col-md-10">
          <button id="btnSend" type="submit" class="btn btn-warning" >Send <span class="glyphicon glyphicon-send"></span></button>
        </div>
      </div>
      
</form>      
<div>result xml</div>
<div id="dvResult" class="container-fluid">
  
</div>
<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>
<script type="text/javascript">
	$('#btnSend').on('click', function(e) {
		e.preventDefault();
		
		$.ajax({
			 type: 'GET', 
			 dataType: 'text',
			 url: 'http://hotplace.ddns.net:8080/sample/naver',
			 data: 'key='+$('#apikey').val()+'&secret='+$('#secret').val()+'&lat='+$('#lat').val()+'&lng='+$('#lng').val(),
			 success: function(data) {
				$('#dvResult').text(data); 
			 },
			 error: function() {
				 
			 }
		});
		
	})
</script>

</body>
</html>