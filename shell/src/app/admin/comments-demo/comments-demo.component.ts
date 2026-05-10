import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  CapAlertComponent,
  CapButtonComponent,
  CapInputComponent,
} from '@capitalflow/shared-ui';
import { AdminBackNavigationService } from '../services/admin-back-navigation.service';
import {
  COMMENTS_BACK_LABEL_PREFIX,
  COMMENTS_DEMO_DEFAULT_AUTHOR,
  COMMENTS_DEMO_I18N_KEYS,
  COMMENTS_SEED,
  COMMENTS_TEST_PAYLOAD,
} from './comments-demo.constants';
import { TransactionComment } from './comments-demo.types';

@Component({
  selector: 'app-comments-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CapAlertComponent,
    CapButtonComponent,
    CapInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comments-demo.component.html',
  styleUrls: ['./comments-demo.component.scss'],
})
export class CommentsDemoComponent {
  private readonly backNavigation = inject(AdminBackNavigationService);

  readonly i18n = COMMENTS_DEMO_I18N_KEYS;
  readonly backLabelPrefix = COMMENTS_BACK_LABEL_PREFIX;
  readonly commentControl = new FormControl<string>('', { nonNullable: true });
  readonly comments = signal<readonly TransactionComment[]>(COMMENTS_SEED);
  private readonly draft = toSignal(this.commentControl.valueChanges, {
    initialValue: this.commentControl.value,
  });
  readonly canAdd = computed(() => this.draft().trim().length > 0);

  addComment(): void {
    const text = this.commentControl.value.trim();
    if (!text) {
      return;
    }
    const next: TransactionComment = {
      id: this.comments().length + 1,
      author: COMMENTS_DEMO_DEFAULT_AUTHOR,
      transactionRef: `TX-DEMO-${String(this.comments().length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      text,
    };
    this.comments.update((rows) => [...rows, next]);
    this.commentControl.setValue('');
  }

  injectTestPayload(): void {
    this.commentControl.setValue(COMMENTS_TEST_PAYLOAD);
  }

  goBack(): void {
    this.backNavigation.goBack();
  }
}
