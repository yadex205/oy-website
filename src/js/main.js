/* global p5 */

function composeSketch(s) {
  s.setup = function() {
    s.createCanvas(s.windowWidth, s.windowHeight, s.WEBGL)
  }

  s.draw = function() {
    s.background(0)
  }

  s.windowResized = function() {
    s.resizeCanvas(s.windowWidth, s.windowHeight)
  }
}

document.addEventListener('DOMContentLoaded', function() {
  window.sketch = new p5(composeSketch, 'rir_sketch_wrapper')
})
