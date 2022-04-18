import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { Error404Component } from './error404/error404.component';
import { Error403Component } from './error403/error403.component';
import { Error500Component } from './error500/error500.component';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ErrorComponent, 
    Error404Component, 
    Error403Component, 
    Error500Component
  ],
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorComponent,
        children: [
          {
            path: '404',
            component: Error404Component,
          },
          {
            path: 'unauthorized',
            component: Error403Component
          },
          {
            path: '500',
            component: Error500Component
          }
        ],
      },
    ]),
  ]
})
export class ErrorModule { }
