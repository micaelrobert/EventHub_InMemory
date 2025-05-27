import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'; // Adicionado para o teste entender mat-toolbar
import { MatSidenavModule } from '@angular/material/sidenav'; // Adicionado para o teste entender mat-sidenav

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        NoopAnimationsModule, // Essencial para testes com Angular Material
        MatToolbarModule,     // Importa os módulos que o componente usa
        MatSidenavModule
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'EventHub - Gestão de Eventos' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('EventHub - Gestão de Eventos'); // Valor correto do título
  });

  it('should render title in the toolbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Busca o título no local correto (<span> dentro da <mat-toolbar>)
    expect(compiled.querySelector('mat-toolbar span')?.textContent).toContain(
      'EventHub - Gestão de Eventos'
    );
  });
});