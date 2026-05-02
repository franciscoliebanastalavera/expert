import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { CapTooltipComponent } from './cap-tooltip.component';

class BreakpointObserverStub {
  readonly state$ = new BehaviorSubject<BreakpointState>({ matches: false, breakpoints: {} });
  observe(_value: string | readonly string[]): Observable<BreakpointState> {
    return this.state$.asObservable();
  }
  emit(matches: boolean): void {
    this.state$.next({ matches, breakpoints: {} });
  }
}

describe('CapTooltipComponent', () => {
  let fixture: ComponentFixture<CapTooltipComponent>;
  let instance: CapTooltipComponent;
  let breakpointStub: BreakpointObserverStub;

  beforeEach(async () => {
    breakpointStub = new BreakpointObserverStub();
    await TestBed.configureTestingModule({
      imports: [CapTooltipComponent],
      providers: [{ provide: BreakpointObserver, useValue: breakpointStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(CapTooltipComponent);
    instance = fixture.componentInstance;
    instance.ngOnInit();
    fixture.detectChanges();
  });

  it('creates the tooltip component with the desktop layout by default', () => {
    expect(instance).toBeInstanceOf(CapTooltipComponent);
    const root = fixture.debugElement.query(By.css('.cap-tooltip'));
    expect(root).not.toBeNull();
    const desktop = fixture.debugElement.query(By.css('.cap-tooltip__desktop'));
    expect(desktop).not.toBeNull();
  });

  it('renders the trigger icon', () => {
    const icon = fixture.debugElement.query(By.css('.icon img'));
    expect(icon).not.toBeNull();
    expect(icon.nativeElement.getAttribute('src')).toBe('images/info-reb.svg');
  });

  it('renders the title and text via innerHTML when inputs are set', () => {
    fixture.componentRef.setInput('titleTooltip', '<b>Title</b>');
    fixture.componentRef.setInput('textTooltip', 'Some text');
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.cap-tooltip__desktop__box .title'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.innerHTML).toContain('<b>Title</b>');
    const paragraph = fixture.debugElement.queryAll(By.css('.cap-tooltip__desktop__box p'))[1];
    expect(paragraph.nativeElement.innerHTML).toBe('Some text');
  });

  it('toggles showTooltip via hoverIcon and updates the internal state', () => {
    expect(instance.showTooltip).toBeFalse();
    instance.hoverIcon(true);
    expect(instance.showTooltip).toBeTrue();
    instance.hoverIcon(false);
    expect(instance.showTooltip).toBeFalse();
  });

  it('applies the alignment modifier class for tooltipAlign input', () => {
    fixture.componentRef.setInput('tooltipAlign', 'right');
    fixture.detectChanges();
    const box = fixture.debugElement.query(By.css('.cap-tooltip__desktop__box'));
    expect(box.nativeElement.classList.contains('cap-tooltip__desktop__box-right')).toBeTrue();
  });

  it('applies the vertical-invert modifier class when invertVertical is true', () => {
    fixture.componentRef.setInput('invertVertical', true);
    fixture.detectChanges();
    const desktop = fixture.debugElement.query(By.css('.cap-tooltip__desktop'));
    expect(desktop.nativeElement.classList.contains('cap-tooltip__desktop__vertical-invert')).toBeTrue();
  });

  it('updates showTablet to true when the breakpoint observer matches the tablet width', () => {
    expect(instance.showTablet).toBeFalse();
    breakpointStub.emit(true);
    expect(instance.showTablet).toBeTrue();
  });

  it('opens the modal tooltip when openModalTooltip(true) is called and the modal is enabled', () => {
    instance.openModalTooltip(true);
    expect(instance.showModalTooltip).toBeTrue();
    instance.openModalTooltip(false);
    expect(instance.showModalTooltip).toBeFalse();
  });

  it('does not open the modal tooltip when enableTooltipModal is false', () => {
    instance.enableTooltipModal = false;
    instance.openModalTooltip(true);
    expect(instance.showModalTooltip).toBeFalse();
  });
});
