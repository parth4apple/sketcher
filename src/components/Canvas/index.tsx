import React, { useEffect, createRef, useState } from "react";
import { Container } from "./style";

class Point {
  x: number;
  y: number;
  lifetime: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.lifetime = 0;
  }
}

function Canvas() {
  const canvasRef: any = createRef();
  const [cHeight, setCHeight] = useState<number>();
  const [cWidth, setCWidth] = useState<number>();


  useEffect(() => {


    const startAnimation = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const points: Point[] = [];

      const addPoint = (x: any, y: any) => {
        const point = new Point(x, y);
        points.push(point);
      };

      document.addEventListener(
        "mousemove",
        ({ clientX, clientY }) => {
          addPoint(clientX - canvas?.offsetLeft, clientY - canvas?.offsetTop);
        },
        false
      );
      const animatePoints = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const duration = (0.7 * (1 * 2000)) / 60; 

        for (let i = 0; i < points.length; ++i) {
          const point = points[i];

          point.lifetime += 1;

          if (point.lifetime > duration) {
            // If the point dies, remove it.
            points.shift();
          } else {
            // Otherwise animate it:
            // As the lifetime goes on, lifePercent goes from 0 to 1.
            const lifePercent = point.lifetime / duration;
            const spreadRate = 5 * (1 - lifePercent);

            ctx.lineJoin = "round";
            ctx.lineWidth = spreadRate;

            // As time increases decrease r and b, increase g to go from purple to green.
            const red = Math.floor(190 - 190 * lifePercent);
            const green = 0;
            const blue = Math.floor(210 + 210 * lifePercent);
            ctx.strokeStyle = `rgb(${red},${green},${blue}`;



            const generatePoint = (offset: number) => {
                let pt;

                if (points[i-offset] !== undefined) {
                    pt = points[i-offset];
                } else pt = point;  

                return pt
            }

            ctx.beginPath();

            for(let z = 1; z < 3; z+=1){
                let p1 = generatePoint(z-1);
                let p2 = generatePoint(z);
                const r = (Math.random() - 0.5) * 10;
                ctx.bezierCurveTo(p2.x+r, p2.y+r, p1.x+r, p1.y+r, point.x+r, point.y+r)
            }




            ctx.stroke();
            ctx.closePath();


          }
        }
        requestAnimationFrame(animatePoints);
      };
      animatePoints();
    };

    setCHeight(document.body.clientHeight);
    setCWidth(document.body.clientWidth);

    // If the device supports cursors, start animation.
    if (matchMedia("(pointer:fine)").matches) {
      startAnimation();
    }
  }, []);

  return <Container ref={canvasRef} width={cWidth} height={cHeight} />;
}

export default Canvas;
