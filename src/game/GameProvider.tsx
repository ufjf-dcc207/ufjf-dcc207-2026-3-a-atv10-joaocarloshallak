import { useReducer, type ReactNode } from 'react'
import { createInitialState, gameReducer } from './gameReducer'
import { GameContext } from './gameContext'

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}
