<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<head>
	<link rel="stylesheet" href="/resources/plugin/loading/waitMe.css" />
	<link rel="stylesheet" href="/resources/css/signin.css" />
	
	<script type="text/javascript" src="/resources/js/jquery.cookie.js"></script>
	<script type="text/javascript" src="/resources/plugin/loading/waitMe.js"></script>
	<script type="text/javascript" src="/resources/js/common.js"></script>
	<script type="text/javascript" src="/resources/js/signin/signin_c.js"></script>
	<script type="text/javascript" src="/resources/js/signin/signin_v.js"></script>
	<title>로그인</title>
</head>
<body>
<div class="container">
<div class="row">
<div class="well">
<div class="panel panel-primary">
	<div class="panel-heading">로그인</div>
	<div class="panel-body">
		<form class="form-horizontal" method="post" action="/login">
			<div class="form-group">
				<label class="control-label col-sm-2" for="name">이 름:</label>
				<div class="col-sm-10">
	     			<input type="text" class="form-control" id="id" name="id" placeholder="Enter name">
	   			</div>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2" for="pwd">비 번:</label>
				<div class="col-sm-10">
			    	<input type="password" class="form-control" id="pw" name="pw" placeholder="Enter password">
			    </div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<div class="checkbox">
			    		<label><input type="checkbox" id="idSave" name="idsave" value="true"> id 저장</label>
					</div>
				</div>
			</div>
			
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button type="button" class="btn btn-default" id="btnAjaxSubmit">로그인</button>
				</div>
			</div>
		</form>
	</div>
</div>
</div>
</div>
</div>
</body>
