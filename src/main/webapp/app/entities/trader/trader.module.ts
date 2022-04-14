import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TraderComponent } from './list/trader.component';
import { TraderDetailComponent } from './detail/trader-detail.component';
import { TraderUpdateComponent } from './update/trader-update.component';
import { TraderDeleteDialogComponent } from './delete/trader-delete-dialog.component';
import { TraderRoutingModule } from './route/trader-routing.module';

@NgModule({
  imports: [SharedModule, TraderRoutingModule],
  declarations: [TraderComponent, TraderDetailComponent, TraderUpdateComponent, TraderDeleteDialogComponent],
  entryComponents: [TraderDeleteDialogComponent],
})
export class TraderModule {}
