/**
 * DOM Safety Utilities
 * Provides safe access to DOM elements with proper null checks
 */

export function safeClassListAdd(element: Element | null | undefined, ...classNames: string[]): boolean {
  if (!element?.classList) {
    console.warn('safeClassListAdd: element or classList is undefined', element);
    return false;
  }
  
  try {
    element.classList.add(...classNames);
    return true;
  } catch (error) {
    console.warn('safeClassListAdd: failed to add classes', error);
    return false;
  }
}

export function safeClassListRemove(element: Element | null | undefined, ...classNames: string[]): boolean {
  if (!element?.classList) {
    console.warn('safeClassListRemove: element or classList is undefined', element);
    return false;
  }
  
  try {
    element.classList.remove(...classNames);
    return true;
  } catch (error) {
    console.warn('safeClassListRemove: failed to remove classes', error);
    return false;
  }
}

export function safeGetElementById(id: string): Element | null {
  if (typeof document === 'undefined') {
    console.warn('safeGetElementById: document is undefined');
    return null;
  }
  
  try {
    return document.getElementById(id);
  } catch (error) {
    console.warn('safeGetElementById: failed to get element', error);
    return null;
  }
}

export function safeQuerySelector(selector: string): Element | null {
  if (typeof document === 'undefined') {
    console.warn('safeQuerySelector: document is undefined');
    return null;
  }
  
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn('safeQuerySelector: failed to query selector', error);
    return null;
  }
}

// Monkey patch DOM methods for safety (only in development)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  const originalAdd = Element.prototype.classList?.add;
  const originalRemove = Element.prototype.classList?.remove;
  
  if (originalAdd) {
    Element.prototype.classList.add = function(...args: string[]) {
      if (!this || !this.classList) {
        console.warn('classList.add called on undefined element', this);
        return;
      }
      return originalAdd.apply(this, args);
    };
  }
  
  if (originalRemove) {
    Element.prototype.classList.remove = function(...args: string[]) {
      if (!this || !this.classList) {
        console.warn('classList.remove called on undefined element', this);
        return;
      }
      return originalRemove.apply(this, args);
    };
  }
}
