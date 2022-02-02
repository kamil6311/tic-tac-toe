import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SquareModule } from '../square/square.module';
import { BoardComponent } from './board.component';



@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    SquareModule,
    IonicModule,
  ],
  exports: [BoardComponent]
})
export class BoardModule { }
