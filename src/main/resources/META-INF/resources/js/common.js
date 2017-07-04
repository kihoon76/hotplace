/**
 * 
 */
var common = function(){
	
	function Enum() {}
	Enum.HttpMethod = {GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'};
	Enum.PATH = 'http://192.168.0.48:8080/'; //'http://hotplace.ddns.net:8080/', //
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
						//if(common.view.isActiveMask()) common.view.showMask();
						
						if(params.beforeSend && typeof params.beforeSend === 'function') {
							params.beforeSend();
						}
					},
					contentType: params.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
					dataType: params.dataType || 'json',
					method: params.method || common.model.Enum.HttpMethod.POST,
					complete: function() {
						console.log("###### Ajax Completed ######");
						//var hideMask = (params.hideMask == undefined)?true:params.hideMask;
						
						//if(common.view.isActiveMask() && hideMask) common.view.hideMask();
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
		view: {},
		controller: {},
		err:		{}
	}
}();