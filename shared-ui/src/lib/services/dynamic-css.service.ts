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
   * @param className - Nombre de la clase CSS
   * @param cssContent - Definicion CSS
   * @param componentId - ID unico del componente
   * @returns Nombre final de la clase CSS
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
   * @param classKey - Clave de la clase a actualizar
   * @param newCssContent - Nuevo valor CSS
   */
  updateDynamicClass(classKey: string, newCssContent: string): void {
    const styleElement = this.styleElements.get(classKey);
    if (styleElement) {
      const cssRule = `.${classKey} { ${newCssContent} }`;
      this.renderer.setProperty(styleElement, 'innerHTML', cssRule);
    }
  }

  /**
   * @param componentId - ID del componente
   */
  removeComponentClasses(componentId: string): void {
    const keysToRemove = Array.from(this.styleElements.keys()).filter((key) =>
      key.includes(`-${componentId}`)
    );

    keysToRemove.forEach((key) => this.removeDynamicClass(key));
  }

  /**
   * @param classKey - Clave de la clase
   */
  removeDynamicClass(classKey: string): void {
    const styleElement = this.styleElements.get(classKey);
    if (styleElement) {
      this.renderer.removeChild(document.head, styleElement);
      this.styleElements.delete(classKey);
    }
  }

  /**
   * @returns ID unico
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
   * @param classDefinitions - Array de definiciones de clases
   * @param componentId - ID opcional del componente
   * @returns Array de nombres finales de clases
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
