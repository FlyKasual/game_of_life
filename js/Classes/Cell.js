class Cell {
	constructor() {
		let rand = Math.floor(
			Math.random() * 10
		)
		this.state = rand < 2 ? 1 : 0
		this.nextState = this.state
		this.htmlCell = document.createElement('div')
		let cssClass = this.state === 1 ? 'alive' : 'dead'
		this.htmlCell.className = cssClass
	}

	update(state) {
		this.state = state
		let cssClass = this.state === 1 ? 'alive' : 'dead'
		this.htmlCell.className = cssClass
	}
}
