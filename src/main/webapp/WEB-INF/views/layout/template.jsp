<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    
    <!-- Bootstrap -->
    <link rel="stylesheet" href="/resources/bootstrap/3.3.7-1/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/resources/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" />
    
    <link rel="stylesheet" href="/resources/css/layout.min.css" />
    
    <!-- loading -->
    <link rel="stylesheet" href="/resources/js/plugins/loading/waitMe.min.css" />
	
	<title><sitemesh:write property="title" /></title>
	<sitemesh:write property="head" />
	<style type="text/css">
	     .buttons { position:absolute;top:0;left:0;z-index:1000;padding:5px; }
	     .buttons .control-btn { margin:0 5px 5px 0; }
	</style>
</head>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<body data-mtype="<c:out value='${mType}' />" data-url="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/">
<nav class="navbar navbar-default">
	<div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
    	<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#topbar" aria-expanded="false">
        	<span class="sr-only">Toggle navigation</span>
        	<span class="icon-bar"></span>
        	<span class="icon-bar"></span>
        	<span class="icon-bar"></span>
      	</button>
      	<a class="navbar-brand" href="#">동림P&D</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="topbar">
    	<ul class="nav navbar-nav">
        	<li class="dropdown">
	          	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">맵유형<span class="caret"></span></a>
	          	<ul class="dropdown-menu">
		            <li><a href="/main?mType=heatmap">열지도맵</a></li>
		            <li><a href="/main?mType=dotmap">점지도맵</a></li>
		            <li><a href="/main?mType=cellmap">셀맵</a></li>
	          	</ul>
	        </li>
      	</ul>
      	<div class="navbar-form navbar-left">
	        <button type="button" class="btn btn-default glyphicon glyphicon-search" data-toggle="modal" data-target="#addressSearch"></button>
      	</div>
    </div><!-- /.navbar-collapse -->
	</div><!-- /.container-fluid -->
</nav>
<div id="map" data-vender="naver">
	<div class="buttons" id="mapButtons"></div>
</div>
<div id="templateAddressModal"></div>

<sitemesh:write property="body" />
<script type="text/javascript" src="/resources/handlebars/4.0.5/handlebars.min.js"></script>
<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
<script type="text/javascript" src="/resources/chart.js/2.5.0/dist/Chart.min.js"></script>

<script type="text/javascript" src="/resources/js/plugins/loading/waitMe.min.js"></script>
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=SgnlyXnzstmDsYDhele7&submodules=visualization"></script>

<script type="text/javascript" src="/resources/js/map/map-core.js"></script>

<sitemesh:write property="page.script" />
<%--<c:choose>
<c:when test="${mType eq 'heatmap'}">
<script type="text/javascript" src="/resources/js/map/map-heatmap.js"></script>
</c:when>
<c:when test="${mType eq 'dotmap'}">
<script type="text/javascript" src="/resources/js/map/map-dotmap.js"></script>
</c:when>
<c:otherwise></c:otherwise>
</c:choose>--%>
</body>
</html>