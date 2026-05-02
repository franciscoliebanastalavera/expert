import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapCardComponent } from './cap-card.component';

describe('CapCardComponent', () => {
  let fixture: ComponentFixture<CapCardComponent>;
  let instance: CapCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapCardComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the cap-card root element', () => {
    expect(instance).toBeInstanceOf(CapCardComponent);
    const root = fixture.debugElement.query(By.css('.cap-card'));
    expect(root).not.toBeNull();
  });

  it('renders the default empty header and footer sections', () => {
    const header = fixture.debugElement.query(By.css('.cap-card__header h3'));
    const paragraphs = fixture.debugElement.queryAll(By.css('.cap-card__footer p'));
    expect(header).not.toBeNull();
    expect(header.nativeElement.textContent.trim()).toBe('');
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].nativeElement.textContent.trim()).toBe('');
    expect(paragraphs[1].nativeElement.textContent.trim()).toBe('');
  });

  it('renders the title, subtitle and content provided through inputs', () => {
    instance.title = 'My Title';
    instance.subtitle = 'My Subtitle';
    instance.content = 'My Content';
    instance.ngOnChanges();
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.cap-card__header h3'));
    const paragraphs = fixture.debugElement.queryAll(By.css('.cap-card__footer p'));
    expect(header.nativeElement.textContent.trim()).toBe('My Title');
    expect(paragraphs[0].nativeElement.textContent.trim()).toBe('My Subtitle');
    expect(paragraphs[1].nativeElement.textContent.trim()).toBe('My Content');
  });

  it('uses the primary background image by default and switches to secondary when type changes', () => {
    instance.ngOnChanges();
    expect(instance.backgroundImage).toContain('fondoCap.png');
    instance.type = 'secondary';
    instance.ngOnChanges();
    expect(instance.backgroundImage).toContain('fondoCapOpuesta.png');
  });

  it('produces a dynamic class that includes the configured border radius', () => {
    instance.borderRadius = '5px';
    instance.ngOnChanges();
    fixture.detectChanges();
    expect(instance.cardClass).toContain('cap-card-dynamic');
  });

  it('exposes a non-empty component id and applies background-image style', () => {
    instance.ngOnChanges();
    fixture.detectChanges();
    const root: HTMLElement = fixture.debugElement.query(By.css('.cap-card')).nativeElement;
    expect(root.style.backgroundImage).toContain('fondoCap.png');
    expect(instance['componentId']).toBeTruthy();
  });
});
