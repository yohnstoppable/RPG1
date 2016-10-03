let baseCharacter = {
	this.name;
	this.strength = 0;
	this.agility = 0;
	this.intelligence = 0;
	this.hitpoints = 0;
	this.currentHitpoints = 0;
	this.weapon;
	this.armor;
	this.helmet;
	this.accessory;
	this.characterClass;
	this.buffs = [];
}

baseCharacter.prototype.getArmorClass = function() {
	return this.getStat("agility") + this.armor.getAC();
}

baseCharacter.prototype.getStat = function(stat) {
	return this.getBuffStat(stat) + this.getGearStat(stat) + this[stat];
}

baseCharacter.prototype.getGearStat = function(stat) {
	let gearStat = 0;
	
	if (this.helmet) {
		gearStat += this.helmet[stat];
	}
	
	if (this.armor) {
		gearStat += this.armor[stat];
	}
	
	if (this.accessory) {
		gearStat += this.accessory[stat];
	}
	
	if (this.weapon) {
		gearStat += this.weapon[stat];
	}
	
	return gearStat;
}

baseCharacter.prototype.getBuffStat = function(stat) {
	if (this.buffs.length > 0) {
		return this.buffs.reduce(function(previousValue, currentValue, currentIndex, array) {
			return previousValue[stat] + currentValue[stat];
		});
	}
	
	return 0;
}