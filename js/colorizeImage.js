/*! github.com/mahonnaise/colorizeImage.js */
/*jslint plusplus:false, browser:true*/
(function () {
	var canvasColorize, ctx, baseImage, maskImage, toLoad, loaded, changeColor;

	canvasColorize = function (canvas, base, mask, hex) {
		var tint, toLoad, loaded;

		tint = function (canvas, hex) {
			var w, h, x, y, c, o, i, m, baseData, maskData, composite, compositeData, col, ctx;

			ctx = canvas.getContext('2d');

			col = [
				parseInt(hex.substr(0, 2), 16) / 255,
				parseInt(hex.substr(2, 2), 16) / 255,
				parseInt(hex.substr(4, 2), 16) / 255
			];

			w = canvas.width;
			h = canvas.height;

			ctx.drawImage(baseImage, 0, 0);
			baseData = ctx.getImageData(0, 0, w, h).data;

			ctx.drawImage(maskImage, 0, 0);
			maskData = ctx.getImageData(0, 0, w, h).data;

			composite = ctx.createImageData(w, h);
			compositeData = composite.data;

			for (y = 0; y < h; y++) {
				for (x = 0; x < w; x++) {
					o = (y * w + x) * 4;
					m = maskData[o + 1] / 255; // green channel, image should be gray scale anyhow
					for (c = 0; c < 3; c++) { // rgb
						i = o + c;
						compositeData[i] = baseData[i] * (1 - m) + // the part which stays the way it is
							col[c] * baseData[i] * m; // the part which is tinted
					}
					compositeData[o + 3] = baseData[o + 3]; // alpha
				}
			}

			ctx.putImageData(composite, 0, 0);
		};

		loaded = function () {
			toLoad--;
			if (!toLoad) {
				tint(canvas, hex);
			}
		};

		toLoad = 2;
		baseImage = new Image();
		maskImage = new Image();

		baseImage.onload = loaded;
		maskImage.onload = loaded;

		baseImage.src = base;
		maskImage.src = mask;
	};

	window.colorizeImage = function (element, hex) {
		var isCanvasSupported, base, mask, swfFile, w, h, getSub, canvas, swf;

		base = element.getAttribute('data-base');
		mask = element.getAttribute('data-mask');
		swfFile = element.getAttribute('data-swf');

		w = element.clientWidth;
		h = element.clientHeight;

		isCanvasSupported = function () {
			var c = document.createElement('canvas');
			return !!c.getContext && c.getContext('2d');
		};

		getSub = function (markup) {
			if (!element.childNodes.length) {
				element.innerHTML = markup();
			}
			return element.childNodes[0];
		};

		if (isCanvasSupported()) {
			canvas = getSub(function () {
				return '<canvas width="' + w + '" height="' + h + '"></canvas>';
			});
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
			canvasColorize(canvas, base, mask, hex);
		} else {
			swf = getSub(function () {
				var swfLink, id;
				swfLink = swfFile + '?base=' + encodeURIComponent(base) + '&' + 'mask=' + encodeURIComponent(mask) + '&' + 'hex=' + encodeURIComponent(hex);
				// The object node absolutely needs an id, otherwise Flash's external interface stuff will not work in IE.
				do {
					id = 'swf-' + String(Math.random()).slice(2);
				} while (document.getElementById(id));
				return '<object id="' + id + '" type="application/x-shockwave-flash" width="' + w + '" height="' + h + '" data="' + swfLink + '"><param name="movie" value="' + swfLink + '"/></object>';
			});
			if (swf.colorize) {
				swf.colorize(base, mask, hex);
			}
		}
	};
}());