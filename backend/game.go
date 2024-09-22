package backend

import (
	"fmt"
	"math"
	"math/rand"
	"strings"
	"time"
)

type GameState struct {
	Started     bool
	Timer       Timer
	Players     []Player
	GameGrid    [][]Cell
	SpawnPoints []Position
}

/* type Player struct {
	Index        int          `json:"index"`
	Username     string       `json:"username"`
	Color        string       `json:"color"`
	Position     Position     `json:"position"`
	Lives        int          `json:"lives"`
	Speed        float32      `json:"speed"`
	BombCount    int          `json:"bombCount"`
	BombRange    int          `json:"bombRange"`
	PowerUpLevel PowerUpLevel `json:"powerUpLevel"`
} */

type Timer struct {
	Active        bool
	TimeRemaining time.Duration
}

type Cell struct {
	BlockType int // 0-air 1-permanent 2-breakable
	OnFire    bool
	HasBomb   bool
	X         int
	Y         int
	DropType  int //-1 = nothing
	/*
		 === DROP TYPES ===
			0 - SPEED UP
			1 - MORE BOMBS
			2 - BLAST RADIUS
	*/
}

var CellSize = 58

func (g *GameState) StartTimer(totalTimeSeconds int) {

	g.Timer = Timer{
		Active:        true,
		TimeRemaining: time.Duration(totalTimeSeconds) * time.Second,
	}
	go func() {
		for g.Timer.TimeRemaining > 0 && g.Timer.Active {
			time.Sleep(1 * time.Second)
			g.Timer.TimeRemaining -= 1 * time.Second

			// broadcastTimer
			var msg Message
			msg.Type = "timer"
			msg.GameState = gameState
			broadcast(nil, 1, msg)

			// Uncomment to display game board in backend and time remaining
			// fmt.Println("Time remaining:", g.Timer.TimeRemaining)
			// g.DisplayGameBoard()
		}
		if g.Timer.TimeRemaining <= 0 {
			g.Timer.Active = false
			g.OnTimerEnd()
		}
	}()
}
func (g *GameState) OnTimerEnd() {
	timer := time.NewTimer(1 * time.Second)
	go func() {
		<-timer.C
		g.Started = true // start game
		var msg Message
		msg.Type = "start"
		broadcast(nil, 1, msg)
	}()
}

// Adds player to gamestate and returns the index of the added player for easy linking with websocket connection
func (g *GameState) AddPlayer(p Player) int {
	p.Index = len(g.Players) // assign player index
	g.Players = append(g.Players, p)
	return p.Index
}

// Check is playername is taken
func (g *GameState) hasPlayerName(name string) bool {
	for _, p := range g.Players {
		if p.Username == name {
			return true
		}
	}
	return false
}

// Might be inefficient (Seperate to individual updates movement, lives, etc?) ***
func (g *GameState) UpdatePlayer(p Player) {
	for idx, player := range g.Players {
		if player.Username == p.Username {
			g.Players[idx] = p
			return
		}
	}
}

func (g *GameState) RestartGame() {
	InitGame()
	g.Started = false
}

func (g *GameState) GenerateGameGrid() {
	/*
	   === BLOCK TYPES ===
	   0 - AIR
	   1 - UNBREAKABLE
	   2 - BREAKABLE
	   8 - FREE SPACE *MUST BE TYPE 0*
	   9 - SPAWN POINT
	*/

	worldTemplate := [][]int{
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}, //{X=12; Y=0}  [0][12]
		{1, 9, 8, 0, 0, 0, 0, 0, 0, 0, 8, 9, 1},
		{1, 8, 1, 0, 0, 0, 1, 0, 0, 0, 1, 8, 1},
		{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
		{1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1},
		{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
		{1, 8, 1, 0, 0, 0, 1, 0, 0, 0, 1, 8, 1},
		{1, 9, 8, 0, 0, 0, 0, 0, 0, 0, 8, 9, 1},
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
	}
	//
	//randomly generate breakable blocks
	for i := 1; i < 10; i++ {
		for j := 1; j < 12; j++ {
			if worldTemplate[i][j] == 0 && rand.Intn(5) > 0 { // if air block and hits 80% chance, place breakable block
				worldTemplate[i][j] = 2
			}
		}
	}
	//
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
				X:         i,
				Y:         j,
				DropType:  -1,
			}
			if g.GameGrid[i][j].BlockType == 2 { // if breakable block, roll a drop for that block
				g.GameGrid[i][j].RollDrop()
			}

			// Append gamestate.Spawnpoint if spawnpoint is encountered
			if worldTemplate[i][j] == 9 {
				g.SpawnPoints = append(g.SpawnPoints, Position{X: float32(i), Y: float32(j)})
			}
		}
	}
}

