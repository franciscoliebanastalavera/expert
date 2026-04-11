// Declaraciones de tipos para modulos que TypeScript no reconoce nativamente

// Modulos CSS (importar archivos .css como modulos)
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Modulos de imagenes comunes
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

// Modulos JSON
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}
