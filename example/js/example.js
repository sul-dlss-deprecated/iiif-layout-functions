
var __extends = (this && this.__extends) || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Vector = etch.primitives.Vector;

var MainScene = (function(_super){
  __extends(MainScene, _super);

  function MainScene() {
    _super.apply(this, arguments);
  }

  return MainScene;
}(etch.drawing.Stage));

var Mover = (function(_super){
  __extends(Mover, _super);
  
  function Mover() {
    _super.apply(this, arguments);
  }

  Mover.prototype.init = function(drawTo, drawFrom) {
    _super.prototype.init.call(this, drawTo, drawFrom);
  }

  Mover.prototype.setup = function() {
    // this.width = 30;
    // this.height = 30;

    this.position = new Vector(0,0).toPoint();
    this.velocity = new Vector(0,0);
  }
  
  Mover.prototype.update = function() {
    _super.prototype.update.call(this);

    var p = this.position.toVector();

    var deltaVelocity = new Vector(this.velocity.x * this.deltaTime, this.velocity.y * this.deltaTime);
    
    p.add(deltaVelocity);

    if (p.x > this.canvasWidth) {
      p.x = 0;
    } else if (p.x < 0) {
      p.x = this.canvasWidth;
    } if (p.y > this.canvasHeight) {
      p.y = 0;
    } else if (p.y < 0) {
      p.y = this.canvasHeight;
    }

    this.position = p.toPoint();
  }

  Mover.prototype.draw = function() {
    _super.prototype.draw.call(this);
    // if this is the first frame of the mover, and it has a display cache that hasn't been drawn to yet.
    // draw to the display cache.
    if (this.isFirstFrame() && this.drawFrom && !this.drawFrom.isCached) {
      // draw to cache
      this.drawFrom.width = this.width;
      this.drawFrom.height = this.height;
      this.drawToCtx(this.drawFrom.ctx);
      this.drawFrom.isCached = true; // no other movers will draw to the cache
    } if (this.drawFrom) {
      // draw from cache
      this.ctx.drawImage(this.drawFrom.htmlElement, this.position.x, this.position.y);
    } else {
      // draw each frame
      this.drawToCtx(this.ctx);
    }
  }

  Mover.prototype.drawToCtx = function(ctx) {
    ctx.moveTo(this.position.x, this.position.y);
    ctx.fillStyle = "#FF00FF";
    ctx.beginPath();
    // if (this.drawFrom) {
    //   ctx.beginPath();
    //   ctx.moveTo(this.width / 2, 0);
    //   ctx.lineTo(this.width, this.height / 2);
    //   ctx.lineTo(this.width / 2, this.height);
    //   ctx.lineTo(0, this.height / 2);
    //   ctx.closePath();
    //   ctx.fill();
    // } else {
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.position.x + this.width, this.position.y);
      ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
      ctx.lineTo(this.position.x, this.position.y + this.height);
      ctx.closePath();
      ctx.fill();
    // }
    ctx.closePath();
    ctx.fill();
  }

  return Mover;

}(etch.drawing.DisplayObject));

$(function(){
  var manifest = $.getJSON('http://dms-data.stanford.edu/data/manifests/BnF/jr903ng8662/manifest.json', function(json) {
    var layout = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: canvas.width,
      height: canvas.height,
      // scaleFactor: userState.scaleFactor,
      // viewingDirection: userState.viewingDirection,
      // viewingMode: userState.viewingMode,
      canvasHeight: 100,
      canvasWidth: 100,
      // selectedCanvas: userState.selectedCanvas,
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    }).overview();

    console.log(layout.length);
    layout.forEach(function(frame) {
      console.log(frame);
      var x  = frame.canvas.x,
          y = frame.canvas.y,
          width = frame.canvas.width,
          height = frame.canvas.height;

      var mover = new Mover();
      mover.init(mainScene);
      mainScene.displayList.add(mover);
      mover.position.x = x/2;
      mover.position.y = y/2;
      mover.width = width/2;
      mover.height = height/2;
    });
  });

  var canvas = new etch.drawing.Canvas();
  canvas.style.backgroundColor = '#FFF';
  canvas.width = 1024;
  canvas.height = 768;

  var mainScene = new MainScene();

  mainScene.init(canvas);

  mainScene.drawn.on((s, time) => {
    //console.log(time);
  }, this);

  var moverCache = new etch.drawing.Canvas();
  moverCache.hide();

});
