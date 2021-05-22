// Factory
export default function createKeyboardListener( document ) {
    document.addEventListener( 'keydown', handleKeydown );
    
    // <observer patern>
    const state = {
        observers: [],
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
            playerId: "player1",
            keyPressed
        }
        // notify all observers
        notifyAll( command );
    }

    return { subscribe };
}

