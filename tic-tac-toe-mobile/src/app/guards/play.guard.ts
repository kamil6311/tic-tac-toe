import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayGuard implements CanActivate {

  constructor(private _gameService: GameService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(!this._gameService.player.username){
      this._router.navigateByUrl('/home');
      return false;
    }
    return true;
  }

}
