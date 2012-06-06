package {
	import flash.display.*;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.geom.Rectangle;
	import flash.net.URLRequest;
	import flash.system.LoaderContext;
	import flash.utils.ByteArray;

	public class Main extends Sprite {
		private var W:uint;
		private var H:uint;
		private var buffer:BitmapData;
		private var screen:Bitmap;
		private var loader:Loader;
		private var toLoad:uint;

		public function Main():void {
			if (stage) {
				init();
			} else {
				addEventListener(Event.ADDED_TO_STAGE, init);
			}
		}

		private function init(e:Event = null):void {
			removeEventListener(Event.ADDED_TO_STAGE, init);

			// 1:1 pixels, swf object is as big as the markup says it is
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;

			W = stage.stageWidth;
			H = stage.stageHeight;
			buffer = new BitmapData(W, H, false);
			screen = new Bitmap(buffer);
			addChild(screen);

			if (ExternalInterface.available) {
				ExternalInterface.addCallback("colorize", colorize);
				
				if (root.loaderInfo.parameters.base) {
					colorize(
						root.loaderInfo.parameters.base,
						root.loaderInfo.parameters.mask,
						root.loaderInfo.parameters.hex
					);
				}
			} else {
				// colorize("http://localhost/colorize/shirt-base.jpg", "http://localhost/colorize/shirt-mask.jpg", "778899");
			}
		}

		private function changeColor(base:DisplayObject, mask:DisplayObject, hexColor:String):void {
			var w:uint = base.width;
			var h:uint = base.height;
			var bounds:Rectangle = new Rectangle(0, 0, w, h);
			var baseData:BitmapData = new BitmapData(w, h);
			var maskData:BitmapData = new BitmapData(w, h);

			baseData.draw(base);
			maskData.draw(mask);

			var basePixels:ByteArray = baseData.getPixels(bounds);
			var maskPixels:ByteArray = maskData.getPixels(bounds);
			var compositePixels:ByteArray = new ByteArray();

			basePixels.position = 0;
			maskPixels.position = 0;

			var col:Array = new Array(
				parseInt(hexColor.substr(0, 2), 16) / 255.0,
				parseInt(hexColor.substr(2, 2), 16) / 255.0,
				parseInt(hexColor.substr(4, 2), 16) / 255.0
			);

			for (var y:uint = 0; y < h; y++) {
				for (var x:uint = 0; x < w; x++) {
					compositePixels.writeByte(basePixels.readUnsignedByte()); // alpha
					var m:Number = ((maskPixels.readUnsignedInt() & 0x0000ff00) >> 8) / 255.0; // green channel, image should be gray scale anyhow
					for (var c:uint = 0; c < 3; c++) { // rgb
						var v:uint = basePixels.readUnsignedByte();
						compositePixels.writeByte(
							v * (1.0 - m) + // the part which stays the way it is
							col[c] * v * m // the part which is tinted
						);
					}
				}
			}
			compositePixels.position = 0;
			buffer.setPixels(bounds, compositePixels);
		}

		private function loadImage(url: String, loaded:Function):Loader {
			var loader:Loader = new Loader();
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, loaded);
			loader.load(new URLRequest(url));
			return loader;
		}

		public function colorize(baseImageUrl: String, maskImageUrl: String, hexColor: String):void {
			var baseLoader:Loader;
			var maskLoader:Loader;
			var toLoad:uint = 2;
			var loaded:Function = function(e:Event):void {
				toLoad--;
				if (!toLoad) {
					changeColor(baseLoader.content, maskLoader.content, hexColor);
				}
			};
			baseLoader = loadImage(baseImageUrl, loaded);
			maskLoader = loadImage(maskImageUrl, loaded);
		}
	}
}