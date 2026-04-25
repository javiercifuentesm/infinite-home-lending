/**
 * Quick Reference “PDF” uses the browser print dialog with a print-only
 * template (`#playbook-pdf`) and global `@media print` rules in `index.css`.
 */
export function printPlaybookQuickReference(): void {
  window.print();
}
