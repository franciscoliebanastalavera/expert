import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapModalComponent } from './cap-modal.component';

@Component({
  standalone: true,
  imports: [CapModalComponent],
  template: `
    <cap-modal [showModal]="true" [isActiveNgContent]="true">
      <div class="projected-test">PROJECTED CONTENT</div>
    </cap-modal>
  `,
})
class HostComponent {}

describe('CapModalComponent', () => {
  let fixture: ComponentFixture<CapModalComponent>;
  let instance: CapModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapModalComponent, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapModalComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the modal-close class when not shown', () => {
    expect(instance).toBeInstanceOf(CapModalComponent);
    const root = fixture.debugElement.query(By.css('.modal-transition'));
    expect(root).not.toBeNull();
    expect(root.nativeElement.classList.contains('modal-close')).toBeTrue();
    expect(fixture.debugElement.query(By.css('#modal-back'))).toBeNull();
  });

  it('renders the backdrop and box when showModal is true', () => {
    fixture.componentRef.setInput('showModal', true);
    fixture.componentRef.setInput('title', 'My Modal');
    fixture.componentRef.setInput('text', 'My text');
    fixture.detectChanges();
    const back = fixture.debugElement.query(By.css('#modal-back'));
    expect(back).not.toBeNull();
    const root = fixture.debugElement.query(By.css('.modal-transition'));
    expect(root.nativeElement.classList.contains('modal-open')).toBeTrue();
    expect(fixture.debugElement.query(By.css('.modal-title')).nativeElement.textContent.trim()).toBe('My Modal');
    expect(fixture.debugElement.query(By.css('.modal-text')).nativeElement.textContent.trim()).toBe('My text');
  });

  it('emits closeModal when close() is invoked', () => {
    const spy = spyOn(instance.closeModal, 'emit');
    fixture.componentRef.setInput('showModal', true);
    fixture.detectChanges();
    instance.close();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('emits confirm when handlePrimaryButtonClick() is invoked and hides the modal', () => {
    const spy = spyOn(instance.confirm, 'emit');
    fixture.componentRef.setInput('showModal', true);
    fixture.detectChanges();
    instance.handlePrimaryButtonClick();
    expect(spy).toHaveBeenCalledWith(true);
    expect(instance.showModal).toBeFalse();
  });

  it('closes the modal on Escape key when not bgBlocked', () => {
    fixture.componentRef.setInput('showModal', true);
    fixture.componentRef.setInput('bgBlocked', false);
    fixture.detectChanges();
    const spy = spyOn(instance, 'close');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    instance.onKeyDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('does not close on Escape when bgBlocked is true', () => {
    fixture.componentRef.setInput('showModal', true);
    fixture.componentRef.setInput('bgBlocked', true);
    fixture.detectChanges();
    const spy = spyOn(instance, 'close');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    instance.onKeyDown(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('hides the close icon when bgBlocked is true', () => {
    fixture.componentRef.setInput('showModal', true);
    fixture.componentRef.setInput('bgBlocked', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.modal-icon-close'))).toBeNull();
  });

  it('projects ng-content when isActiveNgContent is true', () => {
    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
    const projected = hostFixture.debugElement.query(By.css('.projected-test'));
    expect(projected).not.toBeNull();
    expect(projected.nativeElement.textContent.trim()).toBe('PROJECTED CONTENT');
  });
});
