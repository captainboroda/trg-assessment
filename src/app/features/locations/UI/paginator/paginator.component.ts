import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPagination } from '../../../../interfaces/pagination.interface';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {

  @Input() data: IPagination | undefined;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number) {
    if (page === this.data?.activePage) {
      return;
    }
    this.pageChange.emit(page);
  }
}
