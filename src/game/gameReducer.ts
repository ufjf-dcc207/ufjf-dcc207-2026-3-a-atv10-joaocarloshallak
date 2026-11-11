export const TUBE_CAPACITY = 4

export type Tube = string[]
export type Board = Tube[]

interface PreviousMove {
  tubes: Board
  moves: number
}

export interface GameState {
  tubes: Board
  selectedTube: number | null
  moves: number
  history: PreviousMove[]
  won: boolean
}

export type GameAction =
  | { type: 'SELECT_TUBE'; index: number }
  | { type: 'UNDO' }
  | { type: 'RESET' }

const initialBoard: Board = [
  ['coral', 'blue', 'green', 'yellow'],
  ['blue', 'green', 'yellow', 'coral'],
  ['green', 'yellow', 'coral', 'blue'],
  ['yellow', 'coral', 'blue', 'green'],
  [],
  [],
]

function copyBoard(board: Board): Board {
  return board.map((tube) => [...tube])
}

export function createInitialState(): GameState {
  return {
    tubes: copyBoard(initialBoard),
    selectedTube: null,
    moves: 0,
    history: [],
    won: false,
  }
}

function isSolved(tubes: Board): boolean {
  return tubes.every(
    (tube) =>
      tube.length === 0 ||
      (tube.length === TUBE_CAPACITY && tube.every((color) => color === tube[0])),
  )
}

function pour(state: GameState, targetIndex: number): GameState {
  const sourceIndex = state.selectedTube
  if (sourceIndex === null) return state
  if (sourceIndex === targetIndex) {
    return { ...state, selectedTube: null }
  }

  const source = state.tubes[sourceIndex]
  const target = state.tubes[targetIndex]
  const color = source[source.length - 1]

  if (
    target.length === TUBE_CAPACITY ||
    (target.length > 0 && target[target.length - 1] !== color)
  ) {
    return { ...state, selectedTube: target.length > 0 ? targetIndex : null }
  }

  let amount = 1
  while (amount < source.length && source[source.length - amount - 1] === color) {
    amount += 1
  }
  amount = Math.min(amount, TUBE_CAPACITY - target.length)

  const tubes = copyBoard(state.tubes)
  tubes[targetIndex].push(...tubes[sourceIndex].splice(-amount))

  return {
    ...state,
    tubes,
    selectedTube: null,
    moves: state.moves + 1,
    history: [...state.history, { tubes: copyBoard(state.tubes), moves: state.moves }],
    won: isSolved(tubes),
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_TUBE':
      if (state.won || !state.tubes[action.index]) return state
      if (state.selectedTube !== null) return pour(state, action.index)
      if (state.tubes[action.index].length === 0) return state
      return { ...state, selectedTube: action.index }
    case 'UNDO': {
      const previous = state.history[state.history.length - 1]
      if (!previous) return { ...state, selectedTube: null }
      return {
        ...state,
        tubes: copyBoard(previous.tubes),
        selectedTube: null,
        moves: previous.moves,
        history: state.history.slice(0, -1),
        won: false,
      }
    }
    case 'RESET':
      return createInitialState()
  }
}
