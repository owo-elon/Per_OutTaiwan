import { nextTick, onBeforeUnmount, type Ref, watch } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function useDialogFocus(
  isOpen: Ref<boolean>,
  dialogRef: Ref<HTMLElement | null>,
  close: () => void
) {
  let restoreTarget: HTMLElement | null = null;

  const getFocusableElements = () => {
    if (!dialogRef.value) {
      return [];
    }

    return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      .filter((element) => !element.hasAttribute('hidden'));
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      dialogRef.value?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  watch(isOpen, async (open) => {
    if (open) {
      restoreTarget = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      document.addEventListener('keydown', handleKeydown, true);
      await nextTick();
      const firstFocusable = getFocusableElements()[0];
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        dialogRef.value?.focus();
      }
      return;
    }

    document.removeEventListener('keydown', handleKeydown, true);
    restoreTarget?.focus();
    restoreTarget = null;
  });

  onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown, true));
}
