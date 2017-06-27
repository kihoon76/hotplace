<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="/resources/bootstrap/3.3.7-1/css/bootstrap.min.css" />
	<script type="text/javascript" src="/resources/jquery/1.11.1/jquery.min.js"></script>
	<script type="text/javascript" src="/resources/bootstrap/3.3.7-1/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="/resources/js/common.js"></script>
	
	<title><sitemesh:write property="title" /></title>
	<sitemesh:write property="head" />
</head>
<body>
<nav class="navbar navbar-default" id="topbar">
	<div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <!--<li class="active"><a href="#">내페이지</a></li>-->
        <li><a href="/main"><span class="glyphicon glyphicon-th-list">초기화면</span></a></li>
        <li><a href="#"><span class="glyphicon glyphicon-home">내페이지</span></a></li>
        <li><a href="/project"><span class="glyphicon glyphicon-list-alt">프로젝트</span></a></li>
        <sec:authorize access="hasRole('ROLE_ADMIN')">
        <li><a href="/admin/mgmt"><span class="glyphicon glyphicon-cog">관리</span></a></li>
       	</sec:authorize>
        <li><a href="#"><span class="glyphicon glyphicon-question-sign">도움말</span></a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
      	<sec:authorize access="isAuthenticated()">
      	<li><a href="/my/account"><span class="glyphicon glyphicon-user">내계정</span></a></li>
       	<li><a href="/logout"><span class="glyphicon glyphicon-log-out">로그아웃</span></a></li>
      	</sec:authorize>
      	<sec:authorize access="isAnonymous()">
        <li><a href="/signin"><span class="glyphicon glyphicon-log-in">로그인</span></a></li>
       	<li><a href="/regist"><span class="glyphicon glyphicon-edit">등록</span></a></li>
       	</sec:authorize>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
<sitemesh:write property="body" />
</body>
</html>