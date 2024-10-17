declare module 'react-pageflip' {
  import { Component } from 'react';

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