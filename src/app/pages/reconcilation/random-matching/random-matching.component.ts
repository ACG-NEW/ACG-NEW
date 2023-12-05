import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ReconcilationService } from '@services/reconcilation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-random-matching',
  templateUrl: './random-matching.component.html',
  styleUrls: ['./random-matching.component.scss']
})
export class RandomMatchingComponent implements OnInit {
  @ViewChild('table') table: MatTable<Element>;
  @Output() dataSaved = new EventEmitter<any>();
  public dataSource: any = [];
  public RowData: any = [];
  public areButtonsDisabled: boolean = true;
  displayedColumns = [
    'slash',
    'condition',
    'columnName',
    'dataType',
    'operand',
    'value',
    'add',
    'clear',
    'result'
  ];
  public columnNameLsit: any = [];
  public stringOperands: any = [];
  public numberOperands: any = [];
  public dateOperands: any = [];
  public conditions: any = [];
  constructor(private matDialogRef: MatDialogRef<RandomMatchingComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _toaster: ToastrService,
    private subSink: SubSink, private _loader: NgxUiLoaderService,
    private recoService: ReconcilationService) { }
  ngOnInit(): void {
    this.getlovs();
    const Obj = ({
      clear: '',
      slash: '1',
      condition: 'AND',
      columnName: '',
      dataType: '',
      operand: '',
      value: '',
      add: '',
      result: '',
    });
    this.dataSource.push(Obj);
    // this.table.renderRows();
  }
  operand(row, i) {
    //console.log('from operand change event');
    // console.log(row, i);
    row.value = '';
    row.result = '';
    if (row.operand === 'substr' && row.dataType == 'VARCHAR2') {
      alert('Enter [Value Start Position, End Position] format');
    }
    else if ((row.operand === 'IN' && row.dataType === 'VARCHAR2') || (row.operand === 'NOT IN' && row.dataType === 'VARCHAR2')) {
      alert('Enter Data in [Value1,Value2,...] format');
      return;
    }
    else if ((row.operand === 'IN' && row.dataType === 'NUMBER') || (row.operand === 'NOT IN' && row.dataType === 'NUMBER')) {
      alert('Enter Data in [Value1,Value2,...] format');
    }
    if ((row.operand === 'IN' && row.dataType === 'DATE') || (row.operand === 'NOT IN' && row.dataType === 'DATE')) {
      alert('Enter Data in [Value1,Value2,...] format');
      return;
    }
    else if ((row.operand === 'Btw' && row.dataType === 'NUMBER')) {
      alert('Enter Data in [Value1,Value2] format');
    } else if (row.slash === "") {
      alert('S.no Required');
    }
  }
  clearData(row, i) {
    row.value = '';
    row.result = '';
    row.operand = '';
  }
  addResult(row, i) {
    //console.log(row);
    if (row.result === '') {
      this.areButtonsDisabled = false;
    } else {
      this.areButtonsDisabled = true;
    }
    if (row.dataType == 'varchar2'.toUpperCase() || row.dataType == 'VARCHAR2'.toLowerCase()) {
      if (row.operand == 'In'.toUpperCase() || row.operand == 'IN'.toLowerCase()) {
        if (row.columnName == '') {
          alert("Enter Value");
        }
        else {
          let values = row.value.split(',');
          let formattedValues = values.map(value => `'${value.trim()}'`);
          let formattedValueStr = formattedValues.join(',');
          row.result = `${row.condition} F_${row.columnName.label} ${row.operand} (${formattedValueStr})`;
        }
      }
      else if (row.operand == 'Not In'.toUpperCase() || row.operand == 'NOT IN'.toLowerCase()) {
        if (row.columnName == '') {
          alert("Enter Value");
        }
        else {
          let values = row.value.split(',');
          let formattedValues = values.map(value => `'${value.trim()}'`);
          let formattedValueStr = formattedValues.join(',');
          row.result = `${row.condition} F_${row.columnName.label} ${row.operand} (${formattedValueStr})`;
        }
      }

      if (row.operand == 'Like') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " '" + row.value + "'";
        }
      }

