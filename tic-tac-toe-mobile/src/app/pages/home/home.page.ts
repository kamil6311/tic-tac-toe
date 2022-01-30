import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  private room: string = "";

  constructor(
    private _router: Router,
    private _gameService: GameService,
    private _alterCtrl: AlertController
    ) {}

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  public createGame(username: string): void{
    this._gameService.setPlayerUsername(username);
    this._gameService.createGame().pipe(
      tap((result: { joined: boolean, room: string, message: string }) => {
        if(result.joined){
          this._router.navigateByUrl(`/play/${result.room}`);
        }
      })
    ).subscribe();
  }

  public joinGame(username, room){
    this._gameService.joinGame(username, room).pipe(
      tap((result: { joined: boolean, room: string, message: string }) => {
        if(result.joined){
          this._router.navigateByUrl(`/play/${result.room}`);
        }
      })
    ).subscribe();
  }

}
