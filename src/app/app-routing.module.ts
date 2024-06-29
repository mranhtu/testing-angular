import { NgModule } from '@angular/core';
import {BudgetBuilderComponent} from "./budget-builder/budget-builder.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', component: BudgetBuilderComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
