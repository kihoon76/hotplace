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
	<style type="text/css">
	     .buttons { position:absolute;top:0;left:0;z-index:1000;padding:5px; }
	     .buttons .control-btn { margin:0 5px 5px 0; }
	</style>
</head>
<body data-mtype="<c:out value='${mType}' />">
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
      	<a class="navbar-brand" href="#">동림P&D</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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
<div id="map" >
	<div class="buttons">
		<button id="cadastral" type="button" class="btn btn-default" data-toggle="buttons" >
			지적도
		</button>
	</div>
</div>

<!-- 검색 modal -->
<div class="modal fade" id="addressSearch" tabindex="-1" role="dialog" aria-labelledby="addressSearchTitle" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="addressSearchTitle">주소검색</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      	<div class="row">
      		<div class="col-sm-12 col-md-12">
      			<div class="panel with-nav-tabs panel-primary">
	                <div class="panel-heading">
	                <ul class="nav nav-tabs" id="addrType">
	                    <li class="active"><a href="#tabRoad" data-toggle="tab" data-type="R">도로명 주소</a></li>
	                    <li><a href="#tabNumber" data-toggle="tab" data-type="N">지번 주소</a></li>
	                </ul>
	                </div>
	                <div class="panel-body">
	                	<div class="tab-content">
	                		<!-- 도로명 주소 -->
	                        <div class="tab-pane fade in active" id="tabRoad">
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
	                        <div class="tab-pane fade" id="tabNumber">
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
									</select>
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
                    	</div>
	                </div>
            	</div>
      		</div>
      	</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="btnViewMapAddress">지도에서 보기</button>
      </div>
    </div>
  </div>
</div>
<sitemesh:write property="body" />
<script id="address_template" type="text/x-handlebars-template">
	<table class="table table-bordered">
	<tbody>
		{{#each addresses as |addr|}}
		<tr>
			<td>
			{{addr.[1]}} {{addr.[2]}}
			</td>
			<td>
				<div class="funkyradio">
        		<div class="funkyradio-info">
					<input type="radio" name="sel" id="radio{{@index}}" data-lat="{{addr.[3]}}" data-lng="{{addr.[4]}}" data-sw="{{addr.[5]}}" data-en="{{addr.[6]}}" data-address="{{addr.[1]}} {{addr.[2]}}"/>
 					<label for="radio{{@index}}">선택</label>
		        </div>
				</div>
			</td>
		</tr>
		{{/each}}
	</tbody>
	</table>
</script>

<script type="text/javascript" src="/resources/handlebars/4.0.5/handlebars.min.js"></script>
<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>

<script type="text/javascript" src="/resources/js/common.js"></script>
<script type="text/javascript" src="/resources/js/plugins/loading/waitMe.js"></script>
<!-- <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=SgnlyXnzstmDsYDhele7&submodules=visualization&callback=mapCore.load"></script> -->
<!-- <script type="text/javascript" src="//apis.daum.net/maps/maps3.js?apikey=576ff8ec0e48c2e85ada1c1cc30b1b7a"></script> -->
<!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtzRob_ePM5RTujtBxE6w7W1tjbTS5mzw&callback=initMap"></script> -->
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=SgnlyXnzstmDsYDhele7&submodules=visualization"></script>
<!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtzRob_ePM5RTujtBxE6w7W1tjbTS5mzw&libraries=visualization"></script> -->

<script type="text/javascript" src="/resources/js/map/map-core2.js"></script>

<script type="text/javascript" src="/resources/js/layout.js"></script>

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