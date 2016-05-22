// Copyright (C) 2011 Jan Wrobel <wrr@mixedbit.org>
// Table Structure from Jan Wrobel
// Everything else - ZW Miller 2016

(function () {
  "use strict";

  var CELL_SIZE_PX = 15;
  var easel = {
    selector: 0,
    wcolors:  ["#D41316","#55F01D","#EFFA1E","#FFBA26","#00E3E0"],
    wpcolors: ["#9C1F21","#328C11","#CCD613","#E89F00","#1AABA9"],
    bgcolor: "#333333"
  }

  function createTable(height, width) {
    var space, row, cell, i, j;
    space = document.getElementById("space");
    for (i = 0; i < height; i += 1) {
      row = space.insertRow(-1);
      for (j = 0; j < width; j += 1) {
        cell = row.insertCell(j);
        cell.style.width = (CELL_SIZE_PX - 1) + "px";
        cell.style.height = (CELL_SIZE_PX - 1) + "px";
        cell.style.background = easel.bgcolor;
      }
    }
  }

  function checkForWrapAround(wlk){
    if(wlk.x < 0)
      wlk.x = getWidth()-1;
    if(wlk.x > getWidth()-1)
      wlk.x = 0;
    if(wlk.y < 0)
      wlk.y = getHeight()-1;
    if(wlk.y > getHeight()-1)
      wlk.y = 0;
  }

  function displaySpace(walkers) {
    var table, row, cell, k, i, j;
    table = document.getElementById("space");
    for(var wlk of walkers){
      checkForWrapAround(wlk);
      row = table.rows[wlk.y];
      cell = row.cells[wlk.x];
      cell.style.background = wlk.color;
      for(var pspace of wlk.previouspositions){
        row = table.rows[pspace[1]];
        cell = row.cells[pspace[0]];
        cell.style.background = wlk.pcolor;
      }
    }
    if(wlk.needclear === 1){
      row = table.rows[wlk.clearposition[1]];
      cell = row.cells[wlk.clearposition[0]];
      cell.style.background = wlk.bcolor;
    }
  }


  function create2dArray(height, width) {
    var result, i;
    result = [];
    result.length = height;
    for (i = 0; i < height; i += 1) {
      result[i] = [];
      result[i].length = width;
    }
    return result;
  }

  function getWindowWidthAndHeight() {
    // the more standards compliant browsers
    // (mozilla/netscape/opera/IE7) use window.innerWidth and
    // window.innerHeight
    if (typeof window.innerWidth !== 'undefined') {
      return [window.innerWidth, window.innerHeight];
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the
    // first line in the document)
    if (typeof document.documentElement !== 'undefined'
        && typeof document.documentElement.clientWidth !==
      'undefined' && document.documentElement.clientWidth !== 0) {
          return [document.documentElement.clientWidth,
            document.documentElement.clientHeight];
        }
        // older versions of IE
        return [document.getElementsByTagName('body')[0].clientWidth,
          document.getElementsByTagName('body')[0].clientHeight];

  }

  function getWindowWidth() {
    return getWindowWidthAndHeight()[0];
  }

  function getWindowHeight() {
    return getWindowWidthAndHeight()[1];
  }

  function getHeight(){
    return Math.floor(getWindowHeight() / CELL_SIZE_PX) - 1;
  }

  function getWidth(){
    return Math.floor(getWindowWidth() / CELL_SIZE_PX) - 1;
  }

  function main() {
    var width, height, space, walkers;
    width = Math.floor(getWindowWidth() / CELL_SIZE_PX) - 1;
    height = Math.floor(getWindowHeight() / CELL_SIZE_PX) - 1;
    createTable(height, width);
    space = create2dArray(height, width);
    walkers = createWalkers(5);
    
    runProgram(walkers);
  }

  function runProgram(walkers){
    displaySpace(walkers);
    evolveWalkers(walkers);
    var callback = function() {
      runProgram(walkers);
    }
    setTimeout(callback,100);
  }

  function evolveWalkers(walkers){
    for(var wlk of walkers){
      if(wlk.previouspositions.length > 5){
        wlk.clearposition = [wlk.previouspositions[4][0],wlk.previouspositions[4][1]];
        wlk.needclear = 1;
        wlk.previouspositions.pop(); 
      }
      wlk.previouspositions.push([wlk.x,wlk.y]);

      var rnd = Math.random()*4;
      if(rnd < 1)
        wlk.x++;
      else if(rnd<2)
        wlk.x--;
      else if(rnd<3)
        wlk.y++;
      else if(rnd<4)
        wlk.y--;
    }
  }

  function createWalkers(numWalkers){
    var walkerArray=[];
    for(var nWalk=0; nWalk<numWalkers; nWalk++){
      if(walkerArray.length >=5)
        walkerArray.pop();
      easel.selector++;
      walkerArray.push(instantiateWalker());
    }
    return walkerArray;
  }

  function instantiateWalker(){
    return {
      x: Math.floor(Math.random()*getWidth()),
      y: Math.floor(Math.random()*getHeight()),
      previouspositions: [],
      clearposition: [],
      needclear: 0,
      color:  easel.wcolors[easel.selector%5],
      pcolor: easel.wpcolors[easel.selector%5],
      bcolor: easel.bgcolor
    };
  }

  if (window.attachEvent) {
    window.attachEvent('onload', main);
  } else {
    window.onload = main;
  }
}());
