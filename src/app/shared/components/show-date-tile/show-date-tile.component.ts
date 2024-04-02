import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-date-tile',
  templateUrl: './show-date-tile.component.html',
})
export class ShowDateTileComponent {
  @Input() getFormattedLessonDate!: string;
}
