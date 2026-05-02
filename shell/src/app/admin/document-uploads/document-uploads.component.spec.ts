import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DocumentUploadsComponent } from './document-uploads.component';

describe('DocumentUploadsComponent', () => {
  let fixture: ComponentFixture<DocumentUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentUploadsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadsComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the hostile filename as literal text instead of executing it', () => {
    const cells = fixture.debugElement.queryAll(By.css('.document-uploads__filename'));
    const hostileCell = cells.find((c) =>
      c.nativeElement.textContent.includes('<img src=x onerror=')
    );
    expect(hostileCell).toBeDefined();
    // The cell must NOT contain a real <img> child node — Angular escapes it.
    expect(hostileCell?.nativeElement.querySelector('img')).toBeNull();
  });
});
