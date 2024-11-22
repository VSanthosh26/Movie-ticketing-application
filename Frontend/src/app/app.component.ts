import { Component } from '@angular/core';
import { ToasterPosition} from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Frontend';
  ToasterPosition = ToasterPosition
}
