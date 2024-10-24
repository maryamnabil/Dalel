import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ChatApiService } from '../../services/api/chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SecureUrlPipe } from '../../pipes/secure-url.pipe';

@Component({
  selector: 'app-chat-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    NgFor,
    TranslateModule,
    DatePipe,
    SecureUrlPipe,
    AsyncPipe,
  ],
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss'],
})
export class ChatPopupComponent implements OnInit {
  page = 1;
  pageSize = 10;
  isLoading: boolean = false;
  chats: any[] = [];
  totalRecords: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChatPopupComponent>,
    private apiService: ChatApiService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.getChats();
  }

  getChats() {
    this.isLoading = true;
    this.apiService
      .getChat(+this.data?.projectId!, this.page, this.pageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        this.totalRecords = res?.pagination?.totalRecords;
        this.chats = [...this.chats, ...res?.data];
      });
  }

  onLoadMore() {
    this.page++;
    this.getChats();
  }
}
