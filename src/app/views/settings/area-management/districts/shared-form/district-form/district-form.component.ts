import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-district-form',
  templateUrl: './district-form.component.html',
  styleUrls: ['./district-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TranslateModule,
    CommonModule,
  ],
})
export class DistrictFormComponent {
  @Input() districtForm!: FormGroup;
  @Input() formSubmitted!: boolean;
  @Output() updateForm: EventEmitter<any> = new EventEmitter();

  data: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.addDistrict();
  }

  districts(): FormArray {
    return this.districtForm.get('districts') as FormArray;
  }

  newDistrict(name?: any, nameAr?: any): FormGroup {
    return this.fb.group({
      name: name ? name : '',
      nameAr: nameAr ? nameAr : '',
    });
  }
  addDistrict(name?: any, nameAr?: any) {
    this.districts().push(this.newDistrict(name, nameAr));
    this.updateForm.emit(this.districtForm);
  }

  removeDistrict(i: number) {
    this.districts().removeAt(i);
    this.updateForm.emit(this.districtForm);
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <any>XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log('data:', this.data);
      this.removeDistrict(0);
      for (let i = 1; i < this.data.length; i++) {
        this.addDistrict(this.data[i][0], this.data[i][1]);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }
}