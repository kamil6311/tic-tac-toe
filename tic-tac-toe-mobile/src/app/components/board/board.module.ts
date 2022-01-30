import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SquareModule } from '../square/square.module';
import { BoardComponent } from './board.component';



@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    SquareModule
  ],
  exports: [BoardComponent]
})
export class BoardModule { }
