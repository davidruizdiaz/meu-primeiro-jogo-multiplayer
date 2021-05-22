// Factory
export default function createKeyboardListener( document ) {
    document.addEventListener( 'keydown', handleKeydown );
    
    // <observer patern>
    const state = {
        observers: [],
        playerId: null,
    }

    function registerPlayerId( playerId ) {
        state.playerId = playerId;
    }

    function subscribe( observerFunction ) {
        state.observers.push( observerFunction );
    }

    function notifyAll( command ) {
        for (const observerFunction of state.observers) {
            observerFunction( command );
        }
    }
    // </observer patern>

    function handleKeydown( { key: keyPressed } ) {
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }
        // notify all observers
        notifyAll( command );
    }

    return { subscribe, registerPlayerId };
}

