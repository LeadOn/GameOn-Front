import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HalterodataPocRoutingModule } from './halterodata-poc-routing.module';
import { HalterodataPocLayoutComponent } from './halterodata-poc-layout.component';
import { HalterodataPocHomeComponent } from './home/halterodata-poc-home.component';

@NgModule({
  declarations: [HalterodataPocLayoutComponent, HalterodataPocHomeComponent],
  imports: [
    CommonModule,
    HalterodataPocRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HalterodataPocModule {}
