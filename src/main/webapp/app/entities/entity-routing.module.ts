import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'client',
        data: { pageTitle: 'coopCycleJHipsterApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'livreur',
        data: { pageTitle: 'coopCycleJHipsterApp.livreur.home.title' },
        loadChildren: () => import('./livreur/livreur.module').then(m => m.LivreurModule),
      },
      {
        path: 'commercant',
        data: { pageTitle: 'coopCycleJHipsterApp.commercant.home.title' },
        loadChildren: () => import('./commercant/commercant.module').then(m => m.CommercantModule),
      },
      {
        path: 'cooperative',
        data: { pageTitle: 'coopCycleJHipsterApp.cooperative.home.title' },
        loadChildren: () => import('./cooperative/cooperative.module').then(m => m.CooperativeModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'coopCycleJHipsterApp.commande.home.title' },
        loadChildren: () => import('./commande/commande.module').then(m => m.CommandeModule),
      },
      {
        path: 'paiement',
        data: { pageTitle: 'coopCycleJHipsterApp.paiement.home.title' },
        loadChildren: () => import('./paiement/paiement.module').then(m => m.PaiementModule),
      },
      {
        path: 'delivery-man',
        data: { pageTitle: 'coopCycleJHipsterApp.deliveryMan.home.title' },
        loadChildren: () => import('./delivery-man/delivery-man.module').then(m => m.DeliveryManModule),
      },
      {
        path: 'trader',
        data: { pageTitle: 'coopCycleJHipsterApp.trader.home.title' },
        loadChildren: () => import('./trader/trader.module').then(m => m.TraderModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'coopCycleJHipsterApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'coopCycleJHipsterApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
