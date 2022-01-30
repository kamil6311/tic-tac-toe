import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SquareComponent } from './square.component';



@NgModule({
  declarations: [SquareComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [SquareComponent]
})
export class SquareModule { }
