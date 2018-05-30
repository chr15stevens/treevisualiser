import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { DataComponent } from './data/data.component';
import { LeafnodeComponent } from './leafnode/leafnode.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    DataComponent,
    LeafnodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
