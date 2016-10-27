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
}

var shortSword = new weapon("Short Sword", "js/weapons/img/shortSword.png", 5, 0, 0, 0, 0);

var megaSword = new weapon("Mega Sword", "js/weapons/img/megaSword.png", 15, 5, 0, 0, 0);

var weaponList = [shortSword, megaSword, shortSword, shortSword];