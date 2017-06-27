<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="form" 	uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c"   	uri="http://java.sun.com/jsp/jstl/core" %>       %>
<spring:hasBindErrors name="userForm">
	<c:if test="${errors.hasFieldErrors('id')}">
	<c:set var="idErrCls" value="has-error" />
	</c:if>
	<c:if test="${errors.hasFieldErrors('pw')}">
	<c:set var="pwErrCls" value="has-error" />
	</c:if>
	<c:if test="${errors.hasFieldErrors('sName')}">
	<c:set var="sNameErrCls" value="has-error" />
	</c:if>
	<c:if test="${errors.hasFieldErrors('fName')}">
	<c:set var="fNameErrCls" value="has-error" />
	</c:if>
	<c:if test="${errors.hasFieldErrors('email')}">
	<c:set var="emailErrCls" value="has-error" />
	</c:if>
</spring:hasBindErrors>
<head>
	<link rel="stylesheet" href="/resources/plugin/loading/waitMe.css" />
	<link rel="stylesheet" href="/resources/css/regist.css" />
	<link rel="stylesheet" href="/resources/css/validate.css" />
	
	<script type="text/javascript" src="/resources/plugin/loading/waitMe.js"></script>
	<script type="text/javascript" src="/resources/js/regist/regist_c.js"></script>
	<script type="text/javascript" src="/resources/js/regist/regist_m.js"></script>
	<script type="text/javascript" src="/resources/js/regist/regist_v.js"></script>
	<title>등록화면</title>
</head>
<body>
<div class="container">
<div class="row">
<div class="well">
<div class="panel panel-primary">
	<div class="panel-heading">등록</div>
	<div class="panel-body">
	<form:form cssClass="form-horizontal" modelAttribute="userForm" method="POST">
		<div class="form-group row required">
	    	<label for="id" class="col-md-2 col-form-label">아이디</label>
	    	<div class="col-md-5 <c:out value='${idErrCls}' />">
	    		<form:input path="id" cssClass="form-control" placeholder="아이디"/>
	    		<form:errors path="id" cssClass="form-err"/>
	      	</div>
	      	<div class="col-md-3">
	      		<button id="btnCheckDup" class="btn btn-primary">아이디 중복확인</button>
	      	</div>
	    </div>
	    
	    <div class="form-group row required">
	    	<label for="pw" class="col-md-2 col-form-label">비밀번호</label>
	    	<div class="col-md-10 <c:out value='${pwErrCls}' />">
	    		<form:password path="pw" cssClass="form-control" placeholder="비밀번호"/>
	    		<form:errors path="pw" cssClass="form-err"/>
	      	</div>
	    </div>
	    
	    <div class="form-group row required">
	    	<label for="pwConfirm" class="col-md-2 col-form-label">비밀번호 확인</label>
	    	<div class="col-md-10">
	        	<input type="password" class="form-control" id="pwConfirm" placeholder="비밀번호 확인">
	      	</div>
	    </div>
	    
	    <div class="form-group row required">
	    	<label for="sName" class="col-md-2 col-form-label">이름</label>
	    	<div class="col-md-10 <c:out value='${sNameErrCls}' />">
	    		<form:input path="sName" cssClass="form-control" placeholder="이름" />
	    		<form:errors path="sName" cssClass="form-err"/>
	      	</div>
	    </div>
	    
	    <div class="form-group row required">
	    	<label for="fName" class="col-md-2 col-form-label">성</label>
	    	<div class="col-md-10 <c:out value='${fNameErrCls}' />">
	    		<form:input path="fName" cssClass="form-control" placeholder="성" />
	    		<form:errors path="fName" cssClass="form-err"/>
	      	</div>
	    </div>
	    
	    <div class="form-group row required">
	    	<label for="email" class="col-md-2 col-form-label">이메일</label>
	    	<div class="col-md-5 <c:out value='${emailErrCls}' />">
          		<input type="text" class="form-control" id="emailAccount" placeholder="이메일" >
          	</div>
          	<div class="col-md-4 input-group mb-2 mr-sm-2 mb-sm-0">
          		<div class="input-group-addon">@</div>
	            <select class="form-control EMAIL" id="selEmailVender">
	                <option value="google.com" selected>google.com</option>
	                <option value="naver.com">naver.com</option>
	                <option value="direct">직접입력</option>
	            </select>
            </div>
            <div class="col-md-4 input-group input-group-sm" style="display:none;">
            	<div class="input-group-addon">@</div>
            	<input type="text" class="form-control email-direct EMAIL" placeholder="직접입력" id="txtEmailVender">
            	<span class="input-group-btn">
   					<button type="button" class="btn btn-default email-direct-btn EMAIL"><span class="glyphicon glyphicon-repeat"></span></button>
				</span>
            </div>
	    	<form:hidden path="email" />
	    	<form:hidden path="emailDirect" />
	    </div>
	    
	   	<div class="form-group row">
	    	<div class="offset-sm-2 col-md-10">
	        	<button type="button" id="btnConfirm" class="btn btn-primary">확인</button>
	 		</div>
	    </div>
	</form:form>
	</div>
</div>
</div>
</div>
</div>
</body>
