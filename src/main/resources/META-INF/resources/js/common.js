/**
 * 
 */
var common = function(){
	
	function Enum() {}
	Enum.HttpMethod = {GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'};
	Enum.PATH = 'http://hotplace.ddns.net:8080/', 
	Enum.SecurityError = {ID: 'ID', PW: 'PW', AUTH: 'AUTH', ETC: 'ETC'}
	Enum.Alert = {SUCCESS: 'success', INFO: 'info', WARNING: 'warning', DANGER: 'danger'}
	
	jQuery.browser = {};
	/*jQuery.browser() removed

	The jQuery.browser() method has been deprecated since jQuery 1.3 and is removed in 1.9.
	If needed, it is available as part of the jQuery Migrate plugin.
	We recommend using feature detection with a library such as Modernizr.
	*/
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
	
	return {
		model: {
			ajax: function(params) {
				$.ajax(Enum.PATH + params.url, {
					async: (params.async == null)? true : params.async,
					beforeSend: function(xhr) {
						if(common.view.isActiveMask()) common.view.showMask();
						
						if(params.beforeSend && typeof params.beforeSend === 'function') {
							params.beforeSend();
						}
					},
					contentType: params.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
					dataType: params.dataType || 'json',
					method: params.method || common.model.Enum.HttpMethod.POST,
					complete: function() {
						console.log("###### Ajax Completed ######");
						var hideMask = (params.hideMask == undefined)?true:params.hideMask;
						
						if(common.view.isActiveMask() && hideMask) common.view.hideMask();
					},
					context: params.context || document.body,
					data: params.data,
					statusCode: {
						404: function() {
							console.log('Page not found');
						}
					},
					success: function(data, textStatus, jqXHR) {
						if(!params.success || typeof params.success !== 'function') {
							throw new Error('success function not defined');
						}
						
						params.success(data, textStatus, jqXHR);
					},
					error: function(jqXHR, textStatus, e) {
						if(!params.error || typeof params.error !== 'function') {
							//Default 동작
						}
						else {
							params.error(jqXHR, textStatus, e);
						}
					},
					timeout: params.timeout || 2000
				});
			},
			getJson : function(url, params, succ) {
				common.model.ajax({
					url : url,
					method: common.model.Enum.HttpMethod.GET,
					data: params || {},
					success : function(data, textStatus, jqXHR) {
						succ(data);
					},
					error : function() {
						
					}
				});
			},
			getPlainText: function(url, param, succ) {
				
				common.model.ajax({
					url: url,
					method: common.model.Enum.HttpMethod.GET,
					dataType: 'text',
					data: param || {},
					success: function(data, textStatus, jqXHR) {
						var jo = common.model.parseJSON(data);
						succ(jo);
					},
					error:function() {
						
					}
				});
			},
			getPlainTextFromJson: function(url, param, succ) {
				common.model.ajax({
					url: url,
					method: common.model.Enum.HttpMethod.POST,
					dataType: 'text',
					contentType: 'application/json; charset=UTF-8',
					data: param || {},
					success: function(data, textStatus, jqXHR) {
						var jo = common.model.parseJSON(data);
						succ(jo);
					},
					error:function() {
						
					}
				});
			},
			Enum: Enum,
			isNull: function($el) {
				return ($el.get(0) == undefined);
			},
			isNotNull: function($el) {
				return !common.model.isNull($el)
			},
			parseJSON : function(src) {
				var obj;
				try {
					console.log("##############################");
					console.log("json string");
					console.log("------------------------------")
					console.log(src);
					obj = $.parseJSON(src);
				}
				catch(e) {
					console.log(e);
					throw e;
				}
				
				console.log("##############################");
				return obj;
			}
		},
		view: function(){
			var loadmask = false;
			var $loadEl;
			var loadTxt = 'Please wait...';
			var loadEffects = {
					bounce: 'bounce',
					rotateplane: 'rotateplane',
					stretch: 'stretch',
					orbit: 'orbit',
					roundBounce: 'roundBounce',
					win8: 'win8',
					win8_linear: 'win8_linear',
					ios: 'ios',
					facebook: 'facebook',
					rotation: 'rotation',
					timer: 'timer',
					pulse: 'pulse',
					progressBar: 'progressBar',
					bouncePulse: 'bouncePulse'
			};
			
			function run_waitMe(num, effect){
				//https://github.com/vadimsva/waitMe/blob/gh-pages/index.html
				fontSize = '';
				switch (num) {
					case 1:
					maxSize = '';
					textPos = 'vertical';
					fontSize = '25px';
					break;
					case 2:
					loadTxt = '';
					maxSize = 30;
					textPos = 'vertical';
					break;
					case 3:
					maxSize = 30;
					textPos = 'horizontal';
					fontSize = '18px';
					break;
				}
				
				$loadEl.waitMe({
					effect: effect,
					text: loadTxt,
					bg: 'rgba(255,255,255,0.4)',
					color: '#000',
					maxSize: maxSize,
					source: 'img.svg',
					textPos: textPos,
					fontSize: fontSize,
					onClose: function() {}
				});
			}
			
			return {
				isActiveMask: function() {
					return loadmask;
				},
				enableLoadMask: function(cfg) {
					loadmask = true;
					$loadEl = cfg.el || $('body');
					loadTxt = cfg.msg || loadTxt; 
				},
				showMask: function() {
					if(loadmask) {
						run_waitMe(1, loadEffects.timer);
					}
				},
				hideMask: function() {
					if(loadmask) {
						$loadEl.waitMe('hide');
					}
				},
			}
		}(),
		controller: {},
		err:		{}
	}
}();