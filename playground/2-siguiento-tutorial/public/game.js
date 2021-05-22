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

    function start() {
        const frecuencia = 1500;

        setInterval( addFruit, frecuencia );
    }

    // <observer patern>
    const observers = [];

    function subscribe( observerFunction ) {
        observers.push( observerFunction );
    }

    function notifyAll( command ) {
        for (const observerFunction of observers) {
            observerFunction( command );
        }
    }
    // </observer patern>

    function setState( newState ) {
        Object.assign( state, newState );
    }

    function addPlayer( command ) {
        const { playerId } = command;
        const x = "x" in command ? command.x : Math.floor( Math.random() * state.screen.width );
        const y = "y" in command ? command.y : Math.floor( Math.random() * state.screen.height );
        state.players[ playerId ] = { x, y }

        notifyAll({type:'add-player',playerId, x, y});
    }

    function removePlayer( command ) {
        const { playerId } = command;
        delete state.players[ playerId ];

        notifyAll( { type:'rm-player', playerId } );
    }

    function addFruit( command ) {
        const fruitId = command ? command.fruitId : Math.floor( Math.random() * 100000 ) ;
        const x = command ? command.x : Math.floor( Math.random() * state.screen.width );
        const y = command ? command.y : Math.floor( Math.random() * state.screen.height );
        state.fruits[ fruitId ] = { x, y }

        notifyAll( { type:'add-fruit', fruitId, x, y  } );
    }

    function removeFruit( command ) {
        const { fruitId } = command;
        delete state.fruits[ fruitId ];

        notifyAll( { type:'rm-fruit', fruitId  } );
    }

    function movePlayer( command ) {
        notifyAll( command );
        
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
        setState, subscribe,
        start,
    };
}