var pegs = []
function Peg (x) {
  this.x = x
  this.y = 480
  this.width = 1
  this.height = 20
  this.label = Math.round(262 - Math.abs(x + 12.5 - 250))
  this.labelX = x + 10
  this.labelY = 485
}

function makePegsObject () {
  for (let i = 0; i <= 500; i += 25) {
    let peg = new Peg(i)
    pegs.push(peg)
  }
}

function makePegElements () {
  let svg = document.getElementById('svg-main')
  pegs.forEach(function (peg) {
    let newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    newRect.setAttribute('x', peg.x)
    newRect.setAttribute('y', peg.y)
    newRect.setAttribute('height', peg.height)
    newRect.setAttribute('width', peg.width)
    svg.appendChild(newRect)
  })
}

function makePegLabels () {
  let svg = document.getElementById('svg-main')
  pegs.forEach(function (peg) {
    let newLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    let labelText = document.createTextNode(peg.label)
    newLabel.setAttribute('x', peg.labelX)
    newLabel.setAttribute('y', peg.labelY)
    newLabel.setAttribute('text-anchor', 'middle')
    newLabel.setAttribute('transform', 'rotate(90 ' + peg.labelX + ',' + peg.labelY + ')')
    newLabel.appendChild(labelText)
    svg.appendChild(newLabel)
  })
}

var pins = {}
function Pin (x, y) {
  this.cx = x
  this.cy = y
  this.radius = 2
}
function makePinObject () {
  let x = 30
  for (let i = 100; i <= 430; i += 30) {
    let y = i
    if ((i - 100) % 60 === 0) { x = 30 } else (x = 60)
    pins[y] = []
    while (x <= 500) {
      pins[y].push(new Pin(x, y))
      x += 60
    }
  }
}

function makePinElements () {
  let svg = document.getElementById('svg-main')
  for (row in pins) {
    for (let i = 0; i < pins[row].length; i++) {
      let newPin = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      newPin.setAttribute('cx', pins[row][i].cx)
      newPin.setAttribute('cy', pins[row][i].cy)
      newPin.setAttribute('r', pins[row][i].radius)
      svg.appendChild(newPin)
    }
  }
}
var puck = {
  elem: document.getElementById('puck'),
  get x () { return Number(this.elem.getAttribute('cx')) },
  set x (newX) { this.elem.setAttribute('cx', newX) },
  get y () { return Number(this.elem.getAttribute('cy')) },
  set y (newY) { this.elem.setAttribute('cy', newY) },
  get radius () { return this.elem.getAttribute('r') },
  velX: 0,
  velY: 0
}

window.onload = function () {
  makePegsObject()
  makePegElements()
  makePegLabels()
  makePinObject()
  makePinElements()
}

var game = {
  isRunning: false,
  gravity: function () {
    function addGravity () {
      if (game.isRunning) {
        setTimeout(function () {
          puck.velY += 0.5
          addGravity()
        }, 100)
      }
    }
    addGravity()
  },
  movePuck: function () {
    puck.y += puck.velY
    puck.x += puck.velX
  },
  runGame: function () {
    function run () {
      if (game.isRunning) {
        setTimeout(function () {
          game.movePuck()
          run()
        }, 17)
      }
    }
    run()
  },
  dropPuck: function () {
    this.isRunning = true
    this.runGame()
    this.gravity()
  }
}

document.getElementById('svg-main').addEventListener('mousemove', function (e) {
  if (e.y <= 95 && !game.isRunning) {
    puck.x = e.x - 10
    puck.y = e.y - 10
  }
})

document.getElementById('svg-main').addEventListener('click', function () { game.dropPuck() })
