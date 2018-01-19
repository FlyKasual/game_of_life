const directions = [
	'nw',
	'n',
	'ne',
	'w',
	'e',
	'sw',
	's',
	'se'
]
const topologies = [
	'bounded dead',
	'bounded living',
	'torus',
	'bottle'
]

class Grid {
	constructor(width = 60, height = 60, timing = 150) {
		this.running = false
		this.interval = null
		this.htmlContainer = document.createElement('div')
		this.htmlContainer.id = 'world'
		this.htmlContainer.style.width = (width * 10 + 2) + 'px'
		document.body.append(this.htmlContainer)
		this.topology = 'torus'
		this.width = width
		this.height = height
		this.area = this.width * this.height
		this.timing = timing
		this.cells = this.createCells(this.area)
		this.startButton = document.createElement('button')
		this.startButton.innerHTML = 'start'
		document.body.append(this.startButton)
		this.startButton.addEventListener('click', e => {
			if (this.running !== true) {
				this.start()
				this.running = true
			}
		})
		this.pauseButton = document.createElement('button')
		this.pauseButton.innerHTML = 'pause'
		document.body.append(this.pauseButton)
		this.pauseButton.addEventListener('click', e => {
			if (this.running === true) {
				this.stop()
				this.running = false
			}
		})
		this.resetButton = document.createElement('button')
		this.resetButton.innerHTML = 'reset'
		document.body.append(this.resetButton)
		this.resetButton.addEventListener('click', e => {
			if (this.running === true) {
				this.stop()
				this.running = false
			}
			this.cells.forEach((cv, i, a) => {
				cv.setState(0)
			})
		})
		this.randomizeButton = document.createElement('button')
		this.randomizeButton.innerHTML = 'randomize'
		document.body.append(this.randomizeButton)
		this.randomizeButton.addEventListener('click', e => {
			this.cells.forEach((cv, i, a) => {
				let rand = Math.floor(Math.random() * 100)
				let state = (rand < 25) ? 1 : 0
				cv.setState(state)
			})
		})
		this.topologySelector = document.createElement('select')
		document.body.append(this.topologySelector)
		topologies.forEach((cv, i, a) => {
			let option = document.createElement('option')
			option.text = cv
			option.value = cv
			this.topologySelector.add(option)
		})
		this.topologySelector.selectedIndex = 2
		this.topologySelector.onchange = () => {
			this.topology = topologies[this.topologySelector.selectedIndex]
		}

	}
	createCells(dimension) {
		let arr = []
		for (let i = 0; i < dimension; ++i) {
			let cell = new Cell(0)
			arr.push(cell)
			this.htmlContainer.append(cell.htmlCell)
		}
		return arr
	}

	countLivingNeighbors(position) {
		let arr = this.getNeighbors(position)
		let sum = 0
		arr.forEach((cv, i, a) => {
			sum += cv.state
		})
		return sum
	}

	getNeighbors(position) {
		let arr = []
		directions.forEach((cv, i, a) => {
			let elementToPush = this.getNeighborByDirection(position, cv)
			if (!elementToPush) {
				console.warn('Position: ', position, '\nDirection: ', cv, '\nCrrent position: x' , this.getCoords(position).x, 'y: ', this.getCoords(position).y)
			}
			arr.push(this.getNeighborByDirection(position, cv))
		})
		return arr
	}

	getNeighborByDirection(position, direction) { // TODO set by constant
		switch (this.topology) {
			case 'bounded dead':
				return this.getNeighborByDirectionInBoundedDeadTopology(position, direction)
			case 'bounded living':
				return this.getNeighborByDirectionInBoundedLivingTopology(position, direction)
			case 'bottle':
				return this.getNeighborByDirectionInKleinBottleTopology(position, direction)
			default:
				return this.getNeighborByDirectionInToralTopology(position, direction)
		}

	}

	getNextStateForCell(position) {
		let numberOfLivingNeighbors = this.countLivingNeighbors(position)
		if (this.cells[position].state === 0 && numberOfLivingNeighbors === 3) {
			return 1
		}		
		if (this.cells[position].state === 1 && (numberOfLivingNeighbors < 2 ||
				numberOfLivingNeighbors > 3)) {
			return 0
		}
		return this.cells[position].state
	}

	prepareNextState() {
		this.cells.forEach((cv, i, a) => {
			cv.nextState = this.getNextStateForCell(i)
		})
	}

	updateGrid() {
		this.prepareNextState()
		this.cells.forEach((cv, i, a) => {
			cv.update()
		})
	}

	start() {
		this.interval = window.setInterval(() => {
			this.updateGrid()
		}, this.timing)
	}

	stop() {
		let _this = this
		window.clearInterval(_this.interval)
		this.interval = null
	}

	getIndex(x, y) {
		return x + y * this.width
	}

	getCoords(ind) {
		let x = ind % this.width
		let y = (ind - x) / this.width
		return {
			x: x,
			y: y
		}
	}

