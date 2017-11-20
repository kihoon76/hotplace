<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    <title><sitemesh:write property="title" /></title>
    <link rel="icon" href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/resources/img/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" ref="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/resources/img/favicon.ico" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="/resources/bootstrap/3.3.7-1/css/bootstrap.min.css" />
    
    <!-- slider -->
    <!-- http://ghusse.github.io/jQRangeSlider/documentation.html -->
    <link rel="stylesheet" href="/resources/vendors/jQRangeSlider-5.7.2/css/classic.css" />
    
    <!-- font-awesome -->
    <link rel="stylesheet" href="/resources/vendors/font-awesome/css/font-awesome.min.css" />
    
    <!-- checkbox -->
    <link rel="stylesheet" href="/resources/vendors/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" />
    
    <!-- tooltipster -->
    <!-- http://iamceege.github.io/tooltipster/ -->
    <link rel="stylesheet" href="/resources/vendors/tooltipster/dist/css/tooltipster.bundle.min.css" />
    <link rel="stylesheet" href="/resources/vendors/tooltipster/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-borderless.min.css" />
    
    <!-- tabulator -->
    <link rel="stylesheet" href="/resources/vendors/tabulator/dist/css/tabulator_simple.min.css" />
    
    <!-- jQuery-ui-slider-pips -->
    <!-- https://github.com/simeydotme/jQuery-ui-Slider-Pips/ -->
    <link rel="stylesheet" href="/resources/jquery-ui/1.10.3/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="/resources/vendors/jQuery-ui-Slider-Pips/dist/jquery-ui-slider-pips.min.css" />
    
    <link rel="stylesheet" href="/resources/css/buttons.css" />
    <link rel="stylesheet" href="/resources/css/layout.css" />
    <link rel="stylesheet" href="/resources/css/user.css" />
    
    <!-- loading -->
    <link rel="stylesheet" href="/resources/js/plugins/loading/waitMe.min.css" />
	
	<sitemesh:write property="head" />
</head>

<body data-mtype="<c:out value='${mType}' />" data-url="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/">
<div id="map" data-vender="naver">
	<div class="map-buttons" id="mapButtons"></div>
	<div id="menu"><ul></ul></div>
	<div id="rightMenu"></div>
	<div id="dvNews" class="layer-popup" style="width:600px; height:50px">
		<ul id="newsTicker" class="ticker">
			<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
      		<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
      		<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
      		<li><a href="">도시재생 사업(사상스마트시티) 실시계획인가, 부산시, 201707.10</a></li>
		</ul>
	</div>
	<div id="dvMulgeon"    class="layer-popup" style="width:600px;"></div>
	<div id="dvAddrSearch" class="layer-popup" style="width:600px; height:810px"></div>
	<div id="dvInfo"       class="layer-popup" style="width:600px; height:800px"></div>
	<div id="dvSalesView"  class="layer-popup" style="width:250px; height:355px"></div>
	<div id="dvAutoYearRange" class="layer-year-range-auto">
        <input type="checkbox" id="btnAutoYear" data-toggle="toggle" data-on="<i class='fa fa-play'></i>" data-off="<i class='fa fa-pause'></i>">
	</div>
	<div id="dvYearRange"  class="layer-year-range"></div>
	<button id="btnJijeok" class="jijeok" data-switch="off">지적도</button>
</div>

<!-- modal -->
<div class="modal fade" id="containerModal" tabindex="-1" role="dialog" aria-labelledby="containerModalLabel" style="z-index:1050;">
	<div class="modal-dialog " role="document">
    <div class="modal-content ">
    	<div class="modal-header">
    		<span id="spModalTitle"></span>
        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      	</div>
      	<div class="modal-body" id="dvModalContent">
        Modal 내용
      	</div>
    </div>
	</div>
</div>

<div class="modal fade" id="centerModal" tabindex="-1" role="dialog" aria-labelledby="centerModalLabel" style="z-index:1050;">
	<div class="vertical-alignment-helper">
	<div class="modal-dialog vertical-alignment-center" role="document">
    <div class="modal-content ">
    	<div class="modal-header">
    		<span id="spCenterModalTitle"></span>
        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      	</div>
      	<div class="modal-body" id="dvCenterModalContent">
        Modal 내용
      	</div>
    </div>
	</div>
	</div>
</div>

<div id="dimScreen"></div>
<sitemesh:write property="body" />
<script type="text/javascript" src="/resources/handlebars/4.0.5/handlebars.min.js"></script>
<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>

<script type="text/javascript" src="/resources/jquery-ui/1.10.3/ui/minified/jquery-ui.min.js"></script>
<script type="text/javascript" src="/resources/vendors/jQRangeSlider-5.7.2/jQAllRangeSliders-min.js"></script>
<script type="text/javascript" src="/resources/vendors/tooltipster/dist/js/tooltipster.bundle.min.js"></script>
<script type="text/javascript" src="/resources/vendors/tabulator/dist/js/tabulator.min.js"></script>
<script type="text/javascript" src="/resources/vendors/jQuery-ui-Slider-Pips/dist/jquery-ui-slider-pips.js"></script>

<script type="text/javascript" src="/resources/chart.js/2.5.0/dist/Chart.min.js"></script>

<script type="text/javascript" src="/resources/js/plugins/loading/waitMe.min.js"></script>
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=SgnlyXnzstmDsYDhele7&submodules=visualization"></script>

<!-- <script type="text/javascript" src="/resources/js/map/map-core.js"></script> -->
<script type="text/javascript" src="/resources/js/map/hotplace.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.maps.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.report.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.validation.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.calc.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.chart.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.database.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.dom.js"></script>
<script type="text/javascript" src="/resources/js/map/hotplace.test.js"></script>

<script type="text/javascript" src="/resources/js/map/naver/MarkerClustering.js"></script>
<sitemesh:write property="page.script" />
</body>
</html>