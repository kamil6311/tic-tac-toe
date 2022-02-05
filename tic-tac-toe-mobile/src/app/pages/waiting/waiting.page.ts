import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Player } from '../../model/player';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.page.html',
  styleUrls: ['./waiting.page.scss'],
})
export class WaitingPage implements OnInit {

  public psRoomId: string;
  public paPlayers: Array<Player> = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _gameService: GameService
  ) { }

  ngOnInit() {
    this.paPlayers.push(this._gameService.player);
    this._activatedRoute.paramMap.pipe(
      tap((params: ParamMap) => {
        if(params.get('roomId')){
          this.psRoomId = params.get('roomId');
        }
      })
    ).subscribe();
  }

}
