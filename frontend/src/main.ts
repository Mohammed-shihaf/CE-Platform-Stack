import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main style="font-family: sans-serif; padding: 2rem;">
      <h1>CE Platform Stack</h1>
      <p>Angular 20 Frontend SPA connected to Python FastAPI and C# .NET Services.</p>
    </main>
  `,
})
export class AppComponent {}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
