import express from 'express';
import http from 'http';
import * as io from 'socket.io';
import createGame from './public/game.js';



const app = express();
const server = http.createServer( app );
const sockets = new io.Server( server );

app.use( express.static( 'public' ) );

const game = createGame();
game.addFruit({ fruitId:'fruit1', x: 2, y:3 });
game.addFruit({ fruitId:'fruit2', x: 5, y:8 });
game.addFruit({ fruitId:'fruit3', x: 9, y:9 });
game.addPlayer({ playerId:'player1', x: 4, y:8 });

console.log( game.state );

sockets.on( 'connection', socket => {
    const playerId = socket.id;
    console.log(`> Player connecting: ${ playerId }`);

    game.addPlayer( { playerId } );
    
    // emite el estado del juego
    socket.emit( 'setup', game.state );
});

server.listen( 3000, () => {
    console.log( 'Server listening on port: 3000' )
});