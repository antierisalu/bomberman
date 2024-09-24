import { LAR } from "../framework";


const Hud = (prop) => {
    console.log("HUD LOADED PROPS:");
    console.log("players: ", prop.players)
    console.log("updatePlayers: ", prop.updatePlayers)
    console.log("updateGameState: ", prop.updateGameState)
    console.log("gameState: ", prop.gameState)
    console.log("clientInfo: ", prop.clientInfo)





    return (
        <div style="transform: translateY(-58px);">
                    
                    <div class="hudContainer" id="HUD">
                <div class="hudInfoContainer">
                    <div class="hudInfo-lives">
                        <div class="hudHeart"></div>
                        <div class="digital-counter">
                            <div></div>
                            <p id="health-counter">3</p>
                        </div>
                    </div>

                    <div class="hudInfo-powerups">
                        <div class="powerup-speed">
                            <div class="hudSpeed">
                                <div class="hudShoes"></div>
                                <div class="hudThunder"></div>
                            </div>
                            <div class="digital-counter">
                                <p id="powerupSpeed-counter">3</p>
                            </div>
                        </div>

                        <div class="powerup-bombs">
                            <div class="hudBomb"></div>
                            <div class="digital-counter">
                                <p id="powerupBomb-counter">3</p>
                            </div>
                        </div>


                        <div class="powerup-fire">
                            <div class="hudFire"></div>

                            <div class="digital-counter">
                                <p id="powerupFire-counter">3</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hudInfo-alivePlayers">
                        <div class="alivePlayersIcons">
                            <div class="playerIconContainer" id="hudPlayer-0">
                                <div class="hudEmoji"></div>
                                <div class="playerIcon">

                                </div>
                                <div class="playerCross"></div>
                                <div class="playerIconName">
                                    <p style="margin: 0;font-family: silkscreen; color:white;"></p>
                                </div>
                            </div>

                            <div class="playerIconContainer" id="hudPlayer-1">
                                <div class="hudEmoji"></div>
                                <div class="playerIcon">

                                </div>
                                <div class="playerCross"></div>
                                <div class="playerIconName">
                                    <p style="margin: 0;font-family: silkscreen; color:white;"></p>
                                </div>
                            </div>
                            <div class="playerIconContainer" id="hudPlayer-2">
                                <div class="hudEmoji"></div>
                                <div class="playerIcon">

                                </div>
                                <div class="playerCross"></div>
                                <div class="playerIconName">
                                    <p style="margin: 0;font-family: silkscreen; color:white;"></p>
                                </div>
                            </div>
                            <div class="playerIconContainer" id="hudPlayer-3">
                                <div class="hudEmoji"></div>
                                <div class="playerIcon">


                                </div>
                                <div class="playerCross"></div>
                                <div class="playerIconName">
                                    <p style="margin: 0;font-family: silkscreen; color:white;"></p>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>

                </div>
                <div class="hudContainerBorder">
                    <div class="hudContainerBackground">

                    </div>
                </div>
            </div>

            
        </div>



    
    )
}

export default Hud;