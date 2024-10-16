declare module 'pdf-poppler' {
  export function convert(filePath: string, options: any): Promise<any>;
}