import express from 'express';
import http from 'http';
import * as io from 'socket.io';
import createGame from './public/game.js';



const app = express();
const server = http.createServer( app );
const sockets = new io.Server( server );

app.use( express.static( 'public' ) );

const game = createGame();
game.start();

game.subscribe( ( command ) => {
    sockets.emit( command.type, command );
});

sockets.on( 'connection', socket => {
    const playerId = socket.id;
    
    console.log( `>>> Entró: ${ playerId }` );
    game.addPlayer( { playerId } );
    
    // emite el estado del juego
    socket.emit( 'setup', game.state );

    socket.on( 'disconnect', ()=>{
        console.log( `<<< Salió: ${ playerId }` );
        game.removePlayer( { playerId } );
    });

    socket.on( 'move-player', command => {
        command.playerId = playerId;
        command.type = 'move-player';
        game.movePlayer( command );
    });

});

server.listen( 3000, () => {
    console.log( 'Server listening on port: 3000' )
});