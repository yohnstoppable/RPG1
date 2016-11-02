var weapon = function(name, img, damage, str, intelligence, stam, agil, special) {
	this.name = name;
	this.damage = damage;
	this.strength = str;
	this.intelligence = intelligence;
	this.stamina = stam;
	this.agility = agil;
	this.special = special;
	this.img = new Image();
	this.img.src = img;
	this.currentCooldown = 10;
	this.cooldown = 10;
	this.bulletSpeed = 15;
	this.width = 14;
	this.height = 100;
}

weapon.prototype.throw = function(obj,target,goodProjectile) {
    console.log(this.currentCooldown);
	if (this.currentCooldown > 0 ) {
		return;
     }
        var obj = {
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height
        };
	
      projectileArray = Game.projectiles;
	
      this.speed = Common.getRiseRun(obj,target,this);
      projectileArray[projectileArray.length] = new Projectile(obj,this);
      this.currentCooldown = this.cooldown;
}

var shortSword = new weapon("Short Sword", "js/weapons/img/shortSword.png", 5, 0, 0, 0, 0);

var megaSword = new weapon("Mega Sword", "js/weapons/img/megaSword.png", 15, 5, 0, 0, 0);

var weaponList = [shortSword, megaSword, shortSword, shortSword];