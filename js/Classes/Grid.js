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
	constructor(dimension = 60, interval = 10) {
		this.htmlContainer = document.createElement('div')
		this.htmlContainer.id = 'world'
		document.body.append(this.htmlContainer)
		this.dimension = dimension
		this.interval = interval
		this.cells = this.createCells(this.dimension)
		this.start()
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
			arr.push(this.getNeighborByDirection(position, cv))
		})
		return arr
	}

	getNeighborByDirection(position, direction) {
		switch (direction) {
			case 'nw':
				if (position === 0) {
					return this.cells[this.dimension ** 2 - 2]
				}
				if (this.dimension > position) {
					return this.cells[this.dimension ** 2 - this.dimension + position - 2]
				}
				if (position % this.dimension === 0) {
					return this.cells[position - 1]
				}
				return this.cells[position - this.dimension - 1]
			case 'n':
				if (position >= this.dimension) {
					return this.cells[position - this.dimension]
				}
				return this.cells[this.dimension ** 2 - this.dimension + position]
			case 'ne':
				if (position === this.dimension - 1) {
					return this.cells[this.dimension ** 2 - this.dimension]
				}
				if (position < this.dimension) {
					return this.cells[this.dimension ** 2 - this.dimension + position + 1]
				}
				if (position % this.dimension === this.dimension - 1) {
					return this.cells[position - 2 * this.dimension + 1]
				}
				return this.cells[position - this.dimension + 1]
			case 'w':
				if (position % this.dimension === 0) {
					return this.cells[this.dimension + position - 1]
				}
				return this.cells[position - 1]
			case 'e':
				if (position % this.dimension === this.dimension - 1) {
					return this.cells[position + 1 - this.dimension]
				}
				return this.cells[position + 1]
			case 'sw':
				if (position === this.dimension ** 2 - this.dimension) {
					return this.cells[this.dimension - 1]
				}
				if (position - this.dimension * (this.dimension - 1) >= 0) {
					return this.cells[position - this.dimension * (this.dimension -
						2)]
				}
				if (position % this.dimension === 0) {
					return this.cells[position + 2 * this.dimension - 1]
				}
				return this.cells[position + this.dimension - 1]
			case 's':
				if (position - this.dimension * (this.dimension - 1) >= 0) {
					return this.cells[position - this.dimension * (this.dimension -
						1)]
				}
				return this.cells[position + this.dimension]
			case 'se':
				if (position === this.dimension ** 2 - 1) {
					return this.cells[1]
				}
				if (position - this.dimension * (this.dimension - 1) >= 0) {
					return this.cells[position - this.dimension * (this.dimension - 1) + 1]
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
		window.setInterval(() => {
			this.updateGrid()
		}, this.interval)
	}

}
