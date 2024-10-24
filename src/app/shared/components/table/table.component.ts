import {
  AsyncPipe,
  DatePipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SecureUrlPipe } from '../../pipes/secure-url.pipe';
import { LocalizedNamePipe } from '../../pipes/localized-name.pipe';

export class TableConfigItem {
  column: string;
  value: (data: any) => any;
  type?:
    | 'text'
    | 'photo'
    | 'contentTemplate'
    | 'textLocalized'
    | 'date'
    | 'link'
    | 'routeLink';
  class?: string;
  localizedKey?: string = 'name';
  link?: (data: any) => any; // For link types
  routeLink?: (data: any) => any; // For routeLink types
  contentTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    TranslateModule,
    NgIf,
    NgFor,
    SecureUrlPipe,
    AsyncPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
    LocalizedNamePipe,
    DatePipe,
    RouterLink,
  ],
})
export class TableComponent {
  dataSource = new MatTableDataSource();
  displayedColumns: string[];
  totalRecords: number;
  configs: TableConfigItem[];

  @Input({ required: true }) set tableConfig(config: TableConfigItem[]) {
    this.configs = config;
    this.setDisplayedColumns();
  }
  @Input({ required: true }) set responseData(response: any) {
    if (response) {
      this.totalRecords = response?.pagination?.totalRecords ?? 0;
      this.dataSource.data = response?.data ?? response ?? [];
      this.dataSource.paginator = this.paginator;
    }
  }
  @Input() pageSize: number;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() showViewDetails = true;
  @Input() viewDetailsUrl: string;
  @Input() showDelete = true;
  @Input() showEdit = true;
  @Input() editUrl: string;
  @Input() showActions = true;
  @Input() showPagination = true;

  @Output() onDeleteEvt = new EventEmitter<number>();
  @Output() onPageChangeEvt = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor() {
    this.dataSource.data = [];
  }

  ngOnInit() {}

  setDisplayedColumns() {
    setTimeout(() => {
      const columns = this.configs?.map((item) => item.column) || [];

      this.displayedColumns = this.showActions
        ? [...columns, 'actions']
        : columns;
    }, 0);
  }

  getValue(data: any, column: string): any {
    const configItem = this.configs.find((item) => item.column === column);
    if (configItem) {
      return configItem.value(data);
    }
    return undefined;
  }

  getLink(data: any, column: string): any {
    const configItem = this.configs.find((item) => item.column === column);
    if (configItem && configItem.link) {
      return configItem.link(data);
    }
    return undefined;
  }

  getRouteLink(data: any, column: string): any {
    const configItem = this.configs.find((item) => item.column === column);
    if (configItem && configItem.routeLink) {
      return configItem.routeLink(data);
    }
    return undefined;
  }

  onPageChanged(event: any) {
    this.onPageChangeEvt.emit(event);
  }

  delete(id: number) {
    this.onDeleteEvt.emit(id);
  }
}
