import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { concatMap, tap } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { PlayersService } from 'src/app/services/players.service';
import { Player } from '../../model/player';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  private room: string = "";

  constructor(
    private _router: Router,
    private _playersService: PlayersService,
    private _gameService: GameService,
    private _alterCtrl: AlertController
    ) {}

  ngOnDestroy(): void {
    this._playersService.player.pipe(
      tap((player: Player) => {
        this._gameService.disconnect(player, this.room);
      })
    ).subscribe();

  }

  ngOnInit(): void {
  }

  public playGame(username: string, room: string): void{
    this.room = room;
    this._playersService.setPlayer(username, room).pipe(
        concatMap((player: Player) => {
          return this._gameService.joinGame(player, room).pipe(
            tap((result: { joined: boolean, message: string}) => {
              if(!result.joined){
                this._alterCtrl.create({
                  header: 'Erreur',
                  message: "Impossible de rejoindre cette partie.",
                  buttons: ['OK'],
                }).then((poAlert: HTMLIonAlertElement) => poAlert.present());
              }
              else{
                this._router.navigateByUrl('/play');
              }
            })
          );
        })
    ).subscribe();
  }

}
