import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InboxApiService } from 'src/app/shared/services/api/inbox.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from 'src/app/shared/services/api/admin.service';
import { Router } from '@angular/router';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-inbox-add',
  templateUrl: './inbox-add.component.html',
  styleUrls: ['./inbox-add.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
})
export class InboxAddComponent implements OnInit {
  inboxAddForm: FormGroup;
  formSubmitted = false;
  artists: any[] = [];
  userIds: any[] = [];
  sendToAllUsers: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: InboxApiService,
    private apiAdminService: AdminApiService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.inboxAddForm = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      message: ['', Validators.required],
      messageAr: ['', Validators.required],
      userIds: [[]],
      sendToAllUsers: [false],
    });
  }

  ngOnInit(): void {
    this.fetchArtists();
  }

  submitForm(): void {
    this.formSubmitted = true;

    if (this.inboxAddForm.valid) {
      const formData = this.inboxAddForm.value;
      const titleEn = formData.titleEn;
      const titleAr = formData.titleAr;
      const message = formData.message;
      const messageAr = formData.messageAr;
      this.userIds = formData.userIds;

      this.apiService
        .sendMessage(
          titleEn,
          titleAr,
          message,
          messageAr,
          this.userIds as [],
          this.sendToAllUsers
        )
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.router.navigate(['/admin/inbox/inbox-list']);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding Inbox message:', error);
          }
        );
    }
  }

  fetchArtists(): void {
    this.apiAdminService.getArtists().subscribe(
      (response) => {
        this.artists = response.data;
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }
  onCheckboxChange(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.inboxAddForm.get('sendToAllUsers')?.setValue(true);
      this.inboxAddForm.get('userIds')?.setValue([]);
      this.sendToAllUsers = true;
    } else {
      this.inboxAddForm.get('sendToAllUsers')?.setValue(false);
      this.sendToAllUsers = false;
    }
  }

  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'Inbox_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/inbox/inbox-list']);
  }
}
