import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
import { ListSubjectComponent } from './list-subject/list-subject.component';


const routes: Routes = [
  {
    path: '' ,
    children:[
      {
        path: CRUD_ROUTES.LIST,
        component: ListSubjectComponent
      }
    ]
  },
  {
    path: '',
    children:[
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateSubjectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
