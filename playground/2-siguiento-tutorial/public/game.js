// Factory
export default function createGame() {
    const state = {
        players: { },
        fruits: { },
        screen: {
            width: 10,
            height:10
        }
    }

    function setState( newState ) {
        Object.assign( state, newState );
    }

    function addPlayer( command ) {
        const { playerId, x, y } = command;
        state.players[ playerId ] = { x, y }
    }

    function removePlayer( command ) {
        const { playerId } = command;
        delete state.players[ playerId ];
    }

    function addFruit( command ) {
        const { fruitId, x, y } = command;
        state.fruits[ fruitId ] = { x, y }
    }

    function removeFruit( command ) {
        const { fruitId } = command;
        delete state.fruits[ fruitId ];
    }

    function movePlayer( command ) {
        const acceptedMoves = {
            ArrowUp( player ){ if( player.y - 1 >= 0 ) player.y--; },
            ArrowDown( player ){ if( player.y + 1 < state.screen.height ) player.y++; },
            ArrowRight( player ){ if( player.x + 1 < state.screen.width ) player.x++; },
            ArrowLeft( player ){ if( player.x - 1 >= 0 ) player.x--; },
        }
        
        const { playerId } = command
        const player = state.players[ playerId ];
        const { keyPressed } = command;
        const moveFunction = acceptedMoves[ keyPressed ];
        if ( player && moveFunction ) {
            moveFunction( player );
            checkForFruitCollision( playerId );
        }
    }

    function checkForFruitCollision( playerId ) {
        const player = state.players[ playerId ];    
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[ fruitId ];
            if ( player.x === fruit.x && player.y === fruit.y ) {
                removeFruit( { fruitId } );
            }
        }
    }

    return { 
        movePlayer, state,
        addPlayer, removePlayer,
        addFruit, removeFruit,
        setState,
    };
}