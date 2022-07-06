import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {GrowingComponent} from "./growing/growing.component";
import {LinkingComponent} from "./linking/linking.component";

const routes: Routes = [
  {path : '', redirectTo: 'menu', pathMatch : 'full'},
  {path : 'menu', component : MenuComponent},
  {path : 'Growing', component : GrowingComponent},
  {path : 'Linking', component : LinkingComponent},

];

// @ts-ignore
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
