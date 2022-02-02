import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { ComponentBase } from 'src/app/components/component-base/component-base.component';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage extends ComponentBase {

  private _roomId: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _navCtrl: NavController,
    private _gameService: GameService
  ) {
    super();
  }

  public joinGame(psUsername: string): void {
    if(!psUsername){
      return;
    }
    this._activatedRoute.paramMap.pipe(
      concatMap((params: ParamMap) => {
        if(params.get('roomId')){
          return this._gameService.joinGame(psUsername, params.get('roomId')).pipe(
            tap((result: { joined: boolean, room: string, message: string }) => {
              if(result.joined){
                this._navCtrl.navigateRoot(`/play/${result.room}`)
              }
            }),
            takeUntil(this.destroyed$)
          )
        }
      })
    ).subscribe();
  }
}
