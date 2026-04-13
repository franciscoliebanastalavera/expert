import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { PREDEFINED_MIXINS } from './dynamic-css.const';

@Injectable({
  providedIn: 'root',
})
export class DynamicCssService implements OnDestroy {
  private renderer: Renderer2;
  private styleElements: Map<string, HTMLStyleElement> = new Map();

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * @param className - CSS class name.
   * @param cssContent - CSS definition.
   * @param componentId - Unique component id.
   * @returns Final CSS class name.
   */
  createDynamicClass(
    className: string,
    cssContent: string,
    componentId?: string
  ): string {
    if (!cssContent) {
      return className;
    }

    if (cssContent in PREDEFINED_MIXINS) {
      cssContent = PREDEFINED_MIXINS[cssContent];
    }

    const finalClassName = componentId ? `${className}-${componentId}` : className;
    const key = finalClassName;

    if (this.styleElements.has(key)) {
      this.removeDynamicClass(key);
    }

    const styleElement = this.renderer.createElement('style');
    const cssRule = `.${finalClassName} { ${cssContent} }`;

    this.renderer.setProperty(styleElement, 'innerHTML', cssRule);
    this.renderer.appendChild(document.head, styleElement);

    this.styleElements.set(key, styleElement);

    return finalClassName;
  }

  /**
   * @param classKey - Key of the class to update.
   * @param newCssContent - New CSS value.
   */
  updateDynamicClass(classKey: string, newCssContent: string): void {
    const styleElement = this.styleElements.get(classKey);
    if (styleElement) {
      const cssRule = `.${classKey} { ${newCssContent} }`;
      this.renderer.setProperty(styleElement, 'innerHTML', cssRule);
    }
  }

  /**
   * @param componentId - Component id.
   */
  removeComponentClasses(componentId: string): void {
    const keysToRemove = Array.from(this.styleElements.keys()).filter((key) =>
      key.includes(`-${componentId}`)
    );

    keysToRemove.forEach((key) => this.removeDynamicClass(key));
  }

  /**
   * @param classKey - Class key.
   */
  removeDynamicClass(classKey: string): void {
    const styleElement = this.styleElements.get(classKey);
    if (styleElement) {
      this.renderer.removeChild(document.head, styleElement);
      this.styleElements.delete(classKey);
    }
  }

  /**
   * @returns Unique id.
   */
  generateComponentId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  clearAllDynamicStyles(): void {
    this.styleElements.forEach((styleElement) => {
      this.renderer.removeChild(document.head, styleElement);
    });
    this.styleElements.clear();
  }

  /**
   * @param classDefinitions - Array of class definitions.
   * @param componentId - Optional component id.
   * @returns Array of final class names.
   */
  createMultipleDynamicClasses(
    classDefinitions: { className: string; cssContent: string }[],
    componentId?: string
  ): string[] {
    classDefinitions = classDefinitions.filter((item) => item.cssContent);

    return classDefinitions.map((def) =>
      this.createDynamicClass(def.className, def.cssContent, componentId)
    );
  }

  ngOnDestroy(): void {
    this.clearAllDynamicStyles();
  }
}
