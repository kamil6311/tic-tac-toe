import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private socket: Socket;


  constructor() {}

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');

    this.socket.on('roomMessage', (data) => {
      console.log(data);
    })

    this.socket.on('message', (data) => {
      console.log(data);
    })

    this.socket.emit('join', { username: "kams", room: 1 }, (cb)  => {
        console.log(cb);
    });

  }





}
