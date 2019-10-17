import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-ray-casting',
  templateUrl: './ray-casting.component.html',
  styleUrls: ['./ray-casting.component.scss']
})
export class RayCastingComponent implements OnInit {

  private p5: any;

  private nbMurs: number = 5;
  private maxDist: number;
  private res: number;
  
  private murs: any = [];
  private player: any;
  private wallColor: any;

  private sketch = (p:any) => {
    p.setup = () => {
      p.createCanvas(800, 400).parent("ray-casting-canvas");


      for(let i=0; i < this.nbMurs; i++) {
        this.murs.push({x1: p.random(p.width/2), y1: p.random(p.height), x2:p.random(p.width/2), y2: p.random(p.height)});
      }
      this.murs.push({x1: p.width/2, y1:0, x2:p.width/2, y2:p.height});
      this.murs.push({x1: 0, y1:0, x2:0, y2:p.height});
      this.murs.push({x1: 0, y1:0, x2:p.width/2, y2:0});
      this.murs.push({x1: 0, y1:p.height, x2:p.width/2, y2:p.height});
      this.player = {x:p.width/4, y:p.height/2, t:Math.PI/2};
      this.maxDist = p.height*p.height + p.width*p.width;
      this.res = p.width/8;
    };
  
    p.draw = () => {
      this.update(p);
      p.background(0);
      p.stroke(255);
      this.murs.forEach(mur => {
        p.line(mur.x1, mur.y1, mur.x2, mur.y2);
      });
    
      for(let i = 0; i < this.res/2; i++) {
        let angle = Math.atan(2/this.res * i);
        
        p.stroke(255);
        let obstacle = this.getObstacle(this.player.x, this.player.y, this.player.t + angle);
        p.line(this.player.x, this.player.y, obstacle.x, obstacle.y);
        
        let c = Math.cos(angle)* p.dist(obstacle.x, obstacle.y, this.player.x, this.player.y);
        let b = Math.sqrt(p.sq(p.height) + p.sq(c));
        
        let ta = Math.acos((p.sq(b) + p.sq(c) - p.sq(p.height))/(2*b*c));
        let rectSize = 0.3*p.height/2*Math.sin(ta)/Math.sin(Math.PI/2-ta);
        
        p.stroke(this.wallColor);
        p.fill(this.wallColor);
        p.rect(3*p.width/4 - (i+1)*p.width/(2*this.res), (p.height-rectSize)/2,p.width/(2*this.res),rectSize);
        
        angle = - angle;
        
        p.stroke(255);
        obstacle = this.getObstacle(this.player.x, this.player.y, this.player.t + angle);
        p.line(this.player.x, this.player.y, obstacle.x, obstacle.y);
        
        c = Math.cos(angle)* p.dist(obstacle.x, obstacle.y, this.player.x, this.player.y);
        b = Math.sqrt(p.sq(p.height) + p.sq(c));
        
        ta = Math.acos((p.sq(b) + p.sq(c) - p.sq(p.height))/(2*b*c));
        rectSize = 0.3*p.height/2*Math.sin(ta)/Math.sin(Math.PI/2-ta);
        
        p.stroke(this.wallColor);
        p.fill(this.wallColor);
        p.rect(i*p.width/(2*this.res) + 3*p.width/4, (p.height-rectSize)/2,p.width/(2*this.res),rectSize);
      }
    };

    
  };

  constructor() { }

  ngOnInit() {
    this.p5 = new p5(this.sketch);
  }

  update(p:any) {  
    if  (p.keyIsDown(p.LEFT_ARROW)) {
      this.player.t += Math.PI/60;
    }
  
    if  (p.keyIsDown(p.RIGHT_ARROW)) {
      this.player.t -= Math.PI/60;
    }
  
    if (p.keyIsDown(p.UP_ARROW)) {
      if(this.dist2(this.player, this.getObstacle(this.player.x, this.player.y, this.player.t)) > 1) {
        this.player.x += Math.cos(this.player.t);
        this.player.y -= Math.sin(this.player.t);
      }
      
      if(this.dist2(this.player, this.getObstacle(this.player.x, this.player.y, this.player.t)) < 1) {
        this.player.x -= Math.cos(this.player.t);
        this.player.y += Math.sin(this.player.t);
      }
    }
  
    if  (p.keyIsDown(p.DOWN_ARROW)) {
      if(this.dist2(this.player, this.getObstacle(this.player.x, this.player.y, this.player.t + Math.PI)) > 1) {
        this.player.x += Math.cos(this.player.t + Math.PI);
        this.player.y -= Math.sin(this.player.t + Math.PI);
      }
      if(this.dist2(this.player, this.getObstacle(this.player.x, this.player.y, this.player.t + Math.PI)) < 1) {
        this.player.x -= Math.cos(this.player.t + Math.PI);
        this.player.y += Math.sin(this.player.t + Math.PI);
      }
    }
  }
  
  getObstacle(x, y, t){
    let dist;
    let totalDist = 0;
    do {
       dist = this.minDist({x:x, y:y});
      x += dist*Math.cos(t);
      y -= dist*Math.sin(t);
      totalDist += dist;
    } while(dist > 1);
    return {x, y};
  }
  
  minDist(p: any) {
    let min = this.maxDist;
    this.murs.forEach(mur => {
      let dist = this.distToSegment(p, {x:mur.x1, y:mur.y1}, {x:mur.x2, y:mur.y2});
      if(min > dist) {
        min = dist;
        let angle = Math.atan2(mur.x1 - mur.x2, mur.y1 - mur.y2);
        this.wallColor = 64*Math.sin(angle) + 192;
      }
    })
    return min;
  }
  
  
  dist2(v, w) { return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y) }

  distToSegmentSquared(p, v, w) {
    var l2 = this.dist2(v, w);
    if (l2 == 0) return this.dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return this.dist2(p, { x: v.x + t * (w.x - v.x),
                      y: v.y + t * (w.y - v.y) });
  }
  distToSegment(p, v, w) { return Math.sqrt(this.distToSegmentSquared(p, v, w));}
}
