import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { takeUntil, tap } from 'rxjs/operators';
import { ComponentBase } from '../../components/component-base/component-base.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends ComponentBase {

  squares = Array(9).fill(null);

  private room: string = "";

  constructor(
    private _router: Router,
    private _gameService: GameService,
    private _alterCtrl: AlertController
    ) {
      super();
    }

    public makeMove(index) {
      this.squares.splice(index, 1, 'X');
    }

  public createGame(username: string): void{
    this._gameService.createGame(username).pipe(
      tap((result: { joined: boolean, room: string, message: string }) => {
        if(result.joined){
          this._router.navigateByUrl(`/play/${result.room}`);
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public joinGame(username, room){
    this._gameService.joinGame(username, room).pipe(
      tap((result: { joined: boolean, room: string, message: string }) => {
        if(result.joined){
          this._router.navigateByUrl(`/play/${result.room}`);
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

}
