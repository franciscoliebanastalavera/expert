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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurifyModule from 'dompurify';
import Quill from 'quill';

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

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss'],
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  @Input() initialContent: string = SAMPLE_TEMPLATE;
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('editorHost', { static: true }) editorHost!: ElementRef<HTMLDivElement>;

  private readonly sanitizer = inject(DomSanitizer);
  private quill: Quill | null = null;

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
}
