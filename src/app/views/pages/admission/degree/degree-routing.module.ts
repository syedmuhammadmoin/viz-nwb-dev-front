import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateDegreeComponent } from './create-degree/create-degree.component';
import { DegreeListComponent } from './degree-list/degree-list.component';


const routes: Routes = [
  {
    path: '' ,
    children:[
      {
        path: CRUD_ROUTES.LIST,
        component: DegreeListComponent
      }
    ]
  },
  {
    path: '',
    children:[
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateDegreeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DegreeRoutingModule { }
