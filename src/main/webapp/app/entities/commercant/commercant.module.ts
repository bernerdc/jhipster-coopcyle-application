import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommercantComponent } from './list/commercant.component';
import { CommercantDetailComponent } from './detail/commercant-detail.component';
import { CommercantUpdateComponent } from './update/commercant-update.component';
import { CommercantDeleteDialogComponent } from './delete/commercant-delete-dialog.component';
import { CommercantRoutingModule } from './route/commercant-routing.module';

@NgModule({
  imports: [SharedModule, CommercantRoutingModule],
  declarations: [CommercantComponent, CommercantDetailComponent, CommercantUpdateComponent, CommercantDeleteDialogComponent],
  entryComponents: [CommercantDeleteDialogComponent],
})
export class CommercantModule {}
