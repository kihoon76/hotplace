<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<head>
	<title>25cell.com</title>
</head>
<body>
	<img src="/resources/img/demo/demo1.jpg"  usemap="#demo1"/>
	<map name="demo1">
		<area shape="rect" coords="33 230 84 283" target="_self" href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/preview/demo/2" />
	</map>
</body>