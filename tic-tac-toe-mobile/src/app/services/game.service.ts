import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Player } from '../model/player';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
  }

  public getNbPlayersRoom(room: string): Observable<{ nbPlayers: number }> {
    return new Observable<{ nbPlayers: number }>((obs) => {
      this.socket.emit('getNbPlayersRoom', { room: room }, (cb: { nbPlayers: number }) => {
        obs.next(cb)
      })
    })
  }

  public joinGame(player: Player, room: string): Observable<{message: string}>{
    return new Observable<{message: string}>(obs => {
      this.socket.emit('join', { username: player.username, room: room }, (cb: { joined: boolean, message: string })  => {
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
    this.socket.emit('leave', { username: player.username, room: room});
  }
}
