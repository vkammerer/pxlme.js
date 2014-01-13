// PXLME.JS - v0.2
// Copyright (c) 2013, Tobias Schultka.
// http://tobias-schultka.com
//
// Compiled: 2013-12-29
//
// PXLME.JS is licensed under the MIT License.
// http://www.opensource.org/licenses/mit-license.php

(function(){

var PXLME = PXLME || {};

// set true when Animation is running
var running = false;

// run when move mouse on canvas
var mousemove = function( e, stage ) {

  // set Cursor Position
  var rect = stage.canvas.getBoundingClientRect();
  stage.cursor.x = e.clientX - rect.left;
  stage.cursor.y = e.clientY - rect.top;
  
  // activate Cursor
  stage.cursor.onStage = true;
  
}

// create array of all Stages
var stages = [];

// a Stage represents the the Canvas where the App is rendered on
var Stage = function( data ) {
  
  var self = this;
  
  // set the Container where the Stage will be add to
  if ( typeof data.containerId !== 'undefined' ) {
    var container = document.getElementById( data.containerId );
  } else {
    var container = document.getElementsByTagName( 'body' )[0];
  }
  
  // set width and height
  this.width  = data.width || 320;
  this.height = data.height || 320;
  
  // set cursor radius
  this.cursor = new Cursor( data.cursorRadius );
  
  // set Pixel Acceleration
  this.speedUp   = data.speedUp || 1.3;
  this.speedDown = data.speedDown || .4;
  
  // set Pixel Rubbing
  this.pixelRubbing = data.pixelRubbing || .974;
  
  // set Pixel Size
  this.pixelSize      = data.pixelSize || 5;
  this.pixelSizeMax   = data.pixelSizeMax || 15;
  this.pixelSizeRatio = data.pixelSizeRatio || .1;
  
  // create Canvas and set Width and Height
  this.canvas = document.createElement( 'canvas' );
  this.canvas.width  = this.width;
  this.canvas.height = this.height;
  this.canvas.style.position = 'relative';
  
  // add Canvas to Container and create the 2d context
  container.appendChild( this.canvas );
  this.ctx = this.canvas.getContext('2d');
  
  // check if browser supports event listener
  if ( window.addEventListener ) {
    this.canvas.addEventListener( 'mousemove' , function(e) { mousemove( e, self ); }, false );
  }
  
  // set Pixel Colors
  this.colors = data.colors || {};
  
  // add Pixels
  this.pixels = [];
  
  // set Rows array
  var matrix = data.matrix || [
    "110010101000100010111",
    "101010101000110110100",
    "110001001000101010110",
    "100010101000100010100",
    "100010101110100010111"
  ];

  // set Matrix Size
  this.matrixSize = {
    x : matrix[0].length,
    y : matrix.length
  };
  
  // loop all Pixel array rows
  for ( var y = 0; y < this.matrixSize.y; y++ ) {
  
    // loop all columns
    for ( var x = 0; x < this.matrixSize.x; x++ ) {
    
      // zero is always no Pixel
      if ( matrix[y].charAt(x) != '0' ) {
      
        // create Pixel and push it to Pixels array
        this.pixels.push( 
          new Pixel( x, y, matrix[y].charAt(x), this )
        );
      }
    }
  }
  
  // start Animation Loop when it is the first stage
  if ( !running ) {
    running = true;
    requestAnimFrame( render );
  }

}

// render the Stage
Stage.prototype.render = function() {

  // clear Canvas Stage
  this.ctx.clearRect( 0, 0, this.width, this.height );
  
  // move and render all Pixels
  for ( var i in this.pixels ) {
    
    // set new Pixel position
    this.pixels[i].move();
    
    // render the Pixel
    this.pixels[i].render();
  
  }

}

// a Stage can have multiply Pixels
var Pixel = function( x, y, color, stage ) {
  
  // set Pixel Stage
  this.stage = stage;
  
  // set Pixel Position
  // (half stage) - (half matrix) + (position) + (half pixel for center)
  this.x = ( stage.width  / 2 ) - ( stage.matrixSize.x * stage.pixelSize / 2 ) + ( x * stage.pixelSize ) + Math.floor( stage.pixelSize / 2);
  this.y = ( stage.height / 2 ) - ( stage.matrixSize.y * stage.pixelSize / 2 ) + ( y * stage.pixelSize ) + Math.floor( stage.pixelSize / 2);
  
  // set Pixel Start
  this.start = { x : this.x, y : this.y };
  
  // set Pixel Speed
  this.speed = { x : 0, y : 0 };
  
  // set Pixel Size
  this.z = stage.pixelSize;
  
  // set Pixel Color
  this.color = stage.colors[color] || '#000';
  
  // set Pixel is not moving
  this.isMoving = false;
  
}

// set the new Pixel position
Pixel.prototype.move = function() {

  // get distance if Cursor is on Stage
  if ( this.stage.cursor.onStage ) {
    // get distance between Cursor and Pixel
    var d = distance( this.stage.cursor , this );
  } else {
    // set distace inaccessible
    var d = this.stage.cursor.radius + 100;
  }
  
  // change pixel speed if cursor is nearby
  if ( d < this.stage.cursor.radius ) {

    // escape from the cursor
    this.speed.y += (( this.y - this.stage.cursor.y) * ( d + this.stage.speedUp ) / d ) - ( this.y - this.stage.cursor.y );
    this.speed.x += (( this.x - this.stage.cursor.x) * ( d + this.stage.speedUp ) / d ) - ( this.x - this.stage.cursor.x );
  
    // set is moving true
    this.isMoving = true;

  } else if ( this.isMoving ) {
    
    // go back to start
    this.speed.y -= (( this.y - this.start.y) * ( d + this.stage.speedDown ) / d ) - ( this.y - this.start.y );
    this.speed.x -= (( this.x - this.start.x) * ( d + this.stage.speedDown ) / d ) - ( this.x - this.start.x );
  
    // slow Pixel down
    this.speed.y *= this.stage.pixelRubbing;
    this.speed.x *= this.stage.pixelRubbing;
  }
  
  // set Start Position if Pixel is nearby 
  if (
    distance( this, this.start ) < 1 &&
    distance( this, { x : this.x - this.speed.x, y : this.y - this.speed.y }) < this.stage.speedUp
  ){
    this.speed.y = 0;
    this.speed.x = 0;
    this.y = this.start.y;
    this.x = this.start.x;
    this.isMoving = false;
  }
  
  // move pixels
  this.x += this.speed.x;
  this.y += this.speed.y;
  this.z = this.stage.pixelSize + distance( this, this.start ) * this.stage.pixelSizeRatio;
  if ( this.z > this.stage.pixelSizeMax ){ this.z = this.stage.pixelSizeMax; }

}

// render the Pixel
Pixel.prototype.render = function() {

  // draw Pixels on Canvas
  this.stage.ctx.beginPath();
  this.stage.ctx.rect(
    this.x - this.z / 2, 
    this.y - this.z / 2,
    this.z,
    this.z
  );
  this.stage.ctx.fillStyle = this.color;
  this.stage.ctx.fill();
}

// run a frame and render on canvas
var render = function() {

  // request new frame
  requestAnimFrame( render );
  
  // render all Stages
  for ( var i in stages ) {
    stages[i].render();
  }

}

// every stage can have another cursor
var Cursor = function( radius ) {
  
  this.radius = radius || 30;
  this.x = 0;
  this.y = 0;
  this.onStage = false;
  
}

// get distance between two points
var distance = function( p1, p2 ) {

  // pythagoras
  var xs = p2.x - p1.x;
  var ys = p2.y - p1.y;
  return Math.sqrt(( xs * xs ) + ( ys * ys ));

}

// request a Animation Frame
var requestAnimFrame = 
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ) { window.setTimeout( callback, 1000 / 60 ); }

var addStage = function(opts){
  stages.push( new Stage(opts) );
}

window.PXLME = {
  addStage : addStage
};

}());