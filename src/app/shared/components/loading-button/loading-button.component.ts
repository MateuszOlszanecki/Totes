import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
})
export class LoadingButtonComponent {
  @Input() text!: string;
  @Input() spinnerVisible!: boolean;
}
