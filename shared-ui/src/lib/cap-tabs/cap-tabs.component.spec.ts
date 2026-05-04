import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapTabComponent } from './cap-tab/cap-tab.component';
import { CapTabsComponent } from './cap-tabs.component';

@Component({
  standalone: true,
  imports: [CapTabsComponent, CapTabComponent],
  template: `
    <cap-tabs [tabAlignment]="alignment" [tabMobile]="mobile" (tabsChange)="onTabsChange($event)">
      <cap-tab label="One"><span class="content-one">ONE</span></cap-tab>
      <cap-tab label="Two" [disabled]="disabledSecond"><span class="content-two">TWO</span></cap-tab>
      <cap-tab label="Three"><span class="content-three">THREE</span></cap-tab>
    </cap-tabs>
  `,
})
class HostComponent {
  @ViewChild(CapTabsComponent) tabs!: CapTabsComponent;
  alignment: 'left' | 'right' | 'center' = 'left';
  mobile = false;
  disabledSecond = false;
  emitted: string[] = [];

  onTabsChange(label: string): void {
    this.emitted.push(label);
  }
}

describe('CapTabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the tabs component and renders one li per content tab', () => {
    expect(host.tabs).toBeInstanceOf(CapTabsComponent);
    const tabsList = fixture.debugElement.queryAll(By.css('.cap-tabs li'));
    expect(tabsList.length).toBe(3);
    const labels = tabsList.map((li) => li.nativeElement.textContent.trim());
    expect(labels).toEqual(['One', 'Two', 'Three']);
  });

  it('selects the first tab as active by default and emits its label on init', () => {
    expect(host.tabs.tabs()[0].active()).toBeTrue();
    expect(host.emitted.length).toBeGreaterThanOrEqual(1);
    expect(host.emitted[0]).toBe('One');
    const activeLabel = fixture.debugElement.query(By.css('.cap-tabs__tabLabel-active'));
    expect(activeLabel.nativeElement.textContent.trim()).toBe('One');
  });

  it('selects the clicked tab and emits the new label, deactivating others', () => {
    const items = fixture.debugElement.queryAll(By.css('.cap-tabs li'));
    items[2].nativeElement.click();
    fixture.detectChanges();

    const activeLabels = fixture.debugElement.queryAll(By.css('.cap-tabs__tabLabel-active'));
    expect(activeLabels.length).toBe(1);
    expect(activeLabels[0].nativeElement.textContent.trim()).toBe('Three');
    expect(host.emitted[host.emitted.length - 1]).toBe('Three');
  });

  it('does not select a disabled tab and keeps the previously active one', () => {
    host.disabledSecond = true;
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.cap-tabs li'));
    items[1].nativeElement.click();
    fixture.detectChanges();
    expect(host.tabs.tabs()[0].active()).toBeTrue();
    const disabledSpan = fixture.debugElement.query(By.css('.cap-tabs__tabLabel-disabled'));
    expect(disabledSpan).not.toBeNull();
    expect(disabledSpan.nativeElement.textContent.trim()).toBe('Two');
  });

  it('applies the alignment modifier classes for each tabAlignment value', () => {
    host.alignment = 'right';
    fixture.detectChanges();
    let ul = fixture.debugElement.query(By.css('.cap-tabs'));
    expect(ul.nativeElement.classList.contains('cap-tabs--end')).toBeTrue();

    host.alignment = 'center';
    fixture.detectChanges();
    ul = fixture.debugElement.query(By.css('.cap-tabs'));
    expect(ul.nativeElement.classList.contains('cap-tabs--center')).toBeTrue();

    host.alignment = 'left';
    fixture.detectChanges();
    ul = fixture.debugElement.query(By.css('.cap-tabs'));
    expect(ul.nativeElement.classList.contains('cap-tabs--start')).toBeTrue();
  });

  it('applies the mobile modifier class when tabMobile input is true', () => {
    host.mobile = true;
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.cap-tabs--mobile'));
    expect(wrapper).not.toBeNull();
  });
});
