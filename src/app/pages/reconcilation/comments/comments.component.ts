import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ConfirmationDialogComponent } from '@pages/confirmation-dialog/confirmation-dialog.component';
import { ReconcilationService } from '@services/reconcilation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubSink } from 'subsink';
import { commentsClass } from '../../../modules/modal/comments.modal';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  public dataSource: any = [];
  public sideList: any = [];
  public standardrmarkList: any = [];
  public actionTypeList: any = [];
  private commentCls: commentsClass;
  private role: string;
  private formattedArray: any = [];
  public deleteData: any = [];
  public pspSide: any = [];
  public ezeSide: any = [];
  public unDecided: any = [];
  public both: any = [];
  @ViewChild('table') table: MatTable<Element>;
  displayedColumns = [
    'sno',
    'clear',
    'date',
    'user',
    'userrole',
    'side',
    'standardremarks',
    'actiontype',
    'role',
    'remarks',
    'delete'
  ];
  constructor(private matDialogRef: MatDialogRef<CommentsComponent>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private _toaster: ToastrService,
    private subSink: SubSink, private _loader: NgxUiLoaderService, private reconService: ReconcilationService) {
    this.subSink = new SubSink();
    this.commentCls = new commentsClass();
  }

  ngOnInit(): void {
    this.role = this.data.subAcRole;
    this.fetchComments(this.data);
  }
  fetchComments(data: any) {
    try {
      this.commentCls.pspSubAccId = data.pspSubAccId;
      this.commentCls.sourceSide = data.sourceSide;
      this.commentCls.recordId = data.recordId;
      const body = {
        pspSubAccId: data.pspSubAccId,
        sourceSide: data.sourceSide,
        recordId: data.recordId
      }
      this._loader.start();
      this.subSink.sink = this.reconService.fetchComments(data.subAcRole, body).subscribe((res: any) => {
        this._loader.stop();
        this.sideList = res.ModificationSideList;
        this.standardrmarkList = res.RemarksList;
        this.actionTypeList = res.ActionList2
        this.pspSide = res.PSPSIDE;
        this.ezeSide = res.EZESIDE;
        this.unDecided = res.UNDECIDED;
        this.both = res.BOTH;
        this.dataSource = res.CommentsList;
        if (this.dataSource.length > 0) {

          for (let i = 0; i < this.dataSource.length; i++) {
            this.dataSource[i].actiontype = this.removeChar(this.dataSource[i].actiontype)
          }
        }

      });
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')

    }
  }
  removeChar(name: string) {
    const str = name;
    const parts = str.split(':*:');
    return parts[0];
  }
  Cancel() {
    this.dataSource = [];
    this.matDialogRef.close(false)
  }

  clearRow(row, i) {
    this.dataSource[i].date = "";
    this.dataSource[i].user = "";
    this.dataSource[i].userrole = "";
  }

  addRow() {
    const obj = ({
      commentDate: new Date(),
      userName: sessionStorage.getItem('user'),
      userRole: this.role,
      modificationSide: '',
      stdRemarks: '',
      actiontype: '',
      refferdRole: '',
      remarks: '',
      lineId: '',
      pspSubAccId: '',
      commentId: '',
      sourceSide: '',
      hfield: '',
      recordId: ''
    });
    this.dataSource.push(obj);
    this.table.renderRows();
  }
  updateRefferdRole(row, i) {
    this.dataSource[i].refferdRole = this.dataSource[i].actiontype;
  }
  save() {
    try {
      if (this.dataSource.length > 0) {
        for (let i = 0; i < this.dataSource.length; i++) {
          // this.dataSource.lookUpId = this.lookupHeaderId;
          const datePipe = new DatePipe('en-US');
          this.formattedArray = this.dataSource.map(obj => {
            const formattedObj = { ...obj };
            // formattedObj.lookUpId = this.lookupHeaderId;
            if (obj.commentDate == 'Invalid Date') {
              obj.lookupToDate = "";
            }
            if (obj.commentDate) {
              formattedObj.commentDate = datePipe.transform(obj.commentDate, 'dd/MM/yyyy');
            }
            return formattedObj;
          });
          if (this.dataSource[i].modificationSide == "") {
            alert("In row No: " + (i + 1) + " Please enter modificationSide");
            return;
          }
          if (this.dataSource[i].stdRemarks == "") {
            alert("In row No: " + (i + 1) + " Please enter stdRemarks");
            return;
          }
          if (this.dataSource[i].actiontype == "") {
            alert("In row No: " + (i + 1) + " Please enter actiontype");
            return;
          }
          if (this.dataSource[i].modificationSide == null || this.dataSource[i].stdRemarks == null || this.dataSource[i].actiontype == null) {
            alert("In row No: " + (i + 1) + " is missing some mandatory fields");
            return;
          }
        }

      }
      this.commentCls.modifiedCommentsLines = this.formattedArray;
      this._loader.start();
      this.subSink.sink = this.reconService.saveUpdateComments(this.role, this.commentCls).subscribe((res: any) => {
        this._loader.stop();
        if (res) {
          if (res.info != undefined && res.info != '' && res.info != null) {
            this._toaster.success(res.info, 'Success');
            this.Cancel();
          }
          else {
            this._toaster.error(res.error, 'Error');
          }
        }
      });
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  Delete(e, row, i) {
    const index = this.commentCls.deleteCommentsLines.indexOf(row.commentId);
    if (index === -1) {
      if (e.target.checked) {
        this.openDialog(row, i);
      } else {

        this.commentCls.deleteCommentsLines = [];
      }
    }
  }
  openDialog(row, i) {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '250px', data: 'Are you sure you want to delete?', }); dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked Yes     
        row.deleted = true;
        this.commentCls.deleteCommentsLines.push(row);
        this.dataSource.splice(i, 1);
        this.table.renderRows();
      } else {

      }
    });
  }


}
