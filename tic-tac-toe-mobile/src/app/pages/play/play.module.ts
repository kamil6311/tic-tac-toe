import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BoardModule } from 'src/app/components/board/board.module';
import { PlayPageRoutingModule } from './play-routing.module';
import { PlayPage } from './play.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayPageRoutingModule,
    BoardModule
  ],
  declarations: [PlayPage],
})
export class PlayPageModule {}
