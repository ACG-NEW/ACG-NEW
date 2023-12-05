import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
selector: 'app-lnk-rnder',
template: '<span class="lnkrenderer" (click)="invokeLnkClick()">{{params.value}}</span>'
})

export class HyperlinkRendererComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any) {

    this.params = params;
  }

  public invokeLnkClick() {
    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onLnkClicked({row: this.params.rowIndex + 1, data: this.params.data});
    } else {
      console.error('componentParent is not available in the context.');
    }
    // this.params.context.componentParent.onLnkClicked({row: this.params.rowIndex + 1, data: this.params.data});
  }

  refresh(): boolean {
    return false;
  }
}
