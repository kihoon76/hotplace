<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title><sitemesh:write property="title" /></title>
	<sitemesh:write property="head" />
	<style>
	html, body { width: 100%; height: 100%; margin: 0; padding: 0; }
	</style>
</head>
<body>
	<sitemesh:write property="body" /> 
</body>
</html>