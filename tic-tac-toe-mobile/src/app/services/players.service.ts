import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Player } from '../model/player';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private $player: Observable<Player> = new Observable<Player>(obs => obs.next(new Player("", "")));

  constructor(private _gameService: GameService) {

  }

  public setPlayer(username: string, room: string): Observable<any> {
    return this.$player.pipe(
      concatMap((player: Player) => {
        return this._gameService.getNbPlayersRoom(room).pipe(
          map((response: {nbPlayers: number}) => {
            let userValue = 'X';
            if(response.nbPlayers > 0){
              userValue = 'O';
            }
            return new Player(username, userValue)
          })
        )
      })
    );
  }

  public get player(): Observable<Player> {
    return this.$player;
  }
}
