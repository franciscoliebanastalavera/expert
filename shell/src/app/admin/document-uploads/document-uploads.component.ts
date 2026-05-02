import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocumentRow {
  id: number;
  name: string;
  size: string;
  uploadedAt: string;
}

const SEED_DOCUMENTS: DocumentRow[] = [
  { id: 1, name: 'invoice-march-2026.pdf', size: '142 KB', uploadedAt: '2026-03-31' },
  { id: 2, name: 'contract-vendor-acme.pdf', size: '1.2 MB', uploadedAt: '2026-04-12' },
  { id: 3, name: 'kyc-customer-3402.zip', size: '8.4 MB', uploadedAt: '2026-04-18' },
  // Hostile filename — would XSS the uploads table if rendered with innerHTML.
  // Here it is rendered with [innerText] / interpolation so the angle brackets render literal.
  { id: 4, name: '<img src=x onerror="alert(1)">.pdf', size: '0 B', uploadedAt: '2026-04-30' },
];

@Component({
  selector: 'app-document-uploads',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-uploads.component.html',
  styleUrls: ['./document-uploads.component.scss'],
})
export class DocumentUploadsComponent {
  readonly documents = signal<DocumentRow[]>(SEED_DOCUMENTS);
}
