import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';


import { HomeComponent } from './pages/home/home.component';
import { ColumnSortingModule } from './components/column-sorting/column-sorting.module';

@NgModule({
  imports: [
    BrowserModule,
    ColumnSortingModule,
    RouterModule.forRoot([
      {
        path: '**',
        component: HomeComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
