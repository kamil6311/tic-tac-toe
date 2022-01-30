import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../model/player';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private $player: Observable<Player> = new Observable<Player>(obs => obs.next(new Player("", true, true, "")));

  constructor(private _gameService: GameService) {

  }

  public setPlayer(username: string): Observable<any> {
    return this.$player.pipe(
      map(() => new Player(username, true, true, this._gameService.socketId))
    );
  }

  public get player(): Observable<Player> {
    return this.$player;
  }
}