// For debugging
func (g *GameState) DisplayGameBoard() {
	var builder strings.Builder
	builder.WriteString((" -------------------------\n"))
	for i := range g.GameGrid {
		for j := range g.GameGrid[i] {
			if g.GameGrid[i][j].HasBomb {
				builder.WriteString(fmt.Sprintf(" %s", "X"))
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
	builder.WriteString((" -------------------------\n"))
	fmt.Print(builder.String())
}

func (g *GameState) SetBomb(c *Cell, radius int) {
	c.HasBomb = true

	var reply Message
	reply.Type = "gameState"
	reply.GameState = gameState
	broadcast(nil, 1, reply)

	timer := time.NewTimer(3 * time.Second)
	go func() {
		<-timer.C
		c.HasBomb = false
		g.Explosion(c, radius)
	}()

}

func (p *Player) CalcPlayerGridPosition() (int, int) {
	gridX := math.Floor(float64(p.Position.X+24) / float64(CellSize))
	gridY := math.Floor(float64(p.Position.Y+27) / float64(CellSize))
	return int(gridX), int(gridY)
}
func GetCellPos(x, y float32) (int, int) {
	gridX := math.Floor(float64(x) / float64(CellSize))
	gridY := math.Floor(float64(y) / float64(CellSize))
	return int(gridX), int(gridY)
}

func (g *GameState) Explosion(c *Cell, r int) {
	g.LightCell(c)
	directionBlocked := [4]bool{false, false, false, false}
	for i := 1; i <= r; i++ {
		if c.X-i >= 0 && !directionBlocked[0] { // left
			directionBlocked[0] = g.LightCell(&g.GameGrid[c.X-i][c.Y])
		}
		if c.X+i < len(g.GameGrid) && !directionBlocked[1] { // right
			directionBlocked[1] = g.LightCell(&g.GameGrid[c.X+i][c.Y])
		}
		if c.Y-i >= 0 && !directionBlocked[2] { // up
			directionBlocked[2] = g.LightCell(&g.GameGrid[c.X][c.Y-i])
		}
		if c.Y+i < len(g.GameGrid[0]) && !directionBlocked[3] { // down
			directionBlocked[3] = g.LightCell(&g.GameGrid[c.X][c.Y+i])
		}
	}

	var reply Message
	reply.Type = "gameState"
	reply.GameState = gameState
	broadcast(nil, 1, reply)
	timer := time.NewTimer(1 * time.Second)
	go func() {
		<-timer.C
		g.ExtinguishCell(c)
		for i := 1; i <= r; i++ {
			if c.X-i >= 0 { // left
				g.ExtinguishCell(&g.GameGrid[c.X-i][c.Y])
			}
			if c.X+i < len(g.GameGrid) { // right
				g.ExtinguishCell(&g.GameGrid[c.X+i][c.Y])
			}
			if c.Y-i >= 0 { // up
				g.ExtinguishCell(&g.GameGrid[c.X][c.Y-i])
			}
			if c.Y+i < len(g.GameGrid[0]) { // down
				g.ExtinguishCell(&g.GameGrid[c.X][c.Y+i])
			}
		}
		var reply Message
		reply.Type = "gameState"
		reply.GameState = gameState
		broadcast(nil, 1, reply)
	}()

}

func (g *GameState) LightCell(c *Cell) bool {
	if c.BlockType == 1 { // dont light unbreakable blocks
		return true
	}
	c.OnFire = true
	if c.BlockType == 2 { // if breakable block, turn it into air
		c.BlockType = 0
	}
	return false
}
func (g *GameState) ExtinguishCell(c *Cell) {
	if c.BlockType == 1 {
		return
	}
	c.OnFire = false

}

/*
	 === DROP TYPES ===
		0 - SPEED UP
		1 - MORE BOMBS
		2 - BLAST RADIUS
*/
func (c *Cell) RollDrop() {
	if rand.Intn(3) == 0 {
		c.DropType = rand.Intn(3)
	}
}

// Update Player.Position
func (g *GameState) MovePlayer(p Player, pos Position) {
	// log.Println(p.Index, p.Username)
	g.Players[p.Index].Position = pos
}

func (g *GameState) removePlayer(player *Player) {
	for i, p := range g.Players {
		if p.Username == player.Username {
			g.Players = append(g.Players[:i], g.Players[i+1:]...)
			break
		}
	}
}
