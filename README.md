PXLME.js
========

#### Javascript 2D Renderer ####

PXLME (Pixel Me) is an open source framework for dynamic pixel graphics by Tobias Schultka.

### Demos ###

- [Advanced Smiley Demo](<https://rawgithub.com/schultka/pxlme.js/master/demos/smiley.html>)

### Simple Usage ###

```javascript
  // create a simple stage without any arguments
  var stage = new PXLME.Stage({});
```

### Advanced Usage ###

```html
  <div id="pxlme-stage"></div>
```
```javascript
  // define an options object
  var opt = {};
  // set the target ID
  opt.containerId = 'pxlme-stage';
  // set the width and height of the canvas (px)
  opt.width = 800;
  opt.height = 600;
  // set the pixel matrix. 0 is always no pixel
  opt.matrix = [
    "001111100",
    "012222210",
    "122A2A221",
    "122222221",
    "1222A2221",
    "12A222A21",
    "122AAA221",
    "012222210",
    "001111100"
  ];
  // set the colors of the pixels based on your matrix
  opt.colors = {
    '1' : '#00BDE3',
    '2' : '#f3daca',
    'A' : '#d27a8d'
  };
  // set the size of your pixel (px)
  opt.pixelSize = 10;
  // set the speed the pixel is growing the farther the pixel is from start
  opt.pixelSizeRatio = .1;
  // set the maximal pixel size
  opt.pixelSizeMax = 26;
  // set the cursor radius
  opt.cursorRadius = 40;
  // set how fast a pixel escapes if the cursor is nearby
  opt.speedUp = 1.8;
  // set how fast a pixel is going back
  opt.speedDown = .7;
  // set how many percent the speed has after every frame (1 = 100%)
  opt.pixelRubbing = .974;
  // create the stage
  var stage = new PXLME.Stage( opt );
```

This content is released under the (http://opensource.org/licenses/MIT) MIT License.