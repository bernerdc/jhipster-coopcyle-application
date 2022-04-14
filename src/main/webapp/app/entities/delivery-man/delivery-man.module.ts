import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DeliveryManComponent } from './list/delivery-man.component';
import { DeliveryManDetailComponent } from './detail/delivery-man-detail.component';
import { DeliveryManUpdateComponent } from './update/delivery-man-update.component';
import { DeliveryManDeleteDialogComponent } from './delete/delivery-man-delete-dialog.component';
import { DeliveryManRoutingModule } from './route/delivery-man-routing.module';

@NgModule({
  imports: [SharedModule, DeliveryManRoutingModule],
  declarations: [DeliveryManComponent, DeliveryManDetailComponent, DeliveryManUpdateComponent, DeliveryManDeleteDialogComponent],
  entryComponents: [DeliveryManDeleteDialogComponent],
})
export class DeliveryManModule {}
