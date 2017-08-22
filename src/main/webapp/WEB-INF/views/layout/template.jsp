<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    <title><sitemesh:write property="title" /></title>
    
    <!-- Bootstrap -->
    <link rel="stylesheet" href="/resources/bootstrap/3.3.7-1/css/bootstrap.min.css" />
    
    <!-- slider -->
    <!-- http://ghusse.github.io/jQRangeSlider/documentation.html -->
    <link rel="stylesheet" href="/resources/vendors/jQRangeSlider-5.7.2/css/classic.css" />
    
    <link rel="stylesheet" href="/resources/css/buttons.css" />
    <link rel="stylesheet" href="/resources/css/layout.css" />
    
    <!-- loading -->
    <link rel="stylesheet" href="/resources/js/plugins/loading/waitMe.min.css" />
	
	<sitemesh:write property="head" />
</head>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<body data-mtype="<c:out value='${mType}' />" data-url="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/">
<!-- 
<nav class="navbar navbar-default">
	<div class="container-fluid">
    <div class="navbar-header">
    	<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#topbar" aria-expanded="false">
        	<span class="sr-only">Toggle navigation</span>
        	<span class="icon-bar"></span>
        	<span class="icon-bar"></span>
        	<span class="icon-bar"></span>
      	</button>
      	<a class="navbar-brand" href="#">동림P&D</a>
    </div>

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
	        <button type="button" class="btn btn-default glyphicon glyphicon-list-alt" id="btnNews"></button>
      	</div>
      	<div class="navbar-form navbar-left">
	        <button type="button" class="btn btn-default glyphicon glyphicon-search" data-toggle="modal" data-target="#addressSearch"></button>
      	</div>
      	<div class="navbar-form navbar-left">
	        <button type="button" class="btn btn-default glyphicon glyphicon-camera" id="btnCapture"></button>
      	</div>
      	<div class="navbar-form navbar-left">
	        <button type="button" class="btn btn-default glyphicon glyphicon-info-sign" id="btnInfo"></button>
      	</div>
      	
      	<div class="nav navbar-nav">
      	<ul class="demo2">
      		<li class="news-item">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</li>
      		<li class="news-item">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</li>
      		<li class="news-item">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</li>
      		<li class="news-item">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</li>
      	</ul>
      	</div>
      	
      	<div class="navbar-form navbar-right">
	        <button type="button" class="btn btn-default glyphicon glyphicon-user" id="btnUser"></button>
      	</div>
    </div>
	</div>
