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
  };

  Mover.prototype.setup = function() {
    // this.width = 30;
    // this.height = 30;

    this.position = new Vector(0,0).toPoint();
    this.velocity = new Vector(0,0);
  };

  Mover.prototype.update = function() {
    _super.prototype.update.call(this);

    var p = this.position.toVector();

    var deltaVelocity = new Vector(this.velocity.x * this.deltaTime, this.velocity.y * this.deltaTime);

    p.add(deltaVelocity);

    // if (p.x > this.canvasWidth) {
    //   p.x = 0;
    // } else if (p.x < 0) {
    //   p.x = this.canvasWidth;
    // } if (p.y > this.canvasHeight) {
    //   p.y = 0;
    // } else if (p.y < 0) {
    //   p.y = this.canvasHeight;
    // }

    this.position = p.toPoint();
  };

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
  };

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
  };

  return Mover;

}(etch.drawing.DisplayObject));

$(function(){
  var manifest = $.getJSON('http://dms-data.stanford.edu/data/manifests/BnF/jr903ng8662/manifest.json', function(json) {
    var leftToRightIndividualsLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'left-to-right',
      viewingMode: 'individuals',
      canvasHeight: 100,
      canvasWidth: 100,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('left-right-individuals-overview',
                        leftToRightIndividualsLayouts.overview());
    renderLayoutDiagram('left-right-individuals-intermediate',
                        leftToRightIndividualsLayouts.intermediate());
    renderLayoutDiagram('left-right-individuals-detail',
                        leftToRightIndividualsLayouts.detail());


    var leftToRightPagedLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'left-to-right',
      viewingMode: 'paged',
      canvasHeight: 100,
      canvasWidth: 100,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('left-right-paged-overview',
                        leftToRightPagedLayouts.overview());
    renderLayoutDiagram('left-right-paged-intermediate',
                        leftToRightPagedLayouts.intermediate());
    renderLayoutDiagram('left-right-paged-detail',
                        leftToRightPagedLayouts.detail());

    var leftToRightContinuousLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      // viewingDirection: userState.viewingDirection,
      viewingMode: 'continuous',
      canvasHeight: 100,
      canvasWidth: 100,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 50,
        right: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('left-right-continuous-overview',
                        leftToRightContinuousLayouts.overview());
    renderLayoutDiagram('left-right-continuous-intermediate',
                        leftToRightContinuousLayouts.intermediate());
    renderLayoutDiagram('left-right-continuous-detail',
                        leftToRightContinuousLayouts.detail());
  });

});

var getLayoutBoundingBox = function(layout) {

  var maxX = -Infinity,
      maxY = -Infinity,
      minX = Infinity,
      minY = Infinity;

  layout.forEach(function(frame){
    if ( frame.x < minX) minX = frame.x;
    if ( frame.y < minY) minY = frame.y;
    if ( frame.x + frame.width > maxX) {
      maxX = frame.x + frame.width;
    }
    if ( frame.y + frame.height > maxY) {
      maxY = frame.y + frame.height;
    }
  });

  // Get a box that contains the topLeftmost
  // topRightmost canvas of the selection.
  // Will need to be updated for viewingDirections.

  // Calculate a bounding box for the complete layout.
  var layoutBBWidth = maxX + Math.abs(minX),
      layoutBBHeight = maxY + Math.abs(minY);

  return {
    x: minX,
    y: minY,
    width: layoutBBWidth,
    height: layoutBBHeight
  };
};

function renderLayoutDiagram(elemId, layout) {
  var canvas = new etch.drawing.Canvas(document.getElementById(elemId)),
      canvasMargin = 20,
      layoutBoundingBox = getLayoutBoundingBox(layout);

  console.log(layoutBoundingBox);

  canvas.style.backgroundColor = '#FFF';
  canvas.width = 400;
  canvas.height = canvas.width/(layoutBoundingBox.width/layoutBoundingBox.height);

  if (canvas.height < 40) {
    canvas.width = window.innerWidth -50;
    canvas.height = canvas.width/(layoutBoundingBox.width/layoutBoundingBox.height) +
      canvasMargin*2;
  }

  var mainScene = new MainScene();
  mainScene.init(canvas);

  // This ensures we can view the entire sceneGraph
  // in the example canvas as a kind of "minimap".
  // The layout is a function of the aspect ratio
  // of the viewport object, an optional anchor
  // coordinate pair and the dimensions of the
  // canvases themselves.

  var scaleFactor = (canvas.width - canvasMargin*2)/layoutBoundingBox.width;

  // Draw canvases
  layout.forEach(function(frame) {
    var x  = frame.canvas.x,
        y = frame.canvas.y,
        width = frame.canvas.width,
        height = frame.canvas.height;

    var mover = new Mover();
    mover.init(mainScene);
    mainScene.displayList.add(mover);
    mover.position.x = (x + Math.abs(layoutBoundingBox.x))*scaleFactor + canvasMargin;
    mover.position.y = (y + Math.abs(layoutBoundingBox.y))*scaleFactor + canvasMargin;
    mover.width = width*scaleFactor;
    mover.height = height*scaleFactor;
  });


  // Draw viewport

}

// setTimeout(function() {
//   var totalHeaderHeight = 0,
//       windowCache = $(window),
//       cloneContainer = $('<div class="cloneContainer"></div>').appendTo('body');

//       cloneContainer.css({
//         position: 'fixed',
//         top: 0,
//         background: 'white',
//         width: '100%'
//       });

//       var headingCache = $('h2,h3,h4,h5').toArray().map(function(heading) {
//         var $heading = $(heading),
//             clone = $heading.clone().appendTo('.cloneContainer');

//         clone.css({
//           top: 0,
//           display: 'none',
//           background: 'white',
//           position: 'absolute',
//           width: '100%'
//         });

//         return {
//           type: $heading.prev().prop('nodeName'),
//           top: $heading.position().top,
//           bottom: $heading.position().top + $heading.outerHeight(),
//           height: $heading.outerHeight(),
//           realElement: $heading,
//           dummyElement: clone,
//           stuck: false
//         };
//       });

//   var updateClones = function(headingCache, scrollTop) {
//     headingCache.forEach(function(heading){
//       if (heading.stuck) {
//         if (scrollTop + totalHeaderHeight < heading.bottom) {
//           heading.dummyElement.css('display', 'none');
//           heading.stuck = false;
//           totalHeaderHeight -= heading.height;
//         }
//       } else {
//         if ((scrollTop + totalHeaderHeight) > heading.top) {

//           heading.dummyElement.css({
//             display: 'block',
//             top: totalHeaderHeight
//           });

//           if (!heading.stuck) {
//             heading.stuck = true;
//             totalHeaderHeight += heading.height;
//           }
//         } else {

//           heading.dummyElement.css('display', 'none');

//           if (heading.stuck) {
//             heading.stuck = false;
//             totalHeaderHeight -= heading.height;
//           }
//         }
//       }
//     });
//   };

//   $(window).on('scroll', function(event) {
//     // If scrollHeight is past the top of
//     // an h1 tag, clone it and stick the clone.
//     // Then increase the header height.
//     updateClones(
//       headingCache,
//       windowCache.scrollTop()
//     );
//   });
// }, 1000);
