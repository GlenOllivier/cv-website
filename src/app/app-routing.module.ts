import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CvComponent } from './cv/cv.component';
import { ProjetsComponent } from './projets/projets.component';
import { ContactComponent } from './contact/contact.component';
import { RayCastingComponent } from './ray-casting/ray-casting.component';


const routes: Routes = [
  { path: '', redirectTo: 'cv', pathMatch: 'full' },
  { path: 'cv', component: CvComponent },
  { path: 'projets', component: ProjetsComponent},
  { path:'contact', component: ContactComponent},
  { path:'projets/ray-casting', component: RayCastingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