</nav>
-->
<div id="map" data-vender="naver">
	<div class="map-buttons" id="mapButtons"></div>
	<div id="dvNews" class="layer-popup" style="width:600px; height:50px">
		<ul id="newsTicker" class="ticker">
			<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
      		<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
      		<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
      		<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
		</ul>
	</div>
	<div id="dvAddrSearch" class="layer-popup" style="width:600px; height:600px">
		<ul class="nav nav-tabs" id="addrType">
            <li class="active"><a href="#tabRoad" data-toggle="tab" data-type="R" >도로명 주소</a></li>
            <li><a href="#tabNumber" data-toggle="tab" data-type="N">지번 주소</a></li>
        </ul>
        
        <div class="tab-content">
        <!-- 도로명 주소 -->
        <div class="tab-pane fade in active" id="tabRoad" style="padding-top:10px">
        	<div class="row">
            	<div class="col-sm-4 col-md-4" style="padding-right:0px">
                <select class="form-control" id="selRsido">
                	<option value="">- 시도 -</option>
			    	<option value="11">서울특별시</option>
                    <option value="26">부산광역시</option>
                    <option value="27">대구광역시</option>
                    <option value="28">인천광역시</option>
                    <option value="29">광주광역시</option>
                    <option value="30">대전광역시</option>
                    <option value="31">울산광역시</option>
                    <option value="36">세종특별자치시</option>
                    <option value="41">경기도</option>
                    <option value="42">강원도</option>
                    <option value="43">충청북도</option>
                    <option value="44">충청남도</option>
                    <option value="45">전라북도</option>
                    <option value="46">전라남도</option>
                    <option value="47">경상북도</option>
                    <option value="48">경상남도</option>
                    <option value="50">제주특별자치도</option>
				</select>
                </div>
                   		
                <div class="col-sm-4 col-md-4" style="padding: 0 0 0 2px">
                <select class="form-control" id="selRgugun">
			    	<option value="">- 시군구  -</option>
				</select>
                </div>
                   		
                <div class="col-sm-4 col-md-4" style="padding: 0 15px 0 2px">
                <select class="form-control" id="selRoadName">
			    	<option value="">- ~로  -</option>
				</select>
                </div>
			</div>
                   	
            <div class="input-group" style="margin-top:5px">
			<input type="text" class="form-control" placeholder="도로명" aria-describedby="basic-addon">
		  	<span class="input-group-btn">
		  		<button class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>
		  	</span>
			</div>
		
			<!-- 검색결과 -->
			<div style="margin-top:5px" class="div-addr-result"></div>
	    </div>
	    
	    <!-- 지번주소 -->
	    <div class="tab-pane fade" id="tabNumber" style="padding-top:10px">
	    	<div class="row">
	    		<div class="col-sm-4 col-md-4" style="padding-right:0px">
	        	<select class="form-control" id="selNsido">
	        		<option value="">- 시도 -</option>
					<option value="11">서울특별시</option>
                    <option value="26">부산광역시</option>
                    <option value="27">대구광역시</option>
                    <option value="28">인천광역시</option>
                    <option value="29">광주광역시</option>
                    <option value="30">대전광역시</option>
                    <option value="31">울산광역시</option>
                    <option value="36">세종특별자치시</option>
                    <option value="41">경기도</option>
                    <option value="42">강원도</option>
                    <option value="43">충청북도</option>
                    <option value="44">충청남도</option>
                    <option value="45">전라북도</option>
                    <option value="46">전라남도</option>
                    <option value="47">경상북도</option>
                    <option value="48">경상남도</option>
                    <option value="50">제주특별자치도</option>
				<select>
	            </div>
	                        		
	            <div class="col-sm-4 col-md-4" style="padding: 0 0 0 2px">
	            <select class="form-control" id="selNgugun">
					<option value="">- 시군구  -</option>
				</select>
	            </div>
	                        		
	            <div class="col-sm-4 col-md-4" style="padding: 0 15px 0 2px">
	            <select class="form-control" id="selName">
				    <option value="">- 지역명  -</option>
				</select>
	            </div>
			</div>
	                        	
	       	<div class="input-group" style="margin-top:5px">
		  	<input type="text" class="form-control" placeholder="도로명" aria-describedby="basic-addon">
			<span class="input-group-btn">
				<button class="btn btn-default" id="btnNsearch"><span class="glyphicon glyphicon-search"></span></button>
			</span>
			</div>
								
			<!-- 검색결과 -->
			<div id="dvNresult" style="margin-top:5px" class="div-addr-result"></div>
		</div>
		
		<div style="padding-top:10px; padding-left:465px">
        <button type="button" class="btn btn-primary" id="btnViewMapAddress">지도에서 보기</button>
      	</div>
	</div>
</div>
<div id="dvPinSearch" class="layer-popup" style="width:600px; height:800px">
<form class="form-horizontal" role="form" method="post" action="index.php" id="fmPin">
	<div class="form-group">
		<label for="name" class="col-sm-5 control-label">조건검색</label>
		<div class="col-sm-2 col-md-2" style="padding-right:0px">
        	<select class="form-control">
            <option value="">전국</option>
	   		</select>
	    </div>
   		<div class="col-sm-2 col-md-2" style="padding: 0 0 0 2px">
       		<select class="form-control" id="selNgugun">
		    <option value="">광역</option>
			</select>
       	</div>
		<div class="col-sm-2 col-md-2" style="padding: 0 15px 0 2px">
	    	<select class="form-control" id="selName">
			<option value="">지자체</option>
			</select>
	    </div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">RQ(종합부동산 투자지수)</label>
		<div class="col-sm-7">
			 <div id="sliderRQ"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">건축허가면적 증가율</label>
		<div class="col-sm-7">
			<div id="sliderCon"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">개발행위 허가면적 증가율</label>
		<div class="col-sm-7">
			<div id="sliderDev"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">부동산실거래 면적 증가율</label>
		<div class="col-sm-7">
			<div id="sliderRealWidth"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">부동산실거래 가격 증가율</label>
		<div class="col-sm-7">
			<div id="sliderRealPrice"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">유동인구 증가율</label>
		<div class="col-sm-7">
			<div id="sliderPop"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">개발사업 면적 증가율</label>
		<div class="col-sm-7">
			<div id="sliderDevWidth"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">기반시설편입 필지수 증가율</label>
		<div class="col-sm-7">
			<div id="sliderParcel"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-5 control-label">영업허가 면적 증가율</label>
		<div class="col-sm-7">
			<div id="sliderSales"></div>
		</div>
	</div>
</form>
</div>
<div id="templateAddressModal"></div>

<sitemesh:write property="body" />
<script type="text/javascript" src="/resources/handlebars/4.0.5/handlebars.min.js"></script>
<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>

<script type="text/javascript" src="/resources/jquery-ui/1.10.3/ui/minified/jquery-ui.min.js"></script>
<script type="text/javascript" src="/resources/vendors/jQRangeSlider-5.7.2/jQRangeSlider-withRuler-min.js"></script>

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