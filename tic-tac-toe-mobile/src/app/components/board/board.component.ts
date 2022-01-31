import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { takeUntil, tap } from 'rxjs/operators';
import { Player } from '../../model/player';
import { GameService } from '../../services/game.service';
import { ComponentBase } from '../component-base/component-base.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends ComponentBase implements OnInit {

  private _loadingElement: HTMLIonLoadingElement;

  public squares: any[];
  public xIsNext: boolean;
  public winner: string;
  public ennemyPlayer: Player;
  public turnMessage: string;
  public gameEnded: boolean = false;
  public isReplayAsked: boolean = false;
  public playerLeft: boolean = false;
  public win: boolean = false;
  public roomId: string;

  constructor(private _gameService: GameService, private _router: Router, private _loadingCtrl: LoadingController) {
    super();
  }

  public async ngOnInit() {
    if(this._gameService.player.host){
      await this.presentLoader();
    }

    this._gameService.startGame().pipe(
      tap((ennemyPlayer: Player) => {
        this.newGame();
        if(this._gameService.player.turn){
          this.turnMessage = `C'est ton tour de jouer !`;
        }
        else{
          this.turnMessage = `C'est au tour de ${ennemyPlayer.username} de jouer !`;
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this._gameService.onPlayed().pipe(
      tap((ennemyPlayer: Player) => {
        const player = this._gameService.player;

        if(ennemyPlayer.socketId !== player.socketId && !ennemyPlayer.turn){
          this.squares.splice(ennemyPlayer.playedCell, 1, 'O');

          if(ennemyPlayer.win){
            this.turnMessage = `😢 Vous avez perdu !`;
            this.gameEnded = true;
            return;
          }

          this.turnMessage = `C'est ton tour de jouer !`;
          this._gameService.player.turn = true;
        }
        else {

          if(player.win){
            this.turnMessage = `😁 Vous avez gagné !`;
            this.gameEnded = true;
            return;
          }

          this.turnMessage = `C'est au tour de ${ennemyPlayer.username} de jouer !`;
          this._gameService.player.turn = false;
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this._gameService.onReplay().pipe(
      tap((ennemyPlayer: Player) => {
        const player = this._gameService.player;

        if(ennemyPlayer.socketId !== player.socketId){
          this.turnMessage = `${ennemyPlayer.username} propose de rejouer 🔄`;
          this.isReplayAsked = true;
        }
        else {
          this.turnMessage = `Attente de la réponse de ${ennemyPlayer.username}`;
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this._gameService.onEndGame().pipe(
      tap((ennemyPlayer: Player) => {
        if(ennemyPlayer.socketId !== this._gameService.player.socketId){
          this.turnMessage = `${ennemyPlayer.username} à quitté la partie...`;
          this.playerLeft = true;
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this._gameService.onEquality().pipe(
      tap(() => {
        this.turnMessage = `Égalité !`;
        this.gameEnded = true;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public newGame(): void {
    this.squares = Array(9).fill(null);
    this.gameEnded = false;
    if(this._loadingElement){
      this._loadingElement.dismiss();
    }
  }

  public replay(): void {
    this._gameService.replay();
  }

  public acceptReplay(): void {
    this._gameService.newGame();
    this.isReplayAsked = false;
  }

  public endGame(){
    this._gameService.endGame();
    this._router.navigateByUrl('/home');
  }

  public quit(): void{
    this._router.navigateByUrl('/home');
  }

  public makeMove(index: number): void {
    if(this._gameService.player.turn && !this.squares[index]){

      this.squares.splice(index, 1, 'X');

      if(this.calculateWinner() && this.calculateWinner() === 'X'){
        this.win = true;
      }
      this._gameService.play(index, this.win);

      if((this.squares.filter((sq) => sq === null).length == 0) && !this.win){
        this._gameService.equality();
      }
    }
  }

  public calculateWinner(): string {

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }

  private async presentLoader(): Promise<void> {
    this._loadingElement = await this._loadingCtrl.create({
      message: `En attente d'un deuxième joueur (Id: ${this._gameService.player.roomId})`,

      animated: true,
      spinner: 'bubbles',
    });

    await this._loadingElement.present();
  }

}
