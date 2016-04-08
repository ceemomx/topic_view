var API_URL = 'http://127.0.0.1:3001/';
var utils = {
	alert: function (content, extraClass, callback) {
		var toastClass = extraClass || '';
		var toastDiv = $('<div class="toast-container" style="display: none;"><span class="toast ' + toastClass + '">' + content + '</span></div>');
		$('.toast-container').remove();
		$('body').append(toastDiv);
		toastDiv.fadeIn(200);
		var timer = setTimeout(function () {
			toastDiv.fadeOut(200, function () {
				toastDiv.remove();
				callback && callback();
				clearTimeout(timer);
			});
		}, 1500);
	}
};