# Soccer Bros

A fast-paced 1v1 soccer game inspired by [Soccer Bros on CrazyGames](https://www.crazygames.com/game/soccer-bros), built with HTML5 Canvas and vanilla JavaScript.

## How to Play

Open `index.html` in any modern browser — no build step required.

### Controls

| Action | Player 1 | Player 2 |
|--------|----------|----------|
| Move   | WASD     | Arrow keys |
| Kick   | G or Space | L |
| Tackle | F        | K |
| Pause  | Escape   | — |

### Game Modes

- **Play Now** — 1v1 against CPU AI
- **Local 2-Player** — Same keyboard, two players
- **Practice** — Solo ball practice (no opponent, no timer)

### Features

- 8 unlockable bros with unique stats (speed, power, tackle, agility)
- Moving goalkeeper hands block shots
- Foul tackles can award penalties
- First to 5 goals or highest score when the 90-second timer runs out
- Progress saved in localStorage (wins unlock new characters)

## Files

```
soccerbros/
├── index.html
├── css/style.css
├── js/
│   ├── players.js   # Character definitions & rendering
│   └── game.js      # Game engine, physics, AI, menus
└── README.md
```

## License

Fan recreation for educational purposes. Not affiliated with Blue Wizard Digital or CrazyGames.
