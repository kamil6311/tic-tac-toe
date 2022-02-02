import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Player } from '../model/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: Socket;

  private _player: Player = new Player("", true, true, "");
  private _ennemyPlayer: Player = new Player("", true, true, "");

  public get player(): Player {
    return this._player;
  }

  public set player(player: Player) {
    this._player = player;
  }

  public get ennemyPlayer(): Player {
    return this._ennemyPlayer;
  }

  constructor() {
    this.socket = io("https://morpion-server.herokuapp.com");
  }

  public play(playedCell: number, isWinner: boolean): void {
    this._player.playedCell = playedCell;
    this._player.win = isWinner;
    this._player.turn = false;
    this.socket.emit('play', this._player);
  }

  public onPlayed(): Observable<Player> {
    return new Observable<Player>((obs) => {
      this.socket.on('play', (ennemyPlayer: Player) => {
        obs.next(ennemyPlayer)
      });
    });
  }

  public replay(): void{
    this._player.turn = true;
    this.socket.emit('replay', this._player);
  }

  public onEquality(): Observable<Player> {
    return new Observable<Player>((obs) => {
      this.socket.on('equality', (player: Player) => {
        obs.next(player);
      })
    })
  }

  public equality(): void {
    this.socket.emit('equality', this._player);
  }

  public newGame(): void {
    this._player.turn = false;
    this._player.win = false;
    this.socket.emit('newGame', this._player);
  }

  public onReplay(): Observable<Player> {
    return new Observable<Player>((obs) => {
      this.socket.on('replay', (ennemyPlayer: Player) => {
        obs.next(ennemyPlayer)
      });
    });
  }

  public endGame(): void {
     this.socket.emit('endGame', this._player);
  }

  public onEndGame(): Observable<Player> {
    return new Observable<Player>((obs) => {
      this.socket.on('endGame', (player: Player) => {
        obs.next(player);
      })
    });
  }

  public get socketId(){
    return this.socket.id;
  }

  public getNbPlayersRoom(room: string): Observable<{ nbPlayers: number }> {
    return new Observable<{ nbPlayers: number }>((obs) => {
      this.socket.emit('getNbPlayersRoom', { room: room }, (cb: { nbPlayers: number }) => {
        obs.next(cb)
      })
    })
  }

  public createGame(username: string): Observable<{ joined: boolean, room: string, message: string }>{
    this._player = new Player(username, true, true, this.socket.id);
    console.log(this._player);

    return new Observable<{ joined: boolean, room: string, message: string }>(obs => {
      this.socket.emit('playerData', this._player, (cb: { joined: boolean, room: string, message: string })  => {
        console.log(cb);
        this._player.roomId = cb.room;
        this._player.win = false;
        obs.next(cb);
      });
    })
  }

  public joinGame(username: string, roomId: string): Observable<{ joined: boolean, room: string, message: string }>{
    this._player = new Player(username, false, false, this.socket.id, roomId);
    return new Observable<{ joined: boolean, room: string, message: string }>(obs => {
      this.socket.emit('playerData', this._player, (cb: { joined: boolean, room: string, message: string })  => {
        console.log(cb);
        obs.next(cb);
      });
    })
  }

  public onMessage(): Observable<{username: string, message: string, room: string}> {
    return new Observable<{username: string, message: string, room: string}>((obs) => {
      this.socket.on('message', (data) => {
        obs.next(data);
      })
    })
  }

  public disconnect(player: Player, room: string){
    this.socket.emit('leave', { username: player.username, room: room });
  }

  public startGame(): Observable<Player> {
    return new Observable<Player>((obs) => {
      this.socket.on('gameStarting', (players: Player[]) => {
        console.log("game starting");
        this._player.win = false;
        this._ennemyPlayer = players.find(p => p.socketId !== this._player.socketId);
        obs.next(players.find(p => p.socketId !== this._player.socketId))
      });
    });
  }
}
