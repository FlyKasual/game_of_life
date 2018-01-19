const states = [
  'dead', 
  'alive'
]

class Cell {
  constructor(state = 0) {
    this.state = state
    this.nextState = this.state
    this.htmlCell = document.createElement('div')
    this.htmlCell.className = states[this.state]
    this.htmlCell.addEventListener('click', e => {
        this.state = 1 - this.state
        this.htmlCell.className = states[this.state]
    })
  }

  update() {
    let stateChanges = this.state !== this.nextState
    if (stateChanges) {
        this.state = this.nextState
        this.htmlCell.className = states[this.state]
    }
  }

  setState(state) {
    this.state = state
    this.htmlCell.className = states[this.state]
  }
}
