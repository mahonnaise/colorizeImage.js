#colorizeImage.js ([Demo](http://kaioa.com/k/test/colorizeImage/demo/demo.html))

*colorizeImage.js* is small library for colorizing product images on the client side. It uses HTML5's `canvas` element if possible and Flash as fallback.

All you need is a white product image, a mask image thereof, and a few hex colors.

![illustration](colorizeImage.js/raw/master/illustration.jpg)

[T-Shirt photo borrowed from [Wikipedia](http://de.wikipedia.org/w/index.php?title=Datei:Wikipedia-T-shirt.jpg&filetimestamp=20060620192619)]

#Usage

##Markup

```html
<div data-base="shirt-base.jpg" data-mask="shirt-mask.jpg" data-swf="../swf/colorizeImage.swf"></div>
```

* `data-base` &ndash; path to the base image
* `data-mask` &ndash; path to the mask image
* `data-swf` &ndash; path to the swf file

##Invocation

```js
window.colorizeImage(element, hex);
```

* `element` &ndash; the DOM node
* `hex` &ndash; a 6 character hex color

#Compatibility

* any recent browser
* IE versions as old as 6 (the demo's CSS doesn't work in IE6)