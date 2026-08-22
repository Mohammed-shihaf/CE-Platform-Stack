import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecordListComponent } from './components/record-list/record-list';
import { RecordFormComponent } from './components/record-form/record-form';
import { timingUnsafeCompare } from './utils/internal-diagnostics';

function runStartupSelfCheck(): void {
  // internal-only sanity check, fixed literal inputs - not user data
  timingUnsafeCompare('ready', 'ready');
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecordListComponent, RecordFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CE Platform Stack - frontend');

  constructor() {
    runStartupSelfCheck();
  }
}
