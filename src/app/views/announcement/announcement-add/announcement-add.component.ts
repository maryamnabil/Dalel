import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AnnouncementApiService } from 'src/app/shared/services/api/announcement.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from 'src/app/shared/services/api/admin.service';

import { Router } from '@angular/router';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.scss'],
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
export class AnnouncementAddComponent implements OnInit {
  announcementAddForm: FormGroup;
  formSubmitted = false;
  selectedArtists: string[] = [];
  artists!: any[];
  sendToAllUsers: boolean = false;
  userIds!: any[];

  constructor(
    private fb: FormBuilder,
    private apiService: AnnouncementApiService,
    private apiAdminService: AdminApiService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.announcementAddForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      userIds: [[]],
      sendToAllUsers: [false],
    });
  }
  ngOnInit(): void {
    this.fetchArtists();
  }

  submitForm(): void {
    this.formSubmitted = true;

    if (this.announcementAddForm.valid) {
      const formData = this.announcementAddForm.value;
      const subject = formData.subject;
      const message = formData.message;
      this.userIds = formData.userIds;

      console.log(formData);

      this.apiService
        .sendAnnouncement(subject, message, this.userIds, this.sendToAllUsers)
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.router.navigate(['/admin/announcement/announcements']);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding Announcement:', error);
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
      this.announcementAddForm.get('sendToAllUsers')?.setValue(true);
      this.announcementAddForm.get('userIds')?.setValue([]);
      this.sendToAllUsers = true;
    } else {
      this.announcementAddForm.get('sendToAllUsers')?.setValue(false);
      this.sendToAllUsers = false;
    }
  }

  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'Anounc_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
  cancel(): void {
    this.router.navigate(['/admin/announcement/announcements']);
  }
}
