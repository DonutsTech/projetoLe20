declare module 'react-pageflip' {
  import { Component } from 'react';

  interface FlipEvent {
    data: number; // Esta propriedade depende do valor do evento que você recebe no flip.
  }

  interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    flippingTime?: number;
    startPage?: number;
    drawShadow?: boolean;
    usePortrait?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onFlip?: (e: FlipEvent) => void; // Adicionando a propriedade onFlip
  }

  export default class HTMLFlipBook extends Component<HTMLFlipBookProps> {}
}

interface PromiseConstructor {
  withResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  };
}