      if (row.operand == 'Not Like') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " '" + row.value + "'";
        }
      }
      else if (row.operand == 'Like%') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "Like" + " '" + row.value + "%" + "'";
        }
      }
      else if (row.operand == '%Like') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "Like" + " '" + "%" + row.value + "'";
        }
      }
      else if (row.operand == '%Like%') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "Like" + " '" + "%" + row.value + "%" + "'";
        }
      }
      else if (row.operand == 'Not Like%') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "Not Like" + " '" + row.value + "%" + "'";
        }
      }
      else if (row.operand == 'Not %Like') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "Not Like" + " '" + "%" + row.value + "'";
        }
      }
      else if (row.operand == 'Not %Like%') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "Not Like" + " '" + "%" + row.value + "%" + "'";
        }
      }
      else if (row.operand == 'IS NULL') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand;
        }
      }
      else if (row.operand == 'IS NOT NULL') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand;
        }
      }
      else if (row.operand == '=') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " '" + row.value + "'";
        }
      }
      else if (row.operand == '!=') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " '" + row.value + "'";
        }
      }
      else if (row.operand == 'substr') {

        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          // alert('Enter [Value Start Position, End Position] format');
          row.result = row.condition + " " + ("F_" + row.columnName.label) + "=" + row.operand + "(" + " '" + row.value + "'" + ")";
        }
      }
    }
    if (row.dataType == 'number'.toUpperCase() || row.dataType == 'NUMBER'.toLowerCase()) {
      if (row.operand == 'In'.toUpperCase() || row.operand == 'IN'.toLowerCase()) {
        if (row.columnName == '') {
          alert("Enter Value");
        }
        else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + "(" + row.value + ")";
        }
      }
      else if (row.operand == 'Not In'.toUpperCase() || row.operand == 'NOT IN'.toLowerCase()) {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + "(" + row.value + ")";
        }
      }
      else if (row.operand == '>') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + row.value;
        }
      }
      else if (row.operand == '<') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + row.value;
        }
      }
      else if (row.operand == '>=') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + row.value;
        }
      }
      else if (row.operand == '<=') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + row.value;
        }
      }
      else if (row.operand == '=') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + row.value;
        }
      }
      else if (row.operand == '!=') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand + " " + row.value;
        }
      }
      else if (row.operand == 'IS NULL') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand;
        }
      }
      else if (row.operand == 'IS NOT NULL') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + row.operand;
        }
      }
      else if (row.operand == 'Btw') {
        if (row.columnName == '') {
          alert("Enter Value");
        } else {
          row.result = row.condition + " " + ("F_" + row.columnName.label) + " " + "BETWEEN" + row.value;
        }
      }
      // Btw
    }
    if (row.dataType == 'date'.toUpperCase() || row.dataType == 'DATE'.toLowerCase()) {
      if (row.operand == 'In'.toUpperCase() || row.operand == 'IN'.toLowerCase()) {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        }
        else {
          if (this.validateDateInput(row.value)) {
            const dateValues = row.value.split(',');
            const dateStrings = dateValues.map(date => `to_date('${date}','dd/MM/yyyy')`);
            const dateRange = dateStrings.join(', ');
            row.result = `${row.condition} F_${row.columnName.label} ${row.operand} (${dateRange})`;
          };
          // row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == 'Not In'.toUpperCase() || row.operand == 'NOT IN'.toLowerCase()) {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            const dateValues = row.value.split(',');
            const dateStrings = dateValues.map(date => `to_date('${date}','dd/MM/yyyy')`);
            const dateRange = dateStrings.join(', ');

            row.result = `${row.condition} F_${row.columnName.label} ${row.operand} (${dateRange})`;
          };
          // const dateValues = row.value.split(',');
          // const dateStrings = dateValues.map(date => `to_date('${date}','dd/MM/yyyy')`);
          // const dateRange = dateStrings.join(', ');
          // row.result = `${row.condition} F_${row.columnName.label} ${row.operand} (${dateRange})`;
          // row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == '>') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
          }
        }
      }
      else if (row.operand == '<') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
          }
          // row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == '>=') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
          }
          // row.result = row.condition + " " + "F" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == '<=') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
          }
          // row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == '=') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
          }
          // row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == '!=') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          if (this.validateDateInput(row.value)) {
            row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
          }
          // row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')";
        }
      }
      else if (row.operand == 'IS NULL') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand;
        }
      }
      else if (row.operand == 'IS NOT NULL') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand;
        }
      }
      else if (row.operand == 'Btw') {
        if (row.columnName == '') {
          alert("Enter Value");
          return;
        } else {
          let str = row.value;
          let dates = str.split(",");
          if (dates.length != 2 || !this.validateDateInput(dates[0]) || !this.validateDateInput(dates[1])) {
            alert('Please enter valid dates in the format dd/mm/yyyy separated by a comma.');
            return
          } else {
            row.result = "AND F_" + row.columnName.label + " BETWEEN to_date('" + row.value.split(',')[0] + "','dd/MM/yyyy') and to_date('" + row.value.split(',')[1] + "','dd/MM/yyyy')";
          }

        }
      }
	  }

    // if (row.dataType == 'date'.toUpperCase() || row.dataType == 'DATE'.toLowerCase()) {
    //   if (row.operand == 'In'.toUpperCase() || row.operand == 'IN'.toLowerCase()) {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     }
    //     else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == 'Not In'.toUpperCase() || row.operand == 'NOT IN'.toLowerCase()) {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == '>') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == '<') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == '>=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == '<=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == '=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == '!=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand + " " + "" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    //   else if (row.operand == 'IS NULL') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand;
    //     }
    //   }
    //   else if (row.operand == 'IS NOT NULL') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + row.operand;
    //     }
    //   }
    //   else if (row.operand == 'Btw') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + "F_" + row.columnName.label + " " + "BETWEEN" + " " + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy')";
    //     }
    //   }
    // }
    // if (row.dataType == 'date'.toUpperCase() || row.dataType == 'DATE'.toLowerCase()) {
    //   if (row.operand == 'In'.toUpperCase() || row.operand == 'IN'.toLowerCase()) {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     }
    //     else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == 'Not In'.toUpperCase() || row.operand == 'NOT IN'.toLowerCase()) {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == '>') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == '<') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == '>=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == '<=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == '=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == '!=') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   else if (row.operand == 'IS NULL') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand;
    //     }
    //   }
    //   else if (row.operand == 'IS NOT NULL') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand;
    //     }
    //   }
    //   else if (row.operand == 'Btw') {
    //     if (row.columnName == '') {
    //       alert("Enter Value");
    //     } else {
    //       row.result = row.condition + " " + row.columnName.label + " " + row.operand + " " + "(" + 'to_date' + "('" + row.value + "','dd/MM/yyyy')" + ",to_date('" + row.value + "','dd/MM/yyyy'))";
    //     }
    //   }
    //   // Btw
    // }
  }
  validateDateInput(value: string) {
    const pattern = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!pattern.test(value)) {
      alert('Please enter a date in the dd/MM/YYYY format.');
      return false;
    } else {
      return true
    }
  }

  getlovs() {
    try {
      this._loader.start();
      this.subSink.sink = this.recoService.getRandomMatchLOVS().subscribe((res: any) => {
        this._loader.stop();
        //console.log(res);
        this.conditions = res.conditions;
        this.columnNameLsit = res.columnNames;
        this.stringOperands = res.stringOperands;
        this.numberOperands = res.numberOperands;
        this.dateOperands = res.dateOperands;
      });
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  cancel() {
    this.dataSource = [];
    this.CloseDialog();
  }
  CloseDialog() {
    this.matDialogRef.close('')
  }
  onColumnChange(row, i) {
    //console.log(row.columnName.value);
    this.dataSource[i].dataType = row.columnName.value;
  }
  clearRow(row, i) { }
  addRow() {
    const obj = ({
      clear: '',
      slash: '1',
      condition: 'AND',
      columnName: '',
      dataType: '',
      operand: '',
      value: '',
      add: '',
      result: ''
    });
    this.dataSource.push(obj);
    //this.dataSource = new MatTableDataSource(this.rowData);
    this.table.renderRows();
  }
  Query() {
    //console.log(this.dataSource);
    // const obj = this.dataSource[this.dataSource.length - 1];

    // Update the type property of the obj object
    // obj.type = "Query";
    const type = "Query";
    this.dataSaved.emit({ dataSource: this.dataSource, type: type });
    this.matDialogRef.close('')
  }
  AllPsp() {

    const type = "AllPsp";
    this.dataSaved.emit({ dataSource: this.dataSource, type: type });
    this.dataSaved.emit(this.dataSource);
    this.matDialogRef.close('')
  }

  Delete(i) {
    this.dataSource.splice(i, 1);
    this.table.renderRows();

  }
  onValueChange(row, i) {

  }
}
