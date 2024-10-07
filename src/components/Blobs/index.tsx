'use client';

import { useEffect, useRef } from "react";
import Style from './Blobs.module.scss';
import foto from '/public/assets/images/fotoPerfil.png';
import Image from "next/image";

class Blob {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  points: Point[] = [];
  radius: number = 120; 
  mousePos?: { x: number, y: number };
  isMouseInside: boolean = false; 
  private _numPoints: number = 32; 

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  init(numPoints: number = 32) {
    this.points = [];
    for (let i = 0; i < numPoints; i++) {
      const point = new Point(this.divisional * (i + 1), this);
      this.push(point);
    }
  }

  render() {
    const { ctx, canvas, points } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height); 
    gradient.addColorStop(0, 'rgba(13, 53, 79, 1)'); 
    gradient.addColorStop(1, 'rgba(28, 130, 145, 1)'); 

    points[0].solveWith(points[points.length - 1], points[1]);

    const p0 = points[points.length - 1].position; 
    let p1 = points[0].position;
    const _p2 = p1;

    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

    for (let i = 1; i < points.length; i++) {
      points[i].solveWith(points[i - 1], points[i + 1] || points[0]);
      const p2 = points[i].position;
      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      p1 = p2;
    }

    const xc = (p1.x + _p2.x) / 2;
    const yc = (p1.y + _p2.y) / 2;
    ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    requestAnimationFrame(this.render.bind(this));
  }

  push(item: Point) {
    if (item instanceof Point) {
      this.points.push(item);
    }
  }

  get center() {
    return { x: this.canvas.width * 0.5, y: this.canvas.height * 0.5 };
  }

  get divisional() {
    return Math.PI * 2 / this.numPoints;
  }

  set numPoints(value: number) {
    if (value > 2) {
      this._numPoints = value; 
    }
  }
  
  get numPoints() {
    return this._numPoints; 
  }
}

class Point {
  parent: Blob;
  azimuth: number;
  _acceleration: number = 0;
  _speed: number = 0;
  _radialEffect: number = 0;

  constructor(azimuth: number, parent: Blob) {
    this.parent = parent;
    this.azimuth = Math.PI - azimuth;
  }

  solveWith(leftPoint: Point, rightPoint: Point) {
    this.acceleration = (-0.4 * this.radialEffect + (leftPoint.radialEffect - this.radialEffect) + (rightPoint.radialEffect - this.radialEffect)) * this.elasticity - this.speed * this.friction;
  }

  set acceleration(value: number) {
    if (typeof value === 'number') {
      this._acceleration = value;
      this.speed += this._acceleration * 2;
    }
  }
  
  get acceleration() {
    return this._acceleration || 0;
  }

  set speed(value: number) {
    if (typeof value === 'number') {
      this._speed = value;
      this.radialEffect += this._speed * 5;
    }
  }
  
  get speed() {
    return this._speed || 0;
  }

  set radialEffect(value: number) {
    if (typeof value === 'number') {
      this._radialEffect = Math.max(value, 0);
    }
  }
  
  get radialEffect() {
    return this._radialEffect || 0;
  }

  get position() {
    return {
      x: this.parent.center.x + Math.cos(this.azimuth) * (this.parent.radius + this.radialEffect),
      y: this.parent.center.y + Math.sin(this.azimuth) * (this.parent.radius + this.radialEffect),
    };
  }

  get elasticity() {
    return 0.005;
  }

  get friction() {
    return 0.025;
  }
}

const Blobs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const blob = new Blob(canvas);
    canvas.width = 320; 
    canvas.height = 320; 
    
    const resizeCanvas = () => {
      canvas.width = 320;
      canvas.height = 320;
      blob.init();
    };

    resizeCanvas();
    
    const mouseMove = (e: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      
      const pos = blob.center;
      const diff = { x: mouseX - pos.x, y: mouseY - pos.y };
      const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

      if (dist < blob.radius) {
        blob.mousePos = { x: pos.x - mouseX, y: pos.y - mouseY };
        blob.isMouseInside = true; 
        const angle = Math.atan2(diff.y, diff.x); 

        let nearestPoint: Point | undefined; 
        let distanceFromPoint = 1000;

        blob.points.forEach((point) => {
          if (Math.abs(angle - point.azimuth) < distanceFromPoint) {
            nearestPoint = point;
            distanceFromPoint = Math.abs(angle - point.azimuth);
          }
        });

        if (nearestPoint !== undefined) {
          let strength = Math.sqrt((blob.mousePos.x ** 2) + (blob.mousePos.y ** 2)) * 2;
          strength = Math.min(strength, 100);
          nearestPoint.acceleration = strength / 200; 
        }
      } else {
        if (blob.isMouseInside) {
          blob.isMouseInside = false; 
          blob.mousePos = undefined;

          blob.points.forEach(point => {
            point.radialEffect *= 0.9; 
            point.speed *= 0.9; 
            
            if (point.radialEffect < 0.8) {
              point.radialEffect = 0;
              point.speed = 0; 
            }
          });
        }
      }
    };

    window.addEventListener('pointermove', mouseMove);
    
    blob.init();
    blob.render();

    return () => {
      window.removeEventListener('pointermove', mouseMove);
    };
  }, []);

  return (
    <div className={Style.blobContainer}>
      <Image src={foto} alt='foto' className={Style.foto} />
      <canvas ref={canvasRef} className={Style.blob}></canvas>
    </div>
  );
};

export default Blobs;
