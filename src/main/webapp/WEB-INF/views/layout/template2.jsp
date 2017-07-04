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
    
	<title><sitemesh:write property="title" /></title>
	<sitemesh:write property="head" />
	<style type="text/css">
     .buttons { position:absolute;top:0;left:0;z-index:1000;padding:5px; }
     .buttons .control-btn { margin:0 5px 5px 0; }
</style>
</head>
<body>
<nav class="navbar navbar-default">
	<div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
    	<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        	<span class="sr-only">Toggle navigation</span>
        	<span class="icon-bar"></span>
        	<span class="icon-bar"></span>
        	<span class="icon-bar"></span>
      	</button>
      	<a class="navbar-brand" href="#">Brand</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    	<ul class="nav navbar-nav">
        	<li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
        	<li><a href="#">Link</a></li>
        	<li class="dropdown">
	          	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">맵유형<span class="caret"></span></a>
	          	<ul class="dropdown-menu">
		            <li><a href="/main?mType=heatmap">열지도맵</a></li>
		            <li><a href="/main?mType=dotmap">점지도맵</a></li>
		            <li><a href="#">Something else here</a></li>
		            <li role="separator" class="divider"></li>
		            <li><a href="#">Separated link</a></li>
		            <li role="separator" class="divider"></li>
		            <li><a href="#">One more separated link</a></li>
	          	</ul>
	        </li>
      	</ul>
      	<form class="navbar-form navbar-left">
	        <div class="form-group">
	          <input type="text" class="form-control" placeholder="Search">
	        </div>
	        <button type="submit" class="btn btn-default">검색</button>
      	</form>
    </div><!-- /.navbar-collapse -->
	</div><!-- /.container-fluid -->
</nav>
<div id="map">
	<div class="buttons">
		<!-- <input id="cadastral" type="button" class="control-btn" value="지적도" /> -->
		<button id="cadastral" type="button" class="btn btn-default" data-toggle="buttons" >
			지적도
		</button>
	</div>
</div>
<sitemesh:write property="body" />

<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/resources/js/common.js"></script>
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=SgnlyXnzstmDsYDhele7&submodules=visualization&callback=mapCore.load"></script>
<script type="text/javascript" src="/resources/js/map/map-core.js"></script>

<c:choose>
<c:when test="${mType eq 'heatmap'}">
<script type="text/javascript" src="/resources/js/map/map-heatmap.js"></script>
</c:when>
<c:when test="${mType eq 'dotmap'}">
<script type="text/javascript" src="/resources/js/map/map-dotmap.js"></script>
</c:when>
<c:otherwise></c:otherwise>
</c:choose>
</body>
</html>