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

	update() {
		let stateChanges = this.state !== this.nextState
		if (stateChanges) {
			this.state = this.nextState
			let cssClass = this.state === 1 ? 'alive' : 'dead'
			this.htmlCell.className = cssClass
		}
	}
}
