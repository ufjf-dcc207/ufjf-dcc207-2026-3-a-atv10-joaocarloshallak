import { GameProvider } from './game/GameProvider'
import { useGame } from './game/useGame'
import './App.css'

const colorNames: Record<string, string> = {
  coral: 'coral',
  blue: 'azul',
  green: 'verde',
  yellow: 'amarelo',
}

function Game() {
  const { state, dispatch } = useGame()

  return (
    <main className="game">
      <header className="header">
        <div>
          <p className="eyebrow">JOGO DE LÓGICA</p>
          <h1>Magic Sort</h1>
        </div>
        <div className="moves" aria-live="polite">
          <span>Movimentos</span>
          <strong>{state.moves}</strong>
        </div>
      </header>

      <p className="instructions">
        Organize as cores nos tubos. Só é possível colocar uma cor sobre outra igual.
      </p>

      {state.won && <p className="win-message">Muito bem! Você organizou todas as cores.</p>}

      <section className="board" aria-label="Tabuleiro do Magic Sort">
        {state.tubes.map((tube, index) => (
          <button
            className={`tube ${state.selectedTube === index ? 'selected' : ''}`}
            key={index}
            type="button"
            aria-label={`Tubo ${index + 1}${tube.length ? `, ${colorNames[tube[tube.length - 1]]} no topo` : ', vazio'}`}
            onClick={() => dispatch({ type: 'SELECT_TUBE', index })}
          >
            {tube.map((color, ballIndex) => (
              <span className={`ball ${color}`} key={ballIndex} />
            ))}
          </button>
        ))}
      </section>

      <div className="controls">
        <button
          className="secondary-button"
          type="button"
          disabled={state.history.length === 0}
          onClick={() => dispatch({ type: 'UNDO' })}
        >
          Desfazer
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Reiniciar
        </button>
      </div>
    </main>
  )
}

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  )
}

export default App