	getNeighborByDirectionInToralTopology(position, direction) {
		let currentPosition = this.getCoords(position)
		switch (direction) {
			case 'nw':
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, (currentPosition.y  + this.height - 1) % this.height)]
			case 'n':
				return this.cells[this.getIndex(currentPosition.x, (currentPosition.y  + this.height - 1) % this.height)]
			case 'ne':
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, (currentPosition.y  + this.height - 1) % this.height)]
			case 'w':
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, currentPosition.y)]
			case 'e':
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, currentPosition.y)]
			case 'sw':
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, (currentPosition.y + this.height + 1) % this.height)]
			case 's':
				return this.cells[this.getIndex(currentPosition.x, (currentPosition.y + this.height + 1) % this.height)]
			case 'se':
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, (currentPosition.y + this.height + 1) % this.height)]
		}
	}

	getNeighborByDirectionInBoundedDeadTopology(position, direction) {
		let currentPosition = this.getCoords(position)
		switch (direction) {
			case 'nw':
				if (currentPosition.x === 0 || currentPosition.y === 0) {
					return new Cell(0)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, (currentPosition.y  + this.height - 1) % this.height)]
			case 'n':
				if (currentPosition.y === 0) {
					return new Cell(0)
				}
				return this.cells[this.getIndex(currentPosition.x, (currentPosition.y  + this.height - 1) % this.height)]
			case 'ne':
				if (currentPosition.x === this.width - 1 || currentPosition.y === 0) {
					return new Cell(0)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, (currentPosition.y  + this.height - 1) % this.height)]
			case 'w':
				if (currentPosition.x === 0) {
					return new Cell (0)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, currentPosition.y)]
			case 'e':
				if (currentPosition.x === this. width - 1) {
					return new Cell(0)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, currentPosition.y)]
			case 'sw':
				if (currentPosition.x === 0 || currentPosition.y === this.height - 1) {
					return new Cell(0)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, (currentPosition.y + this.height + 1) % this.height)]
			case 's':
				if (currentPosition.y === this.height - 1) {
					return new Cell(0)
				}
				return this.cells[this.getIndex(currentPosition.x, (currentPosition.y + this.height + 1) % this.height)]
			case 'se':
				if (currentPosition.x === this.width - 1 || currentPosition.y === this.height -1) {
					return new Cell(0)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, (currentPosition.y + this.height + 1) % this.height)]
		}
	}
	getNeighborByDirectionInBoundedLivingTopology(position, direction) {
		let currentPosition = this.getCoords(position)
		switch (direction) {
			case 'nw':
				if (currentPosition.x === 0 || currentPosition.y === 0) {
					return new Cell(1)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, (currentPosition.y  + this.height - 1) % this.height)]
			case 'n':
				if (currentPosition.y === 0) {
					return new Cell(1)
				}
				return this.cells[this.getIndex(currentPosition.x, (currentPosition.y  + this.height - 1) % this.height)]
			case 'ne':
				if (currentPosition.x === this.width - 1 || currentPosition.y === 0) {
					return new Cell(1)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, (currentPosition.y  + this.height - 1) % this.height)]
			case 'w':
				if (currentPosition.x === 0) {
					return new Cell (1)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, currentPosition.y)]
			case 'e':
				if (currentPosition.x === this. width - 1) {
					return new Cell(1)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, currentPosition.y)]
			case 'sw':
				if (currentPosition.x === 0 || currentPosition.y === this.height - 1) {
					return new Cell(1)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, (currentPosition.y + this.height + 1) % this.height)]
			case 's':
				if (currentPosition.y === this.height - 1) {
					return new Cell(1)
				}
				return this.cells[this.getIndex(currentPosition.x, (currentPosition.y + this.height + 1) % this.height)]
			case 'se':
				if (currentPosition.x === this.width - 1 || currentPosition.y === this.height -1) {
					return new Cell(1)
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, (currentPosition.y + this.height + 1) % this.height)]
		}
	}

	getNeighborByDirectionInKleinBottleTopology(position, direction) {
		let currentPosition = this.getCoords(position)
		switch (direction) {
			case 'nw':
				if (currentPosition.y === 0) {
					return this.cells[this.getIndex((this.width - currentPosition.x) % this.width, this.height - 1)]
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, currentPosition.y  - 1)]
			case 'n':
				if (currentPosition.y === 0) {
					return this.cells[this.getIndex(this.width - 1 - currentPosition.x, this.height - 1)]
				}
				return this.cells[this.getIndex(currentPosition.x, currentPosition.y  - 1)]
			case 'ne':
				if (currentPosition.y === 0) {
					return this.cells[this.getIndex((2 * this.width - currentPosition.x - 2) % this.width, this.height - 1)]
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, currentPosition.y  - 1)]
			case 'w':
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, currentPosition.y)]
			case 'e':
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, currentPosition.y)]
			case 'sw':
				if (currentPosition.y === this.height - 1) {
					return this.cells[(this.width - currentPosition.x) % this.width]
				}
				return this.cells[this.getIndex((currentPosition.x + this.width - 1) % this.width, currentPosition.y + 1)]
			case 's':
				if (currentPosition.y === this.height - 1) {
					return this.cells[this.width - 1 - currentPosition.x]
				}
				return this.cells[this.getIndex(currentPosition.x, currentPosition.y + 1)]
			case 'se':
				if (currentPosition.y === this.height - 1) {
					return this.cells[(2 * this.width - currentPosition.x - 2) % this.width]
				}
				return this.cells[this.getIndex((currentPosition.x + this.width + 1) % this.width, currentPosition.y + 1)]
		}
	}
}