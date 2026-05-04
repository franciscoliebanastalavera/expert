import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent } from '@capitalflow/shared-ui';
import * as DOMPurifyModule from 'dompurify';
import Quill from 'quill';
import { ADMIN_LANDING_ROUTE } from '../admin-landing/admin-landing.constants';
import {
  WYSIWYG_BACK_LABEL_PREFIX,
  WYSIWYG_I18N_KEYS,
  WYSIWYG_SAMPLE_TEMPLATE,
  WYSIWYG_TEST_PAYLOAD,
  WYSIWYG_TOOLBAR,
} from './wysiwyg-editor.constants';

function sanitizeHtml(source: string): string {
  const purifier = ((DOMPurifyModule as never)['default'] || DOMPurifyModule) as {
    sanitize(value: string): string;
  };
  return purifier.sanitize(source);
}

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapButtonComponent, CapAlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss'],
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  @Input() initialContent: string = WYSIWYG_SAMPLE_TEMPLATE;
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('editorHost', { static: true }) editorHost!: ElementRef<HTMLDivElement>;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private quill: Quill | null = null;

  readonly i18n = WYSIWYG_I18N_KEYS;
  readonly backLabelPrefix = WYSIWYG_BACK_LABEL_PREFIX;
  readonly sanitizedPreview = signal<SafeHtml>('');
  readonly sanitizedHtml = signal<string>('');
  readonly rawHtml = signal<string>('');
  readonly hasInjectionAttempt = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorHost.nativeElement, {
      theme: 'snow',
      modules: { toolbar: WYSIWYG_TOOLBAR },
    });
    this.quill.clipboard.dangerouslyPasteHTML(this.initialContent);
  }

  ngOnDestroy(): void {
    this.quill = null;
  }

  save(): void {
    if (!this.quill) {
      return;
    }
    const raw = this.quill.root.innerHTML;
    const clean = sanitizeHtml(raw);
    this.rawHtml.set(raw);
    this.hasInjectionAttempt.set(/<script|onerror=|onload=|javascript:/i.test(raw));
    this.sanitizedHtml.set(clean);
    this.sanitizedPreview.set(this.sanitizer.bypassSecurityTrustHtml(clean));
    this.contentChange.emit(clean);
  }

  injectTestPayload(): void {
    if (!this.quill) {
      return;
    }
    this.quill.clipboard.dangerouslyPasteHTML(WYSIWYG_TEST_PAYLOAD);
  }

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
