<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<div class="btn-pref btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
	<div class="btn-group" role="group">
    	<button type="button" id="btnTabLogin" class="btn btn-primary" href="#tabLogin" data-toggle="tab">
        	<div class="hidden-xs">로그인</div>
        </button>
    </div>
    <div class="btn-group" role="group">
    	<button type="button" id="btnTabJoin" class="btn btn-default" href="#tabJoin" data-toggle="tab">
        	<div class="hidden-xs">회원가입</div>
        </button>
    </div>
</div>
<div id="dvLoginJoin" class="well">
	<div class="tab-content">
    	<div class="tab-pane fade in active" id="tabLogin">
    		<div class="card card-container">
    			<img id="profile-img" class="profile-img-card" src="{{path}}resources/img/login/user.png" />
    			<p id="profile-name" class="profile-name-card"></p> 
        		<form class="form-horizontal" method="post" action="/login" id="loginFm">
					<div class="form-group">
						<div class="col-sm-12">
	     					<input type="text" class="form-control" id="id" name="id" placeholder="아이디">
	   					</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
			    			<input type="password" class="form-control" id="pw" name="pw" placeholder="비밀번호">
			    		</div>
					</div>
			
					<div class="form-group">
						<div class="col-sm-12">
							<button type="button" class="btn btn-primary" id="btnLogin">로그인</button>
						</div>
					</div>
				</form>
			</div>
        </div>
        <div class="tab-pane fade in" id="tabJoin">
        	<div id="dvJoin">
	        	<div id="dvJoinService" class="service">
	        		<div class="dv-join-content">
	        		<c:forEach var="item" items="${yaggwan}">
	        			<div class="tos">
		        			<span class="bluedot">●</span> <strong>${item.categoryName}</strong>
		        			${item.content}
		    			</div>	
	        		</c:forEach>
	        		</div>
	    			<div id="dvJoinServiceBtn">
	        			<button id="btnJoinNext" class="btn-next" disabled></button>
	    			</div>
	        	</div>
        	
	        	<div id="dvJoinForm">
	        		<form id="fmJoin">
	        			<span class="bluedot">●</span> <strong>회원가입</strong>
	        			<div class="dv-join-content">
			        		<table>
			    				<tr>
			        				<th>아이디</th>
			        				<td>
			        					<div class="form-group">
				        					<div class="input-group" id="dvJoinId">
				    							<input type="text" class="form-control" id="joinUserId" name="joinUserId"/>
				    							<span class="input-group-btn">
													<button type="button" id="btnJoinIdCheck" class="btn btn-default" title="uu"><span>중복확인</span></button>
												</span>
											</div>
										</div>
			        				</td>
			    				</tr>
			    				<tr>
			        				<th>비밀번호</th>
			        				<td>
			        					<div class="form-group">
				        					<input type="password" id="joinPw" name="joinPw" class="form-control">
										</div>
			        				</td>
			   					</tr>
			    				<tr>
			        				<th>비밀번호확인</th>
			        				<td>
			        					<div class="form-group">
			        						<input type="password" id="joinPwConfirm" name="joinPwConfirm" class="form-control">
			        					</div>
			        				</td>
			    				</tr>
			    				<tr>
			        				<th>이름</th>
			        				<td>
			        					<div class="form-group">
			        						<input type="text" id="joinUserName" name="joinUserName" class="form-control">
			        					</div>
			        				</td>
			    				</tr>
			    				<tr>
			        				<th>이메일 주소</th>
			        				<td>
			        					<div class="form-group">
				        					<div class="input-group">
												<input type="text" id="joinUserEmailA" class="form-control" name="joinUserEmailA">
												<span class="input-group-addon">@</span>
												<select id="joinUserEmailV" name="joinUserEmailV" class="form-control">
				                					<option value="">---선택하세요---</option>
				                					<option value="naver.com">naver.com</option>
				                					<option value="daum.net">daum.net</option>
				                					<option value="nate.com">nate.com</option>
				                					<option value="gmail.com">gmail.com</option>
				                					<option value="D">직접입력</option>
				            					</select>
				            				</div>
				            			</div>
			        				</td>
			    				</tr>
			    				<tr>
			        				<th>연락처</th>
			        				<td>
			        					<div class="form-group">
			        						<div class="input-group">
												<select id="joinUserPhoneF" class="form-control" name="joinUserPhoneF">
				                					<option value="010">010</option>
				                					<option value="011">011</option>
				                					<option value="016">016</option>
				                					<option value="017">017</option>
				                					<option value="019">019</option>
				                					<option value="070">070</option>
				            					</select>
												<span class="input-group-addon">-</span>
												<input type="text" id="joinUserPhoneM" name="joinUserPhoneM" class="form-control">
												<span class="input-group-addon">-</span>
												<input type="text"  id="joinUserPhoneL" class="form-control">
			            					</div>
			        					</div>
			         				</td>
			    				</tr>
							</table>
						</div>
						<div class="form-group" id="dvJoinBtns">
							<button type="button" id="dvJoinBtnPrev" class="btn-prev"></button>
		    				<button type="submit" id="dvJoinBtnCheck" class="btn-check"></button>
		    			</div>
					</form>
	        	</div>
        	
	        	<div id="dvJoinCheck">
					<p>회원가입을 진행하시겠습니까?</p>
					<div id="dvJoinCheckBtns">
						<button id="dvJoinCheckBtnCancel" class="btn-cancel"><img src="img/cancel.png" alt=""></button>
						<button id="dvJoinCheckBtnSubmit" class="btn-submit"><img src="img/submit.png" alt=""/></button>
					</div>
				</div>
			
				<div id="dvJoinResult">
					<p id="pJoinResultMsg"></p>
					<div id="dvJoinResultBtn"></div>
				</div>
        	</div>
        </div>
    </div>
</div>
