import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CommentsDemoComponent } from './comments-demo.component';
import { COMMENTS_TEST_PAYLOAD } from './comments-demo.constants';

describe('CommentsDemoComponent', () => {
  let fixture: ComponentFixture<CommentsDemoComponent>;
  let component: CommentsDemoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsDemoComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the hostile seeded comment as literal text instead of executing it', () => {
    const bodies = fixture.debugElement.queryAll(By.css('.comments-demo__comment-body'));
    const hostile = bodies.find((b) =>
      b.nativeElement.textContent.includes('<script>alert("XSS")</script>')
    );
    expect(hostile).toBeDefined();
    expect(hostile?.nativeElement.querySelector('script')).toBeNull();
  });

  it('renders a payload added at runtime as literal text', () => {
    component.commentControl.setValue(COMMENTS_TEST_PAYLOAD);
    component.addComment();
    fixture.detectChanges();

    const bodies = fixture.debugElement.queryAll(By.css('.comments-demo__comment-body'));
    const injected = bodies.find((b) =>
      b.nativeElement.textContent.includes('XSS in comment')
    );
    expect(injected).toBeDefined();
    expect(injected?.nativeElement.querySelector('script')).toBeNull();
    expect(injected?.nativeElement.querySelector('img')).toBeNull();
  });

  it('ignores empty input when adding a comment', () => {
    const before = component.comments().length;
    component.commentControl.setValue('   ');
    component.addComment();
    expect(component.comments().length).toBe(before);
  });

  it('navigates back to the admin landing when goBack is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navSpy).toHaveBeenCalledWith(['/admin']);
  });
});
