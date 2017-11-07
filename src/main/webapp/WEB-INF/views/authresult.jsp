<%@ page language="java" contentType="text/plain; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c"	 uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="me.hotplace.domain.AjaxVO" %>
<%
	AjaxVO vo = (AjaxVO) request.getAttribute("result");
%>
<c:out value='{"success":false, "errCode": "100"}'  escapeXml="false"/>