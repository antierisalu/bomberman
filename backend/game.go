package backend

import (
	"fmt"
	"strings"
	"time"
)

type GameState struct {
	Timer    Timer
	Players  []Player
	GameGrid [][]Cell
}

/* type Player struct { juba olemas websocket.gos
	Username string   `json:"username"`
	Color    string   `json:"color"`
	Position Position `json:"position"`
} */

type Timer struct {
	Active        bool
	TimeRemaining time.Duration
}

type Cell struct {
	BlockType int
	OnFire    bool
	HasBomb   bool
	X         int
	Y         int
}

func (g *GameState) StartTimer(totalTimeSeconds int) {
	// g.GenerateGameGrid()
	g.SetBomb(Cell{X: 3, Y: 3}, 2)

	g.Timer = Timer{
		Active:        true,
		TimeRemaining: time.Duration(totalTimeSeconds) * time.Second,
	}
	go func() {
		for g.Timer.TimeRemaining > 0 && g.Timer.Active {
			time.Sleep(1 * time.Second)
			g.Timer.TimeRemaining -= 1 * time.Second
			// dbg
			fmt.Println("Time remaining:", g.Timer.TimeRemaining)
			g.DisplayGameBoard()
		}
		if g.Timer.TimeRemaining <= 0 {
			g.Timer.Active = false
			g.OnTimerEnd()
		}
	}()
}

func (g *GameState) OnTimerEnd() {
	fmt.Println("Timer finished with end time:", g.Timer.TimeRemaining)
	fmt.Println("Connected Players:")
	for _, p := range g.Players {
		fmt.Printf("Player: %s [%s] at position (x:%f, y:%f)\n", p.Username, p.Color, p.Position.X, p.Position.Y)
	}
}

func (g *GameState) AddPlayer(p Player) {
	g.Players = append(g.Players, p)
}

func (g *GameState) hasPlayerName(name string) bool {
	for _, p := range g.Players {
		if p.Username == name {
			return true
		}
	}
	return false
}

func (g *GameState) UpdatePlayer(p Player) {

}

func (g *GameState) GenerateGameGrid(worldTemplate [][]int) {
	rows := len(worldTemplate)
	cols := len(worldTemplate[0])
	g.GameGrid = make([][]Cell, rows)
	for i := range g.GameGrid {
		g.GameGrid[i] = make([]Cell, cols)
		for j := range g.GameGrid[i] {
			g.GameGrid[i][j] = Cell{
				BlockType: worldTemplate[i][j],
				OnFire:    false,
				HasBomb:   false,
			}
		}
	}
}

// For debugging
func (g *GameState) DisplayGameBoard() {
	var builder strings.Builder
	builder.WriteString((fmt.Sprint(" -------------------------\n")))
	for i := range g.GameGrid {
		for j := range g.GameGrid[i] {
			if g.GameGrid[i][j].HasBomb {
				builder.WriteString(fmt.Sprintf(" %s", "B"))
				continue
			}
			if g.GameGrid[i][j].OnFire {
				builder.WriteString(fmt.Sprintf(" %s", "F"))
				continue
			}
			builder.WriteString(fmt.Sprintf(" %d", g.GameGrid[i][j].BlockType))
		}
		builder.WriteString("\n")
	}
	builder.WriteString((fmt.Sprint(" -------------------------\n")))
	fmt.Print(builder.String())
}

func (g *GameState) SetBomb(c Cell, radius int) {
	cell := &g.GameGrid[c.X][c.Y]
	cell.HasBomb = true
	fmt.Println("Bomb planted")
	timer := time.NewTimer(3 * time.Second)
	go func() {
		<-timer.C
		fmt.Println("Bomb exploded")
		cell.HasBomb = false
		g.Explosion(c, radius)
	}()
}

func (g *GameState) Explosion(c Cell, r int) {
	g.LightCell(c.X, c.Y)

	for i := 1; i <= r; i++ {
		if c.X-i >= 0 { //left
			g.LightCell(c.X-i, c.Y)
		}
		if c.X+i < len(g.GameGrid) { //right
			g.LightCell(c.X+i, c.Y)
		}
		if c.Y-i >= 0 { //up
			g.LightCell(c.X, c.Y-i)
		}
		if c.Y+i < len(g.GameGrid[0]) { //down
			g.LightCell(c.X, c.Y+i)
		}
	}
}

func (g *GameState) LightCell(x, y int) {
	g.GameGrid[x][y].OnFire = true
	fmt.Println("Fire started at:", x, y)

	timer := time.NewTimer(1 * time.Second)
	go func() {
		<-timer.C
		g.GameGrid[x][y].OnFire = false
		fmt.Println("Fire ended at:", x, y)

	}()
}
