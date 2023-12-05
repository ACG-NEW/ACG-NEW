import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConditionDropdownComponent } from './access-condition-dropdown/app-condition-dropdown/app-condition-dropdown.component';
import { MaterialModule } from '@/material_ui/material/material.module';
import { FormsModule } from '@angular/forms';
import { HyperlinkRendererComponent } from './hyeprlink/hyeprlink.component';
@NgModule({
  declarations: [AppConditionDropdownComponent, HyperlinkRendererComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
  ],
  exports: [AppConditionDropdownComponent],
})
export class GeneralModule { }

