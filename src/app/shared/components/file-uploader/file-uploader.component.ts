import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploaderComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [NgxDropzoneModule, NgIf, MatIconModule, TranslateModule],
})
export class FileUploaderComponent implements ControlValueAccessor {
  @Input() title: string = 'Attachments';
  @Input() disabled = false;
  @Output() onRemoveFile = new EventEmitter<any>();
  imageSrc: any;

  onChange = (_: any) => {};
  onTouch = (_: any) => {};

  writeValue(value: any): void {
    if (value) {
      this.imageSrc = environment.assetsUrl + value;
    } else {
      this.imageSrc = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileSelect(event: any) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      const files: File[] = event.addedFiles;
      const firstFile: File = files[0];
      if (firstFile) {
        const file = firstFile;
        this.onChange(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(firstFile); // Read
      } else {
        console.error('No files added.');
      }
    } else {
      console.error('No files added.');
    }
  }

  removeFile(event: any) {
    event.stopPropagation();
    this.onRemoveFile.emit();
    this.imageSrc = null;
    this.onChange(null);
  }
}
