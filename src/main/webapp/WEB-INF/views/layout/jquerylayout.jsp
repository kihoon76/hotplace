<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="/resources/css/layout.css" />
	<link rel="stylesheet" href="/resources/bootstrap/2.3.2/css/bootstrap.min.css" />
	
	
	<script type="text/javascript" src="/resources/js/plugin/jquery/jquery.js"></script>
	<script type="text/javascript" src="/resources/js/plugin/jquery/jquery.ui.all.js"></script>
	<script type="text/javascript" src="/resources/js/plugin/jquery/jquery.layout.min.js"></script>
	<script type="text/javascript" src="/resources/bootstrap/2.3.2/js/bootstrap.min.js"></script>
	
	<!-- <script type="text/javascript" src="/resources/js/common.js"></script>-->
	
	<script type="text/javascript">
	
	var myLayout; // a var is required because this page utilizes: myLayout.allowOverflow() method

	$(document).ready(function () {
		
		myLayout = $('body').layout({
			// enable showOverflow on west-pane so popups will overlap north pane
			west__showOverflowOnHover: true

		//,	west__fxSettings_open: { easing: "easeOutBounce", duration: 750 }
		});
 	});

	</script>
	
	
	
	<title><sitemesh:write property="title" /></title>
	<sitemesh:write property="head" />
</head>
<body>
<!-- manually attach allowOverflow method to pane -->
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
        <li><a href="/main"><span class="glyphicon glyphicon-home">초기화면</span></a></li>
        <li><a href="#"><span class="glyphicon glyphicon-question-sign">도움말</span></a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
      	<sec:authorize access="isAuthenticated()">
      	<li><a href="/my/account"><span class="glyphicon glyphicon-user">내계정</span></a></li>
       	<li><a href="/logout"><span class="glyphicon glyphicon-log-out">로그아웃</span></a></li>
      	</sec:authorize>
      	<sec:authorize access="isAnonymous()">
        <li><a href="/signin"><span class="glyphicon glyphicon-log-in">로그인</span></a></li>
       	<li><a href="/regist"><span class="glyphicon glyphicon-edit">회원가입</span></a></li>
       	</sec:authorize>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<!-- allowOverflow auto-attached by option: west__showOverflowOnHover = true -->
<div class="ui-layout-west">
	This is the west pane, closable, slidable and resizable

	<ul>
		<li>
			<ul>
				<li>one</li>
				<li>two</li>
				<li>three</li>
				<li>four</li>
				<li>five</li>
			</ul>
			Pop-Up <!-- put this below so IE and FF render the same! -->
		</li>
	</ul>

	<p><button onclick="myLayout.close('west')">Close Me</button></p>

	<p><a href="#" onClick="showOptions(myLayout,'defaults.fxSettings_open');showOptions(myLayout,'west.fxSettings_close')">Show Options.Defaults</a></p>

</div>

<div class="ui-layout-south">
	This is the south pane, closable, slidable and resizable &nbsp;
	<button onclick="myLayout.toggle('north')">Toggle North Pane</button>
</div>

<div class="ui-layout-east">
	This is the east pane, closable, slidable and resizable

	<!-- attach allowOverflow method to this specific element -->
	<ul onmouseover="myLayout.allowOverflow(this)" onmouseout="myLayout.resetOverflow('east')">
		<li>
			<ul>
				<li>one</li>
				<li>two</li>
				<li>three</li>
				<li>four</li>
				<li>five</li>
			</ul>
			Pop-Up <!-- put this below so IE and FF render the same! -->
		</li>
	</ul>

	<p><button onclick="myLayout.close('east')">Close Me</button></p>

	
</div>

<div class="ui-layout-center">
	This center pane auto-sizes to fit the space <i>between</i> the 'border-panes'
	<p>This layout was created with only <b>default options</b> - no customization</p>
	<p>Only the <b>applyDefaultStyles</b> option was enabled for <i>basic</i> formatting</p>
	<p>The Pop-Up and Drop-Down lists demonstrate the <b>allowOverflow()</b> utility</p>
	<p>The Close and Toggle buttons are examples of <b>custom buttons</b></p>
	<p><a href="http://layout.jquery-dev.net/demos.html">Go to the Demos page</a></p>
</div>
<sitemesh:write property="body" />
</body>
</html>