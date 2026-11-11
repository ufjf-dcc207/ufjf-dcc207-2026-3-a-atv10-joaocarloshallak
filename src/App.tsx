import { createContext, useContext, useReducer } from 'react'
import './App.css'

type State = {
  tubes: string[][]
  selected: number | null
  moves: number
  won: boolean
}

type Action = { type: 'select'; index: number } | { type: 'reset' }

const start: State = {
  tubes: [
    ['red', 'blue', 'green', 'yellow'],
    ['blue', 'green', 'yellow', 'red'],
    ['green', 'yellow', 'red', 'blue'],
    ['yellow', 'red', 'blue', 'green'],
    [],
    [],
  ],
  selected: null,
  moves: 0,
  won: false,
}

function reducer(state: State, action: Action): State {
  if (action.type === 'reset') return { ...start, tubes: start.tubes.map((tube) => [...tube]) }

  const { index } = action
  if (state.selected === null) {
    return state.tubes[index].length
      ? { ...state, selected: index }
      : state
  }
  if (state.selected === index) return { ...state, selected: null }

  const tubes = state.tubes.map((tube) => [...tube])
  const source = tubes[state.selected]
  const target = tubes[index]
  const ball = source[source.length - 1]

  if (target.length === 4 || (target.length > 0 && target.at(-1) !== ball)) {
    return { ...state, selected: null }
  }

  target.push(source.pop()!)
  const won = tubes.every(
    (tube) => tube.length === 0 || (tube.length === 4 && tube.every((color) => color === tube[0])),
  )

  return { tubes, selected: null, moves: state.moves + 1, won }
}

const GameContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

function Game() {
  const game = useContext(GameContext)
  if (!game) throw new Error('Game precisa de GameContext')
  const { state, dispatch } = game

  return (
    <main>
      <h1>Magic Sort</h1>
      <p>Movimentos: {state.moves}</p>
      <p>Escolha um tubo e depois outro para mover uma bola.</p>
      <div className="board">
        {state.tubes.map((tube, index) => (
          <button
            className={`tube ${state.selected === index ? 'selected' : ''}`}
            key={index}
            onClick={() => dispatch({ type: 'select', index })}
            aria-label={`Tubo ${index + 1}`}
          >
            {tube.map((color, ball) => <span className={color} key={ball} />)}
          </button>
        ))}
      </div>
      {state.won && <p>Você venceu!</p>}
      <button onClick={() => dispatch({ type: 'reset' })}>Reiniciar</button>
    </main>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, start, (initial) => ({
    ...initial,
    tubes: initial.tubes.map((tube) => [...tube]),
  }))

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <Game />
    </GameContext.Provider>
  )
}
