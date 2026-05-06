import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let instance: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component without rendering the backdrop when closed', () => {
    expect(instance).toBeInstanceOf(ModalComponent);
    expect(fixture.debugElement.query(By.css('.cf-modal-backdrop'))).toBeNull();
  });

  it('renders the backdrop and dialog when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Hello');
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('.cf-modal-backdrop'));
    expect(backdrop).not.toBeNull();
    const container = fixture.debugElement.query(By.css('.cf-modal-container'));
    expect(container).not.toBeNull();
    expect(container.nativeElement.getAttribute('role')).toBe('dialog');
    const title = fixture.debugElement.query(By.css('.cf-modal-title'));
    expect(title.nativeElement.textContent.trim()).toBe('Hello');
  });

  it('emits closed when the close button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const spy = spyOn(instance.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.cf-modal-close-btn'));
    closeBtn.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('emits closed when the backdrop is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const spy = spyOn(instance.closed, 'emit');
    instance.onBackdropClick();
    expect(spy).toHaveBeenCalled();
  });

  it('uses a unique titleId attribute on the dialog', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.cf-modal-container'));
    expect(container.nativeElement.getAttribute('aria-labelledby')).toBe(instance.titleId);
    expect(instance.titleId).toMatch(/^cf-modal-title-/);
  });
});
