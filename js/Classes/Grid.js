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

class Grid {
	constructor(dimension = 60, timing = 10) {
		this.running = false
		this.interval = null
		this.htmlContainer = document.createElement('div')
		this.htmlContainer.id = 'world'
		document.body.append(this.htmlContainer)
		this.dimension = dimension
		this.timing = timing
		this.cells = this.createCells(this.dimension)
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
	}
	createCells(dimension) {
		let arr = []
		for (let i = 0; i < dimension ** 2; ++i) {
			let cell = new Cell()
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
			arr.push(this.getNeighborByDirection(this.cells[position], cv))
		})
		return arr
	}

	getNeighborByDirection(cell, direction) {
		let position = this.cells.indexOf(cell)
		switch (direction) {
			case 'nw':
				if (position === 0) {
					return this.cells[this.cells.length - 1]
				}
				if (position < this.dimension) {
					return this.cells[position + this.cells.length - this.dimension - 1]
				}
				if (position % this.dimension === 0) {
					return this.cells[position - 1]
				}
				return this.cells[position - this.dimension - 1]
			case 'n':
				if (position < this.dimension) {
					return this.cells[position + this.cells.length - this.dimension]
				}
				return this.cells[position - this.dimension]
			case 'ne':
				if (position === this.dimension - 1) {
					return this.cells[this.cells.length - this.dimension]
				}
				if (position < this.dimension) {
					return this.cells[position + this.cells.length - this.dimension + 1]
				}
				if (position % this.dimension === this.dimension - 1) {
					return this.cells[position - 2 * this.dimension + 1]
				}
				return this.cells[position - this.dimension + 1]
			case 'w':
				if (position % this.dimension === 0) {
					return this.cells[position + this.dimension - 1]
				}
				return this.cells[position - 1]
			case 'e':
				if (position % this.dimension === this.dimension - 1) {
					return this.cells[position - this.dimension + 1]
				}
				return this.cells[position + 1]
			case 'sw':
				if (position === this.dimension ** 2 - this.dimension) {
					return this.cells[this.dimension - 1]
				}
				if (position >= this.dimension ** 2 - this.dimension) {
					return this.cells[position - this.dimension ** 2 + this.dimension - 1]
				}
				if (position % this.dimension === 0) {
					return this.cells[position + 2 * this.dimension - 1]
				}
				return this.cells[position + this.dimension - 1]
			case 's':
				if (position >= this.dimension ** 2 - this.dimension) {
					return this.cells[position - this.dimension ** 2 + this.dimension]
				}
				return this.cells[position + this.dimension]
			case 'se':
				if (position === this.dimension ** 2 - 1) {
					return this.cells[0]
				}
				if (position >= this.dimension ** 2 - this.dimension) {
					return this.cells[position - this.dimension ** 2 + this.dimension + 1]
				}
				if (position % this.dimension === this.dimension - 1) {
					return this.cells[position + 1]
				}
				return this.cells[position + this.dimension + 1]
		}
	}

	getNextStateForCell(position) {
		let numberOfLivingNeighbors = this.countLivingNeighbors(position)
		switch (this.cells[position].state) {
			case 0:
				if (numberOfLivingNeighbors === 3) {
					return 1
				}
				break
			case 1:
				if (numberOfLivingNeighbors < 2 || numberOfLivingNeighbors > 3) {
					return 0
				}
				break
			default:
				break;
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

}
