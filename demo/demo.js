/*jslint browser:true*/
window.onload = function () {
	var swatches, container;

	swatches = document.getElementById('swatches-1');
	container = document.getElementById(swatches.getAttribute('data-target'));

	swatches.onclick = function (e) {
		var event = e || window.event,
			target = event.target || event.srcElement,
			hexColor;
		if (target.nodeName !== 'BUTTON') {
			return;
		}
		hexColor = target.getAttribute('data-color');
		window.colorizeImage(container, hexColor);
	};

	window.colorizeImage(container, 'ffffff');
};