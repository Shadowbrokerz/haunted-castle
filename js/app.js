//Welcome screen

var started = 0;
var bossalive = 0;

function start() {
  $('#welcome').css('display', 'none');
  $('canvas').slideDown();
  $('#scoreboard').show();
  //Starts the game timer
  timer();
  bgm.volume = 0.7;
  started = 1;
}

function retry() {
  $('#welcome').fadeOut('slow');
  $('canvas').fadeIn('slow');
  $('#scoreboard').fadeIn('slow');
  $('#gameovertext').fadeOut('slow');
  normalBackground();
  bgm.play();
  movesound.volume = 1;
  enemysound.volume = 1;
  gemsound.volume = 1;
  gem.counter = 0;
  $('#gems').html(gem.counter);
  player.hit = 5;
  //resets timer.
  $('#time').html('0:00');
  playerdied = 0;
  started = 1;
  bossalive = 0;
  timer();
}

// Enemy Class
var Enemy = function(x, y) {
  this.sprite = 'images/ghoste.png';
  this.x = x;
  this.y = y;
  this.height = 50;
  this.width = 50;
  this.max = 1;
  this.speed = (Math.floor(Math.random() * 450) + 160) * this.max;
};
Enemy.prototype.update = function(dt) {
  //When the boss is around, the ghost respond
  // to their master!
  if ((minute >= 1) && (bossalive == 1)) {
    this.sprite = 'images/ghostex.png';
  } else {
    this.sprite = 'images/ghoste.png';
  }
  //updates the movement of the enemies.
  this.x = this.x + this.speed * dt;
  //if the enemies are outside the canvas,
  //restart initial position and use new speed.
  if (this.x > 505) {
    this.x = -200;
    this.speed = Math.floor(Math.random() * 450) + 160;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Boss class
var Boss = function() {
  var yArray = [0, 425];
  var images = ['images/ghosth.png', 'images/ghosteh-o.png'];
  var d = ['left', 'right'];
  this.direction = d[getRandomInt(0, 1)];
  if (this.direction == 'right') {
    this.sprite = images[0];
    this.x = -5200;
  } else {
    this.sprite = images[1];
    this.x = 5300;
  }
  this.y = yArray[getRandomInt(0, 1)];
  this.speed = 500;
  this.height = 50;
  this.width = 50;
};

Boss.prototype.update = function(dt) {

  // Increase Boss speed.
  if (minute >= 2) {
    this.speed = 700;
  }

  if (minute >= 3) {
    this.speed = 1000;

  }
  //Boss Directions.
  if (this.direction == 'right') {
    this.x = this.x + this.speed * dt;

    if (this.x > 505) {
      allBosses = [];
      allBosses.push(new Boss());
    }

  } else {
    this.x = this.x - this.speed * dt;

    if (this.x < -100) {
      allBosses = [];
      allBosses.push(new Boss());
    }

  }
};

Boss.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Gems class
//Array containing the gem colours.
var color = ['images/Gem Blue-s.png', 'images/Gem Green-s.png', 'images/Gem Orange-s.png'];
//Array containing the gem X-Y positions.
var xArray = [0, 102, 202, 302, 402];
var yArray = [0, 85, 170, 255, 340];
var Gem = function(number) {
  //Getting the gem colours randomly.
  this.sprite = color[number];
  //Getting the gem position array randomly.
  this.x = xArray[getRandomInt(0, 4)];
  this.y = yArray[getRandomInt(0, 4)];
  //Defining height and width for collision.
  this.height = 50;
  this.width = 50;
  //Initial Gem counter set to 0.
  this.counter = 0;
};

//Draws the gems on screen.
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//When the player touches a gem,this function get's triggered.
Gem.prototype.collect = function() {
  // Generates new Gem
  this.sprite = color[getRandomInt(0, 2)];
  this.x = xArray[getRandomInt(0, 4)];
  this.y = yArray[getRandomInt(0, 4)];
  // sums gems the player collects and displays it on the "gems" td.
  var counter = this.counter = this.counter + 1;
  document.getElementById('gems').innerHTML = counter;
  collectSound();
};

// Player class.
var Player = function() {
  this.sprite = 'images/guineapig.png';
  this.x = 220;
  this.y = 450;
  this.height = 30;
  this.width = 50;
  this.hit = 5;
};

//Player actual position
Player.prototype.update = function() {
  newX = this.x;
  newY = this.y;
};

//Draws player on screen.
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // This passes the players health to the "health" div.
  document.getElementById('health').innerHTML = this.hit;
};

//if the enemy hits the player
//it's send back to the initial
//position until it loses 5 health points.
//then the game is over.
Player.prototype.hits = function() {
  this.x = 220;
  this.y = 450;
  this.hit = this.hit - 1;
  if (this.hit == 0) {
    gameOver();
  }
  hitSound();
  var s = 0;
  if (playerdied == 0) {
    var interval = setInterval(function() {
      $('body').css('background', 'red');
      s++;
      if (s == 5) {
        clearInterval(interval);
        if (bossalive == 0) {
          normalBackground();
        } else {
          bossBackground();
        }
        s = 0;
      }
    }, 20);
  }


};


Player.prototype.handleInput = function(key) {
  //if the game starts then allow control.
  if (started == 1) {
    if (key === 'up') {
      this.y = this.y - 85;
      moveSound();
    }
    if (key === 'down') {
      this.y = this.y + 85;
      moveSound();
    }
    if (key === 'left') {
      this.x = this.x - 105;
      moveSound();
    }
    if (key === 'right') {
      this.x = this.x + 105;
      moveSound();
    }
  }

  // Defining movement limits
  if (this.x > 430) {
    this.x = 430;
  }
  if (this.x < 0) {
    this.x = 0;
  }
  if (this.y > 450) {
    this.y = 450;
  }
  if (this.y < 40) {
    this.y = 40;
  }

};

//Object instances:

var allEnemies = [new Enemy(10, 90), new Enemy(10, 175), new Enemy(10, 260), new Enemy(10, 340)];
var player = new Player();
var gem = new Gem(getRandomInt(0, 2));
var allBosses = [];
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

//function to create random numbers between a range of 2.
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var playerdied = 0;
/* lastscore saves the highest score the player archieved.
 * hscore is a temporary variable that saves and compares
 * if a new record has been archieved.
 */
var lastscore = 0;
var hscore = 0;

function gameOver() {
  if (gem.counter >= lastscore) {
    hscore = gem.counter;
    lastscore = hscore;
  } else {
    hscore = lastscore;
  }
  document.getElementById('tgems').innerHTML = 'Total gems collected :' + gem.counter;
  document.getElementById('hscore').innerHTML = hscore;
  document.getElementById('gameovertext').style.display = "";
  document.getElementById('ttime').innerHTML = 'Total time :' + minute + ':' + ('0' + second).slice(-2);
  $('canvas').hide();
  $('#scoreboard').hide();
  $('#gameovertext').fadeIn('slow');
  playerdied = 1;
  started = 0;
  gameOverSound();
  allBosses.splice(0, 1);
  bosssound.pause();
  bosssound.currentTime = 0;
}

var timer = function() {
  second = 0;
  minute = 0
  leTimer = setInterval(function() {
    second++;
    document.getElementById('time').innerHTML = minute + ':' + ('0' + second).slice(-2);

    if (second == 60) {
      second = 0;
      minute++;
    }

    if (playerdied == 1) {
      clearInterval(leTimer);
    }

  }, 1000);
}

//AUDIO//
var gemsound = document.getElementById("gemsound");
var enemysound = document.getElementById("enemysound");
var deadsound = document.getElementById("deadsound");
var pianosound = document.getElementById("pianosound");
var movesound = document.getElementById("movesound");
var bgm = document.getElementById("bgm");
var bosssound = document.getElementById("bosssound")


bgm.loop = true;
bosssound.loop = true;
bgm.autoplay = true;
bgm.load();
bgm.volume = 0.2;

function moveSound() {
  movesound.pause();
  movesound.currentTime = 0;
  movesound.play();
}

function mute() {
  if ((minute >= 1) && (bossalive == 1)) {
    bosssound.pause();
  } else {
    bgm.pause();
  }
}

function unmute() {
  if ((minute >= 1) && (bossalive == 1)) {
    bosssound.play();
  } else {
    bgm.play();
  }
}

function gameOverSound() {
  deadsound.play();
  pianosound.pause();
  pianosound.currentTime = 0;
  pianosound.play();
  bgm.pause();
  gemsound.voume = 0;
  movesound.volume = 0;
  enemysound.volume = 0;
}

function hitSound() {
  enemysound.pause();
  enemysound.currentTime = 0;
  enemysound.play();
}

function collectSound() {
  gemsound.pause();
  gemsound.currentTime = 0;
  gemsound.play();
}

function normalBackground() {
  $('body').css('background', 'url("images/normalbackground.jpg")');
  $('body').css('background-size', 'cover');
  $('body').css('background-repeat', 'no-repeat');
}

function bossBackground() {
  $('body').css('background', 'url("images/bossbackground.jpg")');
  $('body').css('background-size', 'cover');
  $('body').css('background-repeat', 'no-repeat');
}

function spawnBoss() {
  if ((minute == 1) && (second == 0)) {
    allBosses.splice(0, allBosses.length);
    allBosses.push(new Boss());
    bgm.pause();
    bosssound.pause();
    bosssound.currentTime = 0;
    bosssound.play();
    bossBackground();
    bossalive = 1;
  }
}
