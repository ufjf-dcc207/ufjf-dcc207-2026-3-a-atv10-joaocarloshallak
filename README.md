# Magic Sort

Jogo de organizar as cores nos tubos. Selecione um tubo e depois outro para mover
as bolas do topo. Só é permitido mover uma cor para um tubo vazio ou para cima
da mesma cor. O jogo termina quando cada tubo estiver vazio ou completo com uma
única cor.

## Executar

```bash
npm install
npm run dev
```

## Organização

- `src/game/gameReducer.ts`: estado inicial e regras das jogadas.
- `src/game/gameContext.ts`, `GameProvider.tsx` e `useGame.ts`: compartilhamento
  do estado com Context.
- `src/App.tsx`: interface e envio das ações para o reducer.
