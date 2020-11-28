import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

const SIZE = 6;
const multiplier = 5;
const interval = 4000;
const GOODS = 10;
const BADS = 10;

const inputBuilder = (g, b) => {
  const data = { goods: [], bads: [] };

  for (let i = 0; i < g; i++) {
    let x = Math.floor(Math.random() * SIZE);
    let y = Math.floor(Math.random() * SIZE);
    while (data.goods.filter(item => item.x === x && item.y === y).length > 0) {
      x = Math.floor(Math.random() * SIZE);
      y = Math.floor(Math.random() * SIZE);
    }
    data.goods.push({ x, y });
  }

  for (let i = 0; i < b; i++) {
    let x = Math.floor(Math.random() * SIZE);
    let y = Math.floor(Math.random() * SIZE);
    while (
      (data.goods.filter(item => item.x === x && item.y === y).length > 0) ||
      (data.bads.filter(item => item.x === x && item.y === y).length > 0)
    ) {
      x = Math.floor(Math.random() * SIZE);
      y = Math.floor(Math.random() * SIZE);
    }
    data.bads.push({ x, y });
  }

  return data;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  grid = [];
  score = 0;
  time;
  interval;
  timeInterval;

  //icons
  miss = 'clear';
  baby = 'child_care';
  target = 'sentiment_very_dissatisfied';

  constructor(private _snackBar: MatSnackBar) {
    this.resetGrid(inputBuilder(GOODS, BADS));
  }

  wack(item, x, y) {
    if (this.interval) {

      this.grid[x][y] = null;

      let data: any = { };

      switch (item) {
        case this.target:
          data.message = `You got it! plus ${multiplier} points!`;
          data.points = multiplier;
          data.class = 'green';
          break;
        case this.baby:
          data.message = `OH NO! You hit the baby, minus ${multiplier} points.`;
          data.points = -1 * multiplier;
          data.class = 'red';
          break;
        default:
          data.message = 'You missed, minus 1 point.';
          data.points = -1;
          data.class = 'lightred';
      }

      this.score += data.points;
      this._snackBar.open(data.message, null, { duration: 3000, panelClass: data.class });
    }
  }

  start() {
    if (!this.interval) {
      this.resetGrid(inputBuilder(GOODS, BADS));
      this.time = 60;
      this.score = 0;
      this.timeInterval = setInterval(() => {
        this.time--;
        if (this.time < 1) {
          clearInterval(this.interval);
          clearInterval(this.timeInterval);
          this.interval = null;
          this.timeInterval = null;
        }
      }, 1000);
      this.interval = setInterval(() => {
        this.resetGrid(inputBuilder(GOODS, BADS));
      }, interval);
    } else {
      clearInterval(this.interval);
      clearInterval(this.timeInterval);
      this.interval = null;
      this.timeInterval = null;
    }
  }

  resetGrid(data) {
    this.grid = [];
    for (let i = 0; i < SIZE; i++) {
      this.grid.push(new Array(SIZE));
    }
    data.goods.forEach(item => {
      this.grid[item.x][item.y] = this.target;
    });
    data.bads.forEach(item => {
      this.grid[item.x][item.y] = this.baby;
    });
  }
}
