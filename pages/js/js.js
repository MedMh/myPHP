/* == Thumbtack == */
var Thumbtack=function(){function e(){for(var e="<div id='Thumbnail'>Explosive Menu</div>",n="<style>@import url(https://fonts.googleapis.com/css?family=Oswald);#Thumbnail {  position: absolute;  top: 0; left: 0;  width: 100vw; height: 100vh;  background: #9b59b6;  text-align: center;  line-height: 100vh;  font-family: 'Oswald';  color: #eee;  font-size: 10vw;  text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);  z-index: 9999;}</style>",t=window.location!=window.parent.location?document.referrer:document.location,o=["/pen/","/details/","/full/","/debug/","/live/","/collab/","/professor/","/pres/","/embed/","/fullembedgrid/"],r=!0,a=0;a<o.length;a++)-1!==t.indexOf(o[a])&&(r=!1);r&&(document.body.insertAdjacentHTML("afterbegin",e),document.head.insertAdjacentHTML("afterbegin",n))}return e()}();
/* == End Thumbtack == */

var canvas = $('canvas')[0];
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var Projectile;
var State = false;
var Explode = false;
var Collapse = false;
var Particles = [];

var colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c"];

function Proj() {
  this.radius = 5.2;
  this.x = Math.random() * canvas.width;
  this.y = canvas.height + this.radius;
  this.color = "#e74c3c";
  this.velocity = {x: 0, y: 0};
  this.speed = 12;
}

Proj.prototype = {
  Update: function() {
    if(this.x > (canvas.width / 2) && this.x - (canvas.width / 2) <= 10 || this.x < (canvas.width / 2) && (canvas.width / 2) - this.x <= 10) {
      Explode = true;
      $('.Nav').addClass('active');
    } else {
      this.dx = (canvas.width / 2) - this.x;
      this.dy = (canvas.height / 2) - this.y;
      this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.velocity.x = (this.dx/this.distance) * this.speed;
      this.velocity.y = (this.dy/this.distance) * this.speed;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  },

  Draw: function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }
};

function Particle() {
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.radius = 4;
  this.color = colors[Math.round(Math.random() * (colors.length + 1))];

  this.velocity = {x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 10, y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 10};
  this.speed = 25;
  this.active = true;
}

Particle.prototype = {
  Update: function() {
    if(Collapse) {
      this.dx = (canvas.width / 2) - this.x;
      this.dy = (canvas.height / 2) - this.y;
      this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.velocity.x = (this.dx/this.distance) * this.speed;
      this.velocity.y = (this.dy/this.distance) * this.speed;
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      if(this.x > (canvas.width / 2) && this.x - (canvas.width / 2) <= 15 || this.x < (canvas.width / 2) && (canvas.width / 2) - this.x <= 15) {
        if(this.y > (canvas.height / 2) && this.y - (canvas.height / 2) <= 15 || this.y < (canvas.height / 2) && (canvas.height / 2) - this.y <= 15) {
          this.active = false;
        }
      }
    } else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  },

  Draw: function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.lineWidth = 2.2;
    context.strokeStyle = this.color;
    context.stroke();
    context.closePath();
  }
};

function Update() {
  if(Particles.length < 100) {
    for(var x = Particles.length; x < 100; x++) {
      Particles.push(new Particle());
    }
  }
  
  if(Explode || Collapse) {
    Particles.forEach(function(particle) {
      particle.Update();
    });
  }

  Particles = Particles.filter(function(particle) {
    return particle.active;
  });

  if(State && !Explode) {
    Projectile.Update();
  }

  Render();
  requestAnimationFrame(Update);
}

function Render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if(Collapse || Explode) {
    Particles.forEach(function(particle) {
      particle.Draw();
    });
  }

  if(State && !Explode) {
    Projectile.Draw();
  }
}

$('#Button').click(function() {
  State = !State;

  if(Explode && State == false) { 
    Collapse = true;
  } else {
    Collapse = false;
    Particles = [];
  }

  if(State) {
    Projectile = new Proj();
  } else {
    Projectile = null;
    Explode = false;
  }

  if(!State) {
    $('.Nav').removeClass('active');
  }
  $(this).toggleClass('fontawesome-fire');
  $(this).toggleClass('fontawesome-remove');
});

$(document).ready(function() {
  Update();
});

$(window).resize(function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
