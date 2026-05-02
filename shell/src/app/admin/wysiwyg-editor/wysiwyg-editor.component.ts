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

const DOMPurify: { sanitize(source: string): string } =
  (DOMPurifyModule as never)['default'] || DOMPurifyModule;

const TOOLBAR = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
];

const SAMPLE_TEMPLATE = `
  <h2>Quarterly compliance report — template</h2>
  <p>The following data block is replaced at render time with the regulatory dataset.</p>
  <ul><li>Reporting period</li><li>Counterparties</li><li>Total volume</li></ul>
`;

const I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.WYSIWYG.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.WYSIWYG.PAGE_LEAD',
  SAVE_BUTTON: 'ADMIN.DEMOS.WYSIWYG.SAVE_BUTTON',
  RAW_HEADING: 'ADMIN.DEMOS.WYSIWYG.RAW_HEADING',
  INJECTION_WARNING: 'ADMIN.DEMOS.WYSIWYG.INJECTION_WARNING',
  SANITIZED_HEADING: 'ADMIN.DEMOS.WYSIWYG.SANITIZED_HEADING',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapButtonComponent, CapAlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss'],
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  @Input() initialContent: string = SAMPLE_TEMPLATE;
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('editorHost', { static: true }) editorHost!: ElementRef<HTMLDivElement>;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private quill: Quill | null = null;

  readonly i18n = I18N_KEYS;
  readonly sanitizedPreview = signal<SafeHtml>('');
  readonly rawHtml = signal<string>('');
  readonly hasInjectionAttempt = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorHost.nativeElement, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR },
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
    const clean = DOMPurify.sanitize(raw);
    this.rawHtml.set(raw);
    this.hasInjectionAttempt.set(/<script|onerror=|onload=|javascript:/i.test(raw));
    this.sanitizedPreview.set(this.sanitizer.bypassSecurityTrustHtml(clean));
    this.contentChange.emit(clean);
  }

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
