<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<head>
	<title>핫플레이스</title>
	<!-- Font Awesome -->
	<link href="/resources/vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
	<!-- NProgress -->
	<link href="/resources/vendors/nprogress/nprogress.css" rel="stylesheet">
	<!-- bootstrap toggle -->
	<link href="/resources/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
	<!-- uploadify -->
	<link href="/resources/vendors/jQuery-Upload-File/4.0.11/uploadfile.css" rel="stylesheet">
	
</head>
<body>
<c:if test="${jangeagongji == 'on'}">
<div class="jangea">장애공지!!</div>
</c:if>
<content tag="script">
<script type="text/javascript" src="/resources/js/main.js"></script>
<script type="text/javascript" src="/resources/js/gyeongmae.js"></script>
<script type="text/javascript" src="/resources/js/gongmae.js"></script>
<script type="text/javascript" src="/resources/js/bosangpyeonib.js"></script>
<script type="text/javascript" src="/resources/js/silgeolae.js"></script>
<script type="text/javascript" src="/resources/js/sujibunseog.js"></script>
<script type="text/javascript" src="/resources/js/acceptbuilding.js"></script>
<script type="text/javascript" src="/resources/js/notice.js"></script>
<script type="text/javascript" src="/resources/js/login.js"></script>
<script type="text/javascript" src="/resources/js/location.js"></script>

<!-- FastClick -->
<script type="text/javascript" src="/resources/vendors/fastclick/lib/fastclick.js"></script>
<!-- NProgress -->
<script type="text/javascript" src="/resources/vendors/nprogress/nprogress.js"></script>
<!-- ECharts -->
<script type="text/javascript" src="/resources/vendors/echarts/dist/echarts.min.js"></script>
<script type="text/javascript" src="/resources/vendors/echarts/map/js/world.js"></script>

<!-- bootstrap toggle -->
<script type="text/javascript" src="/resources/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
<!-- uploadify -->
<script type="text/javascript" src="/resources/vendors/jQuery-Upload-File/4.0.11/jquery.uploadfile.js"></script>

</content>

</body>