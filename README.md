#colorizeImage.js

*colorizeImage.js* is small library for colorizing product images on the client side. It uses HTML5's `canvas` element if possible and Flash as fallback.

It needs a picture of a white version of the product, a mask image, and a color (hex).

![illustration](colorizeImage.js/raw/master/illustration.jpg)

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