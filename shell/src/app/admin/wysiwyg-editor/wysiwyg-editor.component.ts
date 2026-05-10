import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent, SafeHtmlPipe } from '@capitalflow/shared-ui';
import * as DOMPurifyModule from 'dompurify';
import Quill from 'quill';
import { AdminBackNavigationService } from '../services/admin-back-navigation.service';
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
  imports: [CommonModule, TranslateModule, CapButtonComponent, CapAlertComponent, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss'],
})
export class WysiwygEditorComponent implements AfterViewInit {
  readonly initialContent = input(WYSIWYG_SAMPLE_TEMPLATE);
  readonly contentChange = output<string>();

  readonly editorHost = viewChild.required<ElementRef<HTMLDivElement>>('editorHost');

  private readonly backNavigation = inject(AdminBackNavigationService);
  private readonly destroyRef = inject(DestroyRef);
  private quill: Quill | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.quill = null;
    });
  }

  readonly i18n = WYSIWYG_I18N_KEYS;
  readonly backLabelPrefix = WYSIWYG_BACK_LABEL_PREFIX;
  readonly sanitizedHtml = signal<string>('');
  readonly rawHtml = signal<string>('');
  readonly hasInjectionAttempt = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorHost().nativeElement, {
      theme: 'snow',
      modules: { toolbar: WYSIWYG_TOOLBAR },
    });
    this.quill.clipboard.dangerouslyPasteHTML(this.initialContent());
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
    this.contentChange.emit(clean);
  }

  injectTestPayload(): void {
    if (!this.quill) {
      return;
    }
    this.quill.clipboard.dangerouslyPasteHTML(WYSIWYG_TEST_PAYLOAD);
  }

  goBack(): void {
    this.backNavigation.goBack();
  }
}
