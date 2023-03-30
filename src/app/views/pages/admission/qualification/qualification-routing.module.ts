import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateQualificationComponent } from './create-qualification/create-qualification.component';
import { ListQualificationComponent } from './list-qualification/list-qualification.component';


const routes: Routes = [
  {
    path: '' ,
    children:[
      {
        path: CRUD_ROUTES.LIST,
        component: ListQualificationComponent
      }
    ]
  },
  {
    path: '',
    children:[
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateQualificationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualificationRoutingModule { }
