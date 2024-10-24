import { Component, Input } from '@angular/core';
import { DateFilterComponent } from '../../date-filter/date-filter.component';

@Component({
    selector: 'app-graph-block',
    templateUrl: './graph-block.component.html',
    styleUrls: ['./graph-block.component.scss'],
    standalone: true,
    imports: [DateFilterComponent]
})
export class GraphBlockComponent {

  @Input() GraphTitle = '';

  onFilterApplied(filter: { fromDate: Date | null, toDate: Date | null }): void {
    // logic Goes Here
    console.log('Filter applied:', filter);
  }

}
