function Player(session,class_name, aspect, object_to_prototype, moon, godDestiny,id){

  //call if I overrode claspect or interest or anything
	this.reinit = function(){
		//console.log("player reinit");
		this.chatHandle = getRandomChatHandle(this.class_name,this.aspect,this.interest1, this.interest2);
		this.mylevels = getLevelArray(this);//make them ahead of time for echeladder graphic
		var tmp = getRandomLandFromPlayer(this);
		this.land1 = tmp[0]
		this.land2 = tmp[1];
		this.land = "Land of " + tmp[0] + " and " + tmp[1];
	}
	this.baby = null;
	this.interest1Category = null; //used by Replay page for custom interests.
	this.interest2Category = null; //both should be null once they have been used to add the custom interest to the right place
	this.spriteCanvasID = null;  //part of new rendering engine.
	this.session = session;
	this.currentHP = 0;
	this.sprite = null; //gets set to a blank sprite when character is created.
	this.grist = 0; //total party grist needs to be at a certain level for the ultimate alchemy. luck events can raise it, boss fights, etc.
	this.hp = 0; //mostly used for boss battles;
	this.graphs = [];
	this.id = id;
	this.flipOutReason = null; //if it's null, i'm not flipping my shit.
	this.flippingOutOverDeadPlayer = null; //don't let this go into url. but, don't flip out if the friend is currently alive, you goof.
	this.denizen_index = 0; //denizen quests are in order.
	this.causeOfDrain = null; //just ghost things
	this.ghostWisdom = []; //keeps you from spamming the same ghost over and over for wisdom.
	this.ghostPacts = []; //some classes can form pacts with ghosts for use in boss battles (attack or revive) (ghosts don't leave bubbles, just lend power). or help others do so.  if i actually use a ghost i have a pact with, it's drained. (so anybody else with a pact with it can't use it.)
	this.land1 = null; //words my land is made of.
	this.land2 = null;
	this.minLuck = 0;
	this.maxLuck = 0;
	this.freeWill = 0;
	this.mobility = 0;
	this.crowned = false; //players can't be crowned.
	this.trickster = false;
	this.sbahj = false;
	this.sickRhymes = []; //oh hell yes. Hell. FUCKING. Yes!
	this.robot = false;
	this.ectoBiologicalSource = null; //might not be created in their own session now.
	this.class_name = class_name;
	this.guardian = null; //no longer the sessions job to keep track.
	this.number_confessions = 0;
	this.number_times_confessed_to = 0;
	this.baby_stuck = false;
	this.influenceSymbol = null; //multiple aspects can influence/mind control.
	this.influencePlayer = null; //who is controlling me? (so i can break free if i have more free will or they die)
	this.stateBackup = null; //if you get influenced by something, here's where your true self is stored until you break free.
	this.aspect = aspect;
	this.land = null;
	this.interest1 =null;
	this.interest2 = null;
	this.chatHandle = null;
	this.object_to_prototype = object_to_prototype;
	this.relationships = [];
	this.moon = moon;
	this.power = 1;   //power is generic. generally scales with any aplicable stats. lets me compare two different aspect players.
	this.leveledTheHellUp = false; //triggers level up scene.
	this.mylevels = null
	this.level_index = -1; //will be ++ before i query
	this.godTier = false;
	this.victimBlood = null; //used for murdermode players.
	this.hair = null
	//this.hair = 16;
	this.hairColor = null
	this.dreamSelf = true;
	this.isTroll = false; //later
	this.bloodColor = "#ff0000" //human red.
	this.leftHorn = null;
	this.rightHorn = null;
	this.lusus = "Adult Human"
	this.quirk = null;
	this.dead = false;
	this.godDestiny = godDestiny;
	//should only be false if killed permananetly as god tier
	this.canGodTierRevive = true;  //even if a god tier perma dies, a life or time player or whatever can brings them back.
	this.isDreamSelf = false;
	//players can be triggered for various things. higher their triggerLevle, greater chance of going murdermode or GrimDark.
	this.triggerLevel = -2; //make up for moon bonus
	this.murderMode = false;  //kill all players you don't like. odds of a just death skyrockets.
	this.leftMurderMode = false; //have scars, unless left via death.
	this.corruptionLevelOther = 0; //every 100 points, sends you to next grimDarkLevel.
	this.grimDark = 0;  //  0 = none, 1 = some, 2 = some more 3 = full grim dark with aura and font and everything.
	this.leader = false;
	this.landLevel = 0; //at 10, you can challenge denizen.  only space player can go over 100 (breed better universe.)
	this.denizenFaced = false;
	this.denizenDefeated = false;
	this.denizenMinionDefeated = false;
	this.causeOfDeath = ""; //fill in every time you die. only matters if you're dead at end
	this.doomedTimeClones =  []; //help fight the final boss(es).
	this.doomed = false; //stat that doomed time clones have.


	this.fromThisSession = function(session){
		return (this.ectoBiologicalSource == null || this.ectoBiologicalSource == session.session_id)
	}

	this.getHearts = function(){
		var ret = [];
		for (var i = 0; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.saved_type == r.heart){
				ret.push(r);
			}
		}
		return ret;
	}

	//flipping out over the dead won't call this but everything else will.
	this.flipOut = function(reason){
		//console.log("flip out method called for: " + reason)
		this.flippingOutOverDeadPlayer = null;
		this.flipOutReason = reason;
	}

	//if change would push me over 3, render 'cause i'm newly grimdark
	//if it would pull be from over 3, render 'cause i have somewhat recovered.
	this.changeGrimDark = function(val){
		//this.grimDark += val;
		var tmp = this.grimDark + val;
		var render = false;

		if(this.grimDark <= 3 && tmp > 3){ //newly GrimDark
			render = true;
		}else if(this.grimDark >3 && tmp <=3){ //newly recovered.
			render = true;
		}
		this.grimDark += val;
		if(render){
			this.renderSelf();
		}

	}

	this.makeMurderMode = function(){
		this.murderMode = true;
		this.increasePower();
		this.renderSelf(); //new scars. //can't do scars just on top of sprite 'cause hair might cover.'
	}

	this.unmakeMurderMode = function(){
		this.murderMode = false;
		this.leftMurderMode = true;
		this.renderSelf();
	}

	this.makeDead = function(causeOfDeath){
		this.dead = true;
		this.causeOfDeath = causeOfDeath;
		//was in make alive, but realized that this makes doom ghosts way stronger if it's here. powered by DEATH, but being revived.
		if(this.aspect == "Doom"){ //powered by their own doom.
			//console.log("doom is powered by their own death: " + this.session.session_id) //omg, they are sayians.
			this.power += 50;
			this.hp = 100; //prophecy fulfilled. but hp and luck will probably drain again.
			this.minLuck = 100; //prophecy fulfilled. you are no longer doomed.
		}
		if(!this.godTier){ //god tiers only make ghosts in GodTierRevivial
			this.session.afterLife.addGhost(makeRenderingSnapshot(this));
		}

		this.renderSelf();
		this.triggerOtherPlayersWithMyDeath();
	}

	//this used to happen in beTriggered. fuck that noise, it was shit.
	this.triggerOtherPlayersWithMyDeath = function(){
		//go through my relationships. if i am the only dead person, trigger everybody (death still has impact)
		//trigger (possibly ontop of base trigger) friends, and quadrant mates. really fuck up my moirel(s) if i have any
		//if triggered, also give a flip out reason.
		var dead = findDeadPlayers(this.session.players);
		for(var i = 0; i <this.relationships.length; i++){
			var r = this.relationships[i];

			if(r.saved_type == r.goodBig){
				r.target.triggerLevel ++;
				if(r.target.flipOutReason == null){
					r.target.flipOutReason = " their dead crush, the " + this.htmlTitleBasic(); //don't override existing flip out reasons. not for something as generic as a dead crush.
					r.target.flippingOutOverDeadPlayer = this;
				}
			}else if(r.value > 0){
				r.target.triggerLevel ++;
				if(r.target.flipOutReason == null){
					 r.target.flippingOutOverDeadPlayer = this;
					 r.target.flipOutReason = " their dead friend, the " + this.htmlTitleBasic(); //don't override existing flip out reasons. not for something as generic as a dead friend.
				}
			}else if(r.saved_type == r.spades){
				r.target.triggerLevel +=10;
				r.target.flipOutReason = " their dead Kismesis, the " + this.htmlTitleBasic();
				r.target.flippingOutOverDeadPlayer = this;
			}else if(r.saved_type == r.heart){
				r.target.triggerLevel += 10
				r.target.flipOutReason = " their dead Matesprit, the " + this.htmlTitleBasic();
				r.target.flippingOutOverDeadPlayer = this;
			}
			else if(r.saved_type == r.diamond){
				r.target.triggerLevel += 100
				r.target.damageAllRelationships();
				r.target.damageAllRelationships();
				r.target.damageAllRelationships();
				r.target.flipOutReason = " their dead Moirail, the " + this.htmlTitleBasic() + ", fuck, that can't be good...";
				r.target.flippingOutOverDeadPlayer = this;
			}
			//console.log(r.target.title() + " has flipOutReason of: " + r.target.flipOutReason + " and knows about dead player: " + r.target.flippingOutOverDeadPlayer);
		}

		//whether or not i care about them, there's also the novelty factor.
		if(dead.length == 1){  //if only I am dead, death still has it's impact and even my enemies care.
			r.target.triggerLevel ++;
			if(r.target.flipOutReason == null){
				r.target.flipOutReason = " the dead player, the " + this.htmlTitleBasic(); //don't override existing flip out reasons. not for something as generic as a dead player.
			 r.target.flippingOutOverDeadPlayer = this;
			}
		}
	}

	//needed'cause ghost pacts are a an array of pairs now so i know how i'm reviving.
	this.getPactWithGhost = function(ghost){
		for(var i = 0; i<this.ghostPacts.length; i++){
			var g = this.ghostPacts[i][0]
			if(g == ghost) return g
		}
		return null;
	}

	this.getSpades = function(){
		var ret = [];
		for (var i = 0; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.saved_type == r.spades){
				ret.push(r);
			}
		}
		return ret;
	}

	this.getCrushes = function(){
		var ret = [];
		for (var i = 0; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.saved_type == r.goodBig){
				ret.push(r);
			}
		}
		return ret;
	}

	this.getBlackCrushes = function(){
		var ret = [];
		for (var i = 0; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.saved_type == r.badBig){
				ret.push(r);
			}
		}
		return ret;
	}


	this.getDiamonds = function(){
		var ret = [];
		for (var i = 0; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.saved_type == r.diamond){
				ret.push(r);
			}
		}
		return ret;
	}


	this.chatHandleShort = function(){
		return this.chatHandle.match(/\b(\w)|[A-Z]/g).join('').toUpperCase();
	}

	this.chatHandleShortCheckDup = function(otherHandle){
		var tmp= this.chatHandle.match(/\b(\w)|[A-Z]/g).join('').toUpperCase();
		if(tmp == otherHandle){
			tmp = tmp + "2";
		}
		return tmp;
	}

	//what happened when you reached god tier was too inconsistent, and also
	//this lets sprite be updated.
	this.makeGodTier = function(){
		this.hp += 500; //they are GODS.
		this.power += 500;
		this.increasePower();
		this.godTier = true;
		this.session.godTier = true;
		this.dreamSelf = false;
		this.canGodTierRevive = true;
		this.leftMurderMode = false; //no scars, unlike other revival methods
		this.isDreamSelf = false;
		this.makeAlive();
	}



	this.makeAlive = function(){
			if(this.stateBackup) this.stateBackup.restoreState(this);
			this.influencePlayer = null;
			this.influenceSymbol = null;
			this.dead = false;
			this.murderMode = false;
			this.currentHP = Math.max(this.hp,1); //if for some reason your hp is negative, don't do that.
			this.grimDark = false;
			this.triggerLevel = 11;  //dying is pretty triggering.
			this.flipOutReason = "they just freaking died"
			//this.leftMurderMode = false; //no scars
			this.victimBlood = null; //clean face
			this.renderSelf();
		}

		//people like them less and also they are more triggered.
	this.consequencesForTerriblePlayer  = function(){
		if((terrible_interests.indexOf(this.interest1) != -1)){
			this.damageAllRelationshipsWithMe();
			this.damageAllRelationshipsWithMe();
			this.damageAllRelationshipsWithMe();
			this.triggerLevel ++;
		}

		if((terrible_interests.indexOf(this.interest2) != -1)){
			this.damageAllRelationshipsWithMe();
			this.damageAllRelationshipsWithMe();
			this.damageAllRelationshipsWithMe();
			this.triggerLevel ++;
		}
	}

	//people like them more and also they are less triggered.
	this.consequencesForGoodPlayer = function(){
		if((social_interests.indexOf(this.interest1) != -1)){
			this.boostAllRelationshipsWithMe();
			this.boostAllRelationshipsWithMe();
			this.boostAllRelationshipsWithMe();
			this.triggerLevel +=-1;
		}

		if((social_interests.indexOf(this.interest2) != -1)){
			this.boostAllRelationshipsWithMe();
			this.boostAllRelationshipsWithMe();
			this.boostAllRelationshipsWithMe();
			this.triggerLevel +=-1;
		}
	}


	this.title = function(){
		var ret = "";

		if(this.doomed){
			ret += "Doomed "
		}

		if(this.robot){
			ret += "Robo"
		}

		if(this.trickster){
			ret += "Trickster "
		}

		if(this.murderMode){
			ret += "Murder Mode ";
		}

		if(this.grimDark>3){
			ret += "Severely Grim Dark ";
		}else if(this.grimDark > 1){
			ret += "Mildly Grim Dark ";
		}else if(this.grimDark >2){
			ret += "Grim Dark ";
		}

		if(this.godTier){
			ret+= "God Tier "
		}else if(this.isDreamSelf){
			ret+= "Dream ";
		}
		ret+= this.class_name + " of " + this.aspect;
		if(this.dead){
			ret += "'s Corpse"
		}else if(this.ghost){
			ret += "'s Ghost"
		}
		return ret;
	}

	this.htmlTitleBasic = function(){
			return getFontColorFromAspect(this.aspect) + this.titleBasic() + "</font>"
	}

	this.titleBasic = function(){
		var ret = "";

		ret+= this.class_name + " of " + this.aspect;
		return ret;
	}

	//old method from 1.0
	this.getRandomLevel = function(){
		if(Math.seededRandom() > .5){
			return getRandomLevelFromAspect(this.aspect);
		}else{
			return getRandomLevelFromClass(this.class_name);
		}
	}

//new method having to pick 16 levels before entering the medium
	this.getNextLevel = function(){
		this.level_index ++;
		var ret= this.mylevels[this.level_index];
		return ret;
	}

	this.getRandomQuest = function(){
		if(this.landLevel >= 9 && this.denizen_index < 3 && this.denizenDefeated == false){ //three quests before denizen
			//console.log("denizen quest")
			return getRandomDenizenQuestFromAspect(this); //denizen quests are aspect only, no class.
		}else if((this.landLevel < 9 || this.denizen_index >=3) && this.denizenDefeated == false){  //can do more land quests if denizen kicked your ass. need to grind.
			if(Math.seededRandom() > .5 || this.aspect == "Space"){ //back to having space players be locked to frogs.
				return getRandomQuestFromAspect(this.aspect);
			}else{
				return getRandomQuestFromClass(this.class_name);
			}
		}else if(this.denizenDefeated){
			//console.log("post denizen quests " +this.session.session_id);
			//return "restoring their land from the ravages of " + this.session.getDenizenForPlayer(this).name;
			if(Math.seededRandom() > .5 || this.aspect == "Space"){ //back to having space players be locked to frogs.
				return getRandomQuestFromAspect(this.aspect,true);
			}else{
				return getRandomQuestFromClass(this.class_name,true);
			}
		}

	}

	this.decideHemoCaste  =function (){
		if(this.aspect != "Blood"){  //sorry karkat
			this.bloodColor = getRandomElementFromArray(bloodColors);
		}
	}

	this.decideLusus = function(player){
		if(this.bloodColor == "#610061" || this.bloodColor == "#99004d" || this.bloodColor == "#631db4" ){
			this.lusus = getRandomElementFromArray(sea_lusus_objects);
		}else{
			this.lusus = getRandomElementFromArray(lusus_objects);
		}
	}

	this.isVoidAvailable = function(){
		var light = findAspectPlayer(findLivingPlayers(this.session.players), "Light");
		if(light && light.godTier) return false;
		return true;
	}

	//classes only, at least for now
	this.getPVPModifier = function(role){
		if(role == "Attacker") return this.getAttackerModifier();
		if(role == "Defender") return this.getDefenderModifier();
		if(role == "Murderer") return this.getMurderousModifier();

	}

	//basically free will shit. choosing to kill a player despite not being crazy
	this.getAttackerModifier = function(){
		if(this.class_name == "Knight") return 1.0;
		if(this.class_name == "Seer") return 0.67;
		if(this.class_name == "Bard") return 2.0;
		if(this.class_name == "Maid") return 0.33;
		if(this.class_name == "Heir") return 0.5;
		if(this.class_name == "Rogue") return 1.25;
		if(this.class_name == "Page"){
			if(this.godTier){
				return 5.0;
			}else{
				return 1.0;
			}
		}
		if(this.class_name == "Thief") return 1.5;
		if(this.class_name == "Sylph") return 2.5;
		if(this.class_name == "Prince") return 5.0;
		if(this.class_name == "Witch") return 2.0;
		if(this.class_name == "Mage") return 0.67;
		return 1.0;
	}



	//defending yourself from an attack
	this.getDefenderModifier = function(){
		if(this.class_name == "Knight") return 2.5;
		if(this.class_name == "Seer") return 0.67;
		if(this.class_name == "Bard") return 0.5;
		if(this.class_name == "Maid") return 3.0;
		if(this.class_name == "Heir") return 2.0;
		if(this.class_name == "Rogue") return 1.25;
		if(this.class_name == "Page"){
			if(this.godTier){
				return 5.0;
			}else{
				return 1.0;
			}
		}
		if(this.class_name == "Thief") return 0.8;
		if(this.class_name == "Sylph") return 1.0;
		if(this.class_name == "Prince") return 0.33;
		if(this.class_name == "Witch") return 1.0;
		if(this.class_name == "Mage") return 0.67;
		return 1.0;
	}

	//being shit flippingly crazy AND initiating a fight
	this.getMurderousModifier = function(){
		if(this.class_name == "Knight") return 0.75;
		if(this.class_name == "Seer") return 1.0;
		if(this.class_name == "Bard") return 3.0;
		if(this.class_name == "Maid") return 1.5;
		if(this.class_name == "Heir") return 1.5;
		if(this.class_name == "Rogue") return 1.0;
		if(this.class_name == "Page"){
			if(this.godTier){
				return 5.0;
			}else{
				return 1.0;
			}
		}
		if(this.class_name == "Thief") return 1.0;
		if(this.class_name == "Sylph") return 1.5;
		if(this.class_name == "Prince") return 1.5;
		if(this.class_name == "Witch") return 1.5;
		if(this.class_name == "Mage") return 1.5;
		return 1.0;
	}


	this.getDenizen = function(){
		return this.session.getDenizenForPlayer(this).name;
	}

	this.didDenizenKillYou = function(){
		if(this.causeOfDeath.includes(this.session.getDenizenForPlayer(this).name)){
			return true; //also return true for minions. this is intentional.
		}
		return false;
	}

	//more likely if lots of people hate you
	this.justDeath = function(){
		var ret = false;

		//impossible to have a just death from a denizen or denizen minion. unless you are corrupt.
		if(this.didDenizenKillYou() && !this.grimDark <= 2){
			return false;
		}else if(this.grimDark > 2){
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!just death for a courrpt player from their denizen or denizen mionion in session: " + this.session.session_id)
			return true; //always just if the denizen puts down a corrupt player.
		}


		//if much less friends than enemies.
		if(this.getFriends().length < this.getEnemies().length){
			if(Math.seededRandom() > .9){ //just deaths are rarer without things like triggers.
				ret = true;
			}
			//way more likely to be a just death if you're being an asshole.


			if((this.murderMode || this.grimDark > 2)){
				var rand = Math.seededRandom()
				//console.log("rand is: " + rand)
				if(rand > .2){
					//console.log(" just death for: " + this.title() + "rand is: " + rand)
					ret = true;
				}
			}
		}else{  //you are a good person. just corrupt.
			//way more likely to be a just death if you're being an asshole.
			if((this.murderMode || this.grimDark > 2) && Math.seededRandom()>.5){
				ret = true;
			}
		}
		//console.log(ret);
		//return true; //for testing
		return ret;
	}

	//more likely if lots of people like you
	this.heroicDeath = function(){
		var ret = false;

		//it's not heroic derping to death against a minion or whatever, or in a solo fight.
		if(this.didDenizenKillYou() || this.causeOfDeath == "from a Bad Break."){
			return false;
		}

		//if far more enemies than friends.
		if(this.getFriends().length > this.getEnemies().length ){
			if(Math.seededRandom() > .6){
				ret = true;
			}
			//extra likely if you just killed the king/queen, you hero you.
			if(curSessionGlobalVar.kingStrength <=0 && Math.seededRandom()>.2){
				ret = true;
			}
		}else{ //unlikely hero
			if(Math.seededRandom() > .8){
				ret = true;
			}
			//extra likely if you just killed the king/queen, you hero you.
			if(curSessionGlobalVar.kingStrength <=0 && Math.seededRandom()>.4){
				ret = true;
			}
		}

		if(ret){
			//console.log("heroic death");
		}
		return ret;
	}

	//luck is about sprinting towards good events, not avoiding bad ones. only modifies max luck.
	this.lightInteractionEffect = function(player){
		var amount = this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.maxLuck += amount
			player.maxLuck += -1 * amount;
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.maxLuck += -1 * amount;
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.maxLuck += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.maxLuck += amount;
		}else if(this.class_name == "Bard"){ //destroys in others
			player.maxLuck += -1 * amount;
		}

	}

	this.mindInteractionEffect = function(player){
		var amount = this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.freeWill += amount
			player.freeWill += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.freeWill += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.freeWill += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.freeWill += amount
		}else if(this.class_name == "Bard"){ //destroys in others
			player.freeWill += -1*amount
		}
	}

	this.timeInteractionEffect = function(player){
		var amount = -1 * this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.freeWill += amount
			player.freeWill += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.freeWill += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.freeWill += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.freeWill += amount
		}else if(this.class_name == "Bard"){ //destroys in others
			player.freeWill += -1*amount
		}
	}


	this.lifeInteractionEffect = function(player){
		var amount = this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.hp += amount;
			this.currentHP += amount;
			player.hp += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.hp += -1*amount
			player.currentHP += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.hp += amount/this.session.players.length;
				p.currentHP += amount/this.session.players.length;

			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.hp += amount
			player.currentHP += amount
		}else if(this.class_name == "Bard"){ //destroys in others
			player.hp += -1*amount
			player.currentHP += -1*amount
		}
	}

	this.rageInterctionEffect = function(player,numTimes){
		numTimes ++;
		if(numTimes > 10){
			console.log("rage/void infinite loop. just fucking stop. " + this.session.session_id)
			return; //just fucking stop
		}
		var amount = this.power/10;
		if(this.class_name == "Thief"){ //takes for self
			this.triggerLevel += amount;
			if(amount > 1) this.flipOut(" the Rage coursing through their body")
			player.triggerLevel += -1 * amount
			player.flipOutReason = null;
			player.flippingOutOverDeadPlayer = null;
			this.boostAllRelationshipsWithMeBy(amount);
			this.boostAllRelationshipsBy(amount)
			player.boostAllRelationshipsWithMeBy(-1*amount);
			player.boostAllRelationshipsBy(-1* amount)
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.triggerLevel += -1*amount
			player.flipOutReason = null;
			player.flippingOutOverDeadPlayer = null;
			player.boostAllRelationshipsWithMeBy(-1*amount);
			player.boostAllRelationshipsBy(-1* amount)
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.triggerLevel += amount/this.session.players.length;
				p.boostAllRelationshipsWithMeBy(amount);
				p.boostAllRelationshipsBy(amount)
			}
		}else if(this.class_name == "Sylph"){ //heals others 'healing' rage would increase it.
			player.triggerLevel += amount
			player.boostAllRelationshipsWithMeBy(amount);
			player.boostAllRelationshipsBy(amount)
		}else if(this.class_name == "Bard"){ //destroys in others
			player.triggerLevel += -1*amount
			if(amount > 1) player.flipOut(" the Rage coursing through their body")
			player.boostAllRelationshipsWithMeBy(-1*amount);
			player.boostAllRelationshipsBy(-1* amount)
			player.flipOutReason = null;  //people can't remember why they are angry.
			player.flippingOutOverDeadPlayer = null;
		}
		this.voidInteractionEffect(player, numTimes);
	}

	this.heartInteractionEffect = function(player){
		var amount = this.power/10;
		if(this.class_name == "Thief"){ //takes for self
			this.boostAllRelationshipsBy(amount);
			player.boostAllRelationshipsBy(-1* amount)
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.boostAllRelationshipsBy(-1*amount)
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.boostAllRelationshipsBy(amount/this.session.players.length);
			}
		}else if(this.class_name == "Sylph"){ //heals others 'healing' rage would increase it.
			player.boostAllRelationshipsBy(amount);
			//way too OP an ability, only sylphs of heart have it
			player.changeGrimDark(-1);
		}else if(this.class_name == "Bard"){ //destroys in others
			player.boostAllRelationshipsBy(-1*amount)
		}
	}

	this.breathInteractionEffect = function(player){
		var amount = this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.mobility += amount
			player.mobility += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.mobility += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.mobility += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.mobility += amount
		}else if(this.class_name == "Bard"){ //destroys in others
			player.mobility += -1*amount
		}
	}

	//space is sticky. stuck on your planet breeding frogs, stuck in brooding caverns.
	/*'Calliope has also stated that Space is a typically passive aspect with great power,
	falling back and hosting the stage before
	suddenly in some way showing "who is truly the master" and then collapsing in on itself. '
	Yeah, First Guardian Jade had teleport powers, but there was nothing to show that that was a NORMAL space ability.
	She only glowed green doing that, not when altering sizes.
	Space is about groundingyou. It's gravity. It's so damn HARD to travel in space, cause it wants you to stay right the hell where you are.
	*/
	this.spaceInteractionEffect = function(player){
		var amount = -1* this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.mobility += amount
			player.mobility += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.mobility += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.mobility += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.mobility += amount
		}else if(this.class_name == "Bard"){ //destroys in others
			player.mobility += -1*amount
		}
	}

	this.bloodInteractionEffect = function(player){
		var amount = -1* this.power/10;
		if(this.class_name == "Thief"){ //takes for self
			this.triggerLevel += amount;
			player.triggerLevel += -1 * amount
			this.boostAllRelationshipsWithMeBy(-1*amount);
			player.boostAllRelationshipsWithMeBy(amount);
			if(amount > 1) player.flipOut(" how they are sure no one likes them")
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.triggerLevel += -1*amount
			if(amount > 1) player.flipOut(" how they are sure no one likes them")
			player.boostAllRelationshipsWithMeBy(amount);
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.triggerLevel += amount/this.session.players.length;
				p.boostAllRelationshipsWithMeBy(-1*amount);
			}
		}else if(this.class_name == "Sylph"){ //heals others 'healing' rage would increase it.
			player.triggerLevel += amount
			player.boostAllRelationshipsWithMeBy(-1*amount);
			player.flipOutReason = null;
			player.flippingOutOverDeadPlayer = null;
		}else if(this.class_name == "Bard"){ //destroys in others
			player.triggerLevel += -1*amount
			if(amount > 1) player.flipOut(" how they are sure no one likes them")
			player.boostAllRelationshipsWithMeBy(amount);
		}
	}

	//doom is about bad ends. only modifies min luck. alkso modifies power directly
	this.doomInteractionEffect = function(player){
		var amount = -1* this.power/3; //
		if(this.class_name == "Thief"){ //takes for self
			this.hp += amount;
			this.minLuck += amount
			player.hp += -1*amount
			player.minLuck += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.power += -1*amount
			player.minLuck += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.hp += amount/this.session.players.length;
				p.minLuck += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.hp += amount
			player.minLuck += amount
		}else if(this.class_name == "Bard"){ //destroys in others
			player.hp += -1*amount
			player.minLuck += -1*amount
		}
	}

	this.hopeInteractionEffect = function(player){
		var amount = this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.power += amount;
			player.power += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.power += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.power += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.power += amount
			player.flipOutReason = null;  //don't focus on why we are screwed.
			player.flippingOutOverDeadPlayer = null;
		}else if(this.class_name == "Bard"){ //destroys in others
			player.power += -1*amount
		}
		player.power = Math.max(player.power, 1);
	}

	//rage and void have randomness in common
	//so they can infinite loop. don't let them. rage can call void. void can call rage.
	//intentionally allowing rage/void players to randomly get massive stat buffs.
	this.voidInteractionEffect = function(player,numTimes){
		numTimes ++;
		if(numTimes > 10){
			//just fucking return;
			console.log("rage/void infinite loop. just fucking stop. " + this.session.session_id)
			return;
		}
		//void does nothing innately, modifies things at random.
		var statInteractions = [this.lightInteractionEffect.bind(this,player),this.mindInteractionEffect.bind(this,player),this.timeInteractionEffect.bind(this,player),this.lifeInteractionEffect.bind(this,player),this.rageInterctionEffect.bind(this,player, numTimes),this.heartInteractionEffect.bind(this,player),this.breathInteractionEffect.bind(this,player),this.spaceInteractionEffect.bind(this,player),this.bloodInteractionEffect.bind(this,player),this.doomInteractionEffect.bind(this,player),this.hopeInteractionEffect.bind(this,player)];
		getRandomElementFromArray(statInteractions)();
		var amount = this.power/3;
		if(this.class_name == "Thief"){ //takes for self
			this.corruptionLevelOther += amount;
			player.corruptionLevelOther += -1*amount
		}else if(this.class_name == "Rogue"){ //takes an distributes to others.
			player.corruptionLevelOther += -1*amount
			for(var i = 0; i<this.session.players.length; i++){
				var p = this.session.players[i];
				p.corruptionLevelOther += amount/this.session.players.length;
			}
		}else if(this.class_name == "Sylph"){ //heals others
			player.corruptionLevelOther += amount
			player.flipOutReason = null;  //don't focus on why we are screwed.
			player.flippingOutOverDeadPlayer = null;
		}else if(this.class_name == "Bard"){ //destroys in others
			player.corruptionLevelOther += -1*amount
		}
		player.corruptionLevelOther = Math.max(player.power, 1);


	}


	this.interactionEffect = function(player){
		if(this.aspect == "Light"){
			this.lightInteractionEffect(player);
		}else if(this.aspect =="Doom"){
			this.doomInteractionEffect(player);
		}else if(this.aspect =="Blood"){
			this.bloodInteractionEffect(player);
		}else if(this.aspect =="Rage"){
			this.rageInterctionEffect(player);
		}else if(this.aspect =="Heart"){
			this.heartInteractionEffect(player);
		}else if(this.aspect =="Breath"){
			this.breathInteractionEffect(player);
		}else if(this.aspect =="Hope"){
			this.hopeInteractionEffect(player);
		}else if(this.aspect =="Mind"){
			this.mindInteractionEffect(player);
		}else if(this.aspect =="Life"){
			this.lifeInteractionEffect(player);
		}else if(this.aspect =="Void"){
			this.voidInteractionEffect(player);
		}else if(this.aspect =="Space"){
			this.spaceInteractionEffect(player);
		}else if(this.aspect =="Time"){
			this.timeInteractionEffect(player);
		}
		//no longer do this seperate. if close enough to modify with powers, close enough to be...closer.
		r1 = this.getRelationshipWith(player);
		if(r1){
			r1.moreOfSame();
		}

	}

	//SBURB is not a mystery to these classes/aspects.
	this.knowsAboutSburb = function(){
		//time might not innately get it, but they have future knowledge
		var rightClass = this.class_name == "Seer" || this.aspect == "Light" || this.aspect == "Mind" || this.aspect == "Doom" || this.aspect == "Time"
		return rightClass && this.power > 20; //need to be far enough in my claspect
	}

	this.performEctobiology = function(session){
		session.ectoBiologyStarted = true;
		playersMade = findPlayersWithoutEctobiologicalSource(session.players);
		setEctobiologicalSource(playersMade, session.session_id)
		return playersMade;
	}

	this.isActive = function(){
		return (this.class_name == "Thief" || this.class_name == "Knight" || this.class_name == "Heir"|| this.class_name == "Mage"|| this.class_name == "Witch"|| this.class_name == "Prince")
	}

	this.hopeIncreasePower = function(powerBoost){
		var power = powerBoost/10;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			power = -1 *power;
		}

		if(this.isActive()){ //modify me
			this.power += power;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.power += power;
			}
		}
		this.power = Math.max(this.power, 1); //don't heal the enemy you goof.
	}
	//only looks at best outcomes
	this.lightIncreasePower = function(powerBoost){
		var luckModifier = powerBoost;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			luckModifier = -1 *luckModifier;
		}

		if(this.isActive()){ //modify me
			this.maxLuck += luckModifier;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.maxLuck += luckModifier;
			}
		}
	}

	this.mindIncreasePower = function(powerBoost){
		var modifier = powerBoost;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			modifier = -1 *modifier;
		}

		if(this.isActive()){ //modify me
			this.freeWill += modifier;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.freeWill += modifier;
			}
		}
	}

	//time is about fate and inevitability, not decisions and free will.
	this.timeIncreasePower = function(powerBoost){
		var modifier = -1 * powerBoost;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			modifier = -1 *modifier;
		}

		if(this.isActive()){ //modify me
			this.freeWill += modifier;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.freeWill += modifier;
			}
		}
	}

	this.doomIncreasePower = function(powerBoost){
		var power = -1 * powerBoost; //over 2 stats.
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			power = -1 *power;
		}

		if(this.isActive()){ //modify me
			this.hp += power;
			this.minLuck += power;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.hp += power;
				this.minLuck += power;
			}
		}
	}

	this.lifeIncreasePower = function(powerBoost){
		var landBoost = powerBoost/100;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			landBoost = -1 *landBoost;
		}

		if(this.isActive()){ //modify me
			this.hp += landBoost;
			this.currentHP += landBoost; //only life effects currentHP. if i let doom do it, can have negative hp. no thank you, SIR.
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.hp += landBoost;
				player.currentHP += landBoost;
			}
		}
	}


	//wanted this to modify relationships, but figured i'd give that to heart
	//blood keeps people from killing each other.
	this.bloodIncreasePower = function(powerBoost){
		var triggerModifier = -1*powerBoost/10;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			triggerModifier = -1 *triggerModifier;
		}

		if(this.isActive()){ //modify me
			this.triggerLevel += triggerModifier;
			if(triggerModifier > 1) this.flipOut(" how they are sure no one likes them")
			this.boostAllRelationshipsWithMeBy(-1*triggerModifier);
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.triggerLevel += triggerModifier;
				if(triggerModifier > 1) player.flipOut(" how they are sure no one likes them")
				player.boostAllRelationshipsWithMeBy(-1*triggerModifier);
			}
		}
	}

		//num tiems because rage can call void and void always calls rage and they can get into an infinite loop.
		//both rage and void are so unpredictable
	this.rageIncreasePower = function(powerBoost, numTimes){
		numTimes ++;

		if(numTimes > 10){
			console.log("rage/void infinite loop. just fucking stop. " + this.session.session_id)
			return; //just fucking stop/
		}
		var triggerModifier = powerBoost/10;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			triggerModifier = -1 *triggerModifier;
		}

		if(this.isActive()){ //modify me
			this.triggerLevel += triggerModifier;
			if(triggerModifier > 1) this.flipOut(" the Rage coursing through their body")
			this.boostAllRelationshipsWithMeBy(-1*triggerModifier);
			this.boostAllRelationshipsBy(-1*triggerModifier);

		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.triggerLevel += triggerModifier;
				if(triggerModifier > 1) player.flipOut(" the Rage coursing through their body")
				player.boostAllRelationshipsWithMeBy(-1*triggerModifier);
				player.boostAllRelationshipsBy(-1*triggerModifier);
			}
		}
		this.voidIncreasePower(powerBoost, numTimes);
	}

	this.heartIncreasePower = function(powerBoost){
		var relationshipModifier = powerBoost/10;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			relationshipModifier = -1 *relationshipModifier;
		}

		if(this.isActive()){ //modify me
			this.boostAllRelationshipsBy(relationshipModifier);
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.boostAllRelationshipsBy(relationshipModifier);
			}
		}
	}


	this.breathIncreasePower = function(powerBoost){
		var mobilityModifier = powerBoost;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			mobilityModifier = -1 *mobilityModifier;
		}

		if(this.isActive()){ //modify me
			this.mobility += mobilityModifier;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.mobility += mobilityModifier;
			}
		}
	}

	this.spaceIncreasePower = function(powerBoost){
		var mobilityModifier = -1 * powerBoost;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			mobilityModifier = -1 *mobilityModifier;
		}

		if(this.isActive()){ //modify me
			this.mobility += mobilityModifier;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.mobility += mobilityModifier;
			}
		}
	}

	//need to bind funtions so they know what 'this' is.
	//num times is because rage can call void...but void can call rage....
	//can make an infinite loop. need to stop it somehow. the effect is why void/rage players can be insanely strong at random.
	this.voidIncreasePower = function(powerBoost,numTimes){
		//void does nothing innately. random stat modifications.
		numTimes ++;
		if(numTimes > 10){
			console.log("rage/void infinite loop. just fucking stop. " + this.session.session_id)
			return; //do nothing. just fucking stop.
		}
		var statIncreases = [this.bloodIncreasePower.bind(this,powerBoost),this.rageIncreasePower.bind(this,powerBoost,numTimes),this.heartIncreasePower.bind(this,powerBoost),this.breathIncreasePower.bind(this,powerBoost),this.spaceIncreasePower.bind(this,powerBoost),this.lifeIncreasePower.bind(this,powerBoost),this.doomIncreasePower.bind(this,powerBoost),this.timeIncreasePower.bind(this,powerBoost),this.mindIncreasePower.bind(this,powerBoost),this.lightIncreasePower.bind(this,powerBoost),this.hopeIncreasePower.bind(this,powerBoost)];
		getRandomElementFromArray(statIncreases)();

		//manicInsomniac has a very good point that in LOSS void players can slow grimDarkness but not heal it.
		var mobilityModifier = -1 * powerBoost;
		if(this.class_name == "Prince" || this.class_name == "Bard"){
			mobilityModifier = -1 *mobilityModifier;
		}

		if(this.isActive()){ //modify me
			this.corruptionLevelOther += mobilityModifier;
		}else{  //modify others.
			for(var i = 0; i<this.session.players.length; i++){
				var player = this.session.players[i];
				player.corruptionLevelOther += mobilityModifier;
			}
		}
	}

	//everything but space and time, they are exempt because EVER session has them.
	//you could argue they are baked into things.
	this.aspectIncreasePower = function(powerBoost){
		if(this.aspect == "Light"){
			this.lightIncreasePower(powerBoost);
		}else if(this.aspect =="Doom"){
			this.doomIncreasePower(powerBoost);
		}else if(this.aspect =="Blood"){
			this.bloodIncreasePower(powerBoost);
		}else if(this.aspect =="Rage"){
			this.rageIncreasePower(powerBoost);
		}else if(this.aspect =="Heart"){
			this.heartIncreasePower(powerBoost);
		}else if(this.aspect =="Breath"){
			this.breathIncreasePower(powerBoost);
		}else if(this.aspect =="Hope"){
			this.hopeIncreasePower(powerBoost);
		}else if(this.aspect =="Mind"){
			this.mindIncreasePower(powerBoost);
		}else if(this.aspect =="Life"){
			this.lifeIncreasePower(powerBoost);
		}else if(this.aspect =="Void"){
			this.voidIncreasePower(powerBoost);
		}else if(this.aspect =="Time"){
			this.timeIncreasePower(powerBoost);
		}else if(this.aspect =="Space"){
			this.spaceIncreasePower(powerBoost);
		}
	}

	this.increasePower = function(){
		if(Math.seededRandom() >.9){
			this.leveledTheHellUp = true; //that multiple of ten thing is bullshit.
		}
		var powerBoost = 1;

		if(this.class_name == "Page"){  //they don't have many quests, but once they get going they are hard to stop.
			powerBoost = powerBoost * 5;
		}

		if(this.aspect == "Hope"){
			powerBoost = powerBoost * 2;
		}

		if(this.godTier){
			powerBoost = powerBoost * 20;  //god tiers are ridiculously strong.
		}

		if(this.denizenDefeated){
			powerBoost = powerBoost * 2; //permanent doubling of stats forever.
		}

		this.power += powerBoost;
		this.aspectIncreasePower(powerBoost);
		//gain a bit of hp, otherwise denizen will never let players fight them if their hp isn't high enough.
		if(this.godTier || Math.seededRandom() >.25){
			this.hp += 10;
			this.currentHP += 10;
		}

	}

	this.shortLand = function(){
		return this.land.match(/\b(\w)/g).join('').toUpperCase();
	}

	this.htmlTitle = function(){
		return getFontColorFromAspect(this.aspect) + this.title() + "</font>"
	}



	this.htmlTitleBasic = function(){
		return getFontColorFromAspect(this.aspect) + this.titleBasic() + "</font>"
	}

	this.htmlTitleHP = function(){
		return getFontColorFromAspect(this.aspect) + this.title() + " (" + Math.round(this.currentHP) + " hp, " + Math.round(this.power) + " power)</font>"
	}

	this.generateBlandRelationships = function(friends){
		for(var i = 0; i<friends.length; i++){
			if(friends[i] != this){  //No, Karkat, you can't be your own Kismesis.
				//one time in a random sim two heirresses decided to kill each other and this was so amazing and canon compliant
				//that it needs to be a thing.
				var r = randomBlandRelationship(friends[i])
				if(this.isTroll && this.bloodColor == "#99004d" && friends[i].isTroll && friends[i].bloodColor == "#99004d"){
					r.value = -20; //biological imperitive to fight for throne.
					this.triggerLevel ++;
					friends[i].triggerLevel ++;
				}
				this.relationships.push(r);
			}
		}
	}

	this.generateRelationships = function(friends){
		for(var i = 0; i<friends.length; i++){
			if(friends[i] != this){  //No, Karkat, you can't be your own Kismesis.
				//one time in a random sim two heirresses decided to kill each other and this was so amazing and canon compliant
				//that it needs to be a thing.
				var r = randomRelationship(friends[i])
				if(this.isTroll && this.bloodColor == "#99004d" && friends[i].isTroll && friends[i].bloodColor == "#99004d"){
					r.value = -20; //biological imperitive to fight for throne.
					this.triggerLevel ++;
					friends[i].triggerLevel ++;
				}
				this.relationships.push(r);
			}else{
				//console.log(this.title() + "Not generating a relationship with: " + friends[i].title());
			}
		}


	}

	this.checkBloodBoost = function(players){
		if(this.aspect == "Blood"){
			for(var i = 0; i<players.length; i++){
				players[i].boostAllRelationships();
			}
		}
	}

	this.nullAllRelationships = function(){
		for(var i = 0; i<this.relationships.length; i++){
			this.relationships[i].value = 0;
			this.relationships[i].saved_type = this.relationships[i].neutral;
		}
	}
	//you like people more
	this.boostAllRelationships = function(){
		for(var i = 0; i<this.relationships.length; i++){
			this.relationships[i].increase();
		}
	}

	this.boostAllRelationshipsBy = function(boost){
		for(var i = 0; i<this.relationships.length; i++){
			this.relationships[i].value += boost;
		}
	}

	//you like people less
	this.damageAllRelationships = function(){
		for(var i = 0; i<this.relationships.length; i++){
			this.relationships[i].decrease();
		}
	}

	this.boostAllRelationshipsWithMeBy = function(boost){
		for(var i = 0; i<this.relationships.length; i++){
			var player = this.relationships[i].target
			var r = this.getRelationshipWith(player)
			if(r){
				r.value += boost;
			}
		}
	}
	//people like you more
	this.boostAllRelationshipsWithMe = function(){
		for(var i = 0; i<this.relationships.length; i++){
			var player = this.relationships[i].target
			var r = this.getRelationshipWith(player)
			if(r){
				r.increase();
			}
		}
	}

	//initial values are between 0 and 100, but the sim will mod those over time.
	//it's up to the thing that calls this to know what a 'good' roll is.
	//couldn't really have implemented this without having authorBot have my back.
	//she'll help me make sure i don't make everything boring implmeenting luck.
	//luck can absolutely be negative. thems the breaks.
	this.rollForLuck = function(){
		return getRandomInt(this.minLuck, this.maxLuck);
	}

	//people like you less
	this.damageAllRelationshipsWithMe = function(){
		for(var i = 0; i<curSessionGlobalVar.players.length; i++){
			var r = this.getRelationshipWith(curSessionGlobalVar.players[i])
			if(r){
				r.decrease();
			}
		}
	}

	this.getAverageRelationshipValue = function(){
		if(this.relationships.length == 0) return 0;
		var ret = 0;
		for(var i = 0; i< this.relationships.length; i++){
			ret += this.relationships[i].value;
		}
		return ret/this.relationships.length;
	}

	//and they need to be alive.
	this.hasDiamond = function(){
		for(var i = 0; i<this.relationships.length; i++){
			if(this.relationships[i].saved_type == this.relationships[i].diamond && !this.relationships[i].target.dead ){
				return this.relationships[i].target;
			}
		}
		return null;
	}

	this.hasDeadDiamond = function(){
		for(var i = 0; i<this.relationships.length; i++){
			if(this.relationships[i].saved_type == this.relationships[i].diamond && this.relationships[i].target.dead ){
				return this.relationships[i].target;
			}
		}
		return null;
	}

	this.hasDeadHeart = function(){
		for(var i = 0; i<this.relationships.length; i++){
			if(this.relationships[i].saved_type == this.relationships[i].heart && this.relationships[i].target.dead ){
				return this.relationships[i].target;
			}
		}
		return null;
	}



	this.getRelationshipWith = function(player){
		for(var i = 0; i<this.relationships.length; i++){
			if(this.relationships[i].target == player){
				return this.relationships[i];
			}
		}
		//this should only be happening if this == player. what is going on here!???
		//ah, was trying to make consequences for interets before making relationships
		//console.log("I am : " + this.title() + " and I couldn't find a relationship with: " + player.title() + " even though I have this many relationships " + this.relationships.length);
	}

	this.getWhoLikesMeBestFromList = function(potentialFriends){
		var bestRelationshipSoFar = this.relationships[0];
		var friend = bestRelationshipSoFar.target;
		for(var i = 0; i<potentialFriends.length; i++){
			var p =  potentialFriends[i];
			if(p!=this){
				var r = p.getRelationshipWith(this);
				if(r && r.value > bestRelationshipSoFar.value){
					bestRelationshipSoFar = r;
					friend = p;
				}
			}
		}
		//can't be my best friend if they're an enemy
		if(bestRelationshipSoFar.value > 0 && potentialFriends.indexOf(friend) != -1){
			return friend;
		}
	}

	this.getWhoLikesMeLeastFromList = function(potentialFriends){
		var worstRelationshipSoFar = this.relationships[0];
		var enemy = worstRelationshipSoFar.target;
		for(var i = 0; i<potentialFriends.length; i++){
			var p =  potentialFriends[i];
			if(p != this){
				var r = p.getRelationshipWith(this);
				if(r && r.value < worstRelationshipSoFar.value){
					worstRelationshipSoFar = r;
					enemy = p;
				}
			}
		}
		//can't be my worst enemy if they're a friend.
		if(worstRelationshipSoFar.value < 0 && potentialFriends.indexOf(enemy) != -1){
			return enemy;
		}
	}

	this.hasRelationshipDrama = function(){
		for(var i = 0; i<this.relationships.length; i++){
			this.relationships[i].type(); //check to see if there is a relationship change.
			if(this.relationships[i].drama){
				return true;
			}
		}
		return false;
	}

	this.getRelationshipDrama = function(){
		var ret = [];
		for(var i = 0; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.drama){
				ret.push(r);
			}
		}
		return ret;
	}

	this.getChatFontColor = function(){
		if(this.isTroll){
			return this.bloodColor;
		}else{
			return getColorFromAspect(this.aspect);
		}
	}

	this.getFriendsFromList = function(potentialFriends){
		var ret = [];
		for(var i = 0; i<potentialFriends.length; i++){
			var p =  potentialFriends[i];
			if(p!=this){
				var r = this.getRelationshipWith(potentialFriends[i]);
				if(r.value > 0){
					ret.push(p);
				}
			}
		}
		return ret;
	}

	this.getEnemiesFromList = function(potentialEnemies){
		var ret = [];
		for(var i = 0; i<potentialEnemies.length; i++){
			var p =  potentialEnemies[i];
			if(p!=this){
				var r = this.getRelationshipWith(potentialEnemies[i]);
				if(r.value < 0){
					ret.push(p);
				}
			}
		}
		return ret;
	}

	this.getLowestRelationshipValue = function(){
		var worstRelationshipSoFar = this.relationships[0];
		for(var i = 1; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.value < worstRelationshipSoFar.value){
				worstRelationshipSoFar = r;
			}
		}
		return worstRelationshipSoFar.value;
	}


	//bulshit stubs that game entities will have be different if crowned. players can't be crowned tho (or can they??? no. they can't.)
	this.getMobility = function(){
		return this.mobility;
	}

	this.getMaxLuck = function(){
		return this.maxLuck;
	}

	this.getMinLuck = function(){
		return this.minLuck;
	}
	this.getFreeWill = function(){
		return this.freeWill;
	}

	this.getHP= function(){
		return this.currentHP;
	}
	this.getPower = function(){
		return this.power;
	}




	this.getHighestRelationshipValue = function(){
		var bestRelationshipSoFar = this.relationships[0];
		for(var i = 1; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.value > bestRelationshipSoFar.value){
				bestRelationshipSoFar = r;
			}
		}
		return bestRelationshipSoFar.value;
	}


	this.getBestFriend = function(){
		var bestRelationshipSoFar = this.relationships[0];
		for(var i = 1; i<this.relationships.length; i++){
			var r = this.relationships[i];
			if(r.value > bestRelationshipSoFar.value){
				bestRelationshipSoFar = r;
			}
		}
		return bestRelationshipSoFar.target;
	}

	this.getBestFriendFromList = function(potentialFriends, debugCallBack){
		var bestRelationshipSoFar = this.relationships[0];
		for(var i = 0; i<potentialFriends.length; i++){
			var p =  potentialFriends[i];
			if(p!=this){
				var r = this.getRelationshipWith(p);
				if(!r){
					//console.log("Couldn't find relationships between " + this.chatHandle + " and " + p.chatHandle);
					//console.log(debugCallBack)
					//console.log(potentialFriends);
					//console.log(this);
				}
				if(r.value > bestRelationshipSoFar.value){
					bestRelationshipSoFar = r;
				}
			}
		}
		//can't be my best friend if they're an enemy
		//I SHOULD NOT HAVE A RELATIONSHIP WITH MYSELF. but if i do, don't return it.
		if(bestRelationshipSoFar.value > 0 && bestRelationshipSoFar.target != this){
			return bestRelationshipSoFar.target;
		}
	}

	this.getWorstEnemyFromList = function(potentialFriends){
		var worstRelationshipSoFar = this.relationships[0];
		for(var i = 0; i<potentialFriends.length; i++){
			var p =  potentialFriends[i];
			if(p!=this){
				var r = this.getRelationshipWith(potentialFriends[i]);
				if(r.value < worstRelationshipSoFar.value){
					worstRelationshipSoFar = r;
				}
			}
		}
		//can't be my worst enemy if they're a friend.
		//I SHOULD NOT HAVE A RELATIONSHIP WITH MYSELF. but if i do, don't return it.
		if(worstRelationshipSoFar.value < 0 && worstRelationshipSoFar.target != this){
			return worstRelationshipSoFar.target;
		}
	}

	this.getFriends = function(){
		var ret = [];
		for(var i = 0; i<this.relationships.length; i++){
			if(this.relationships[i].value > 0){
				ret.push(this.relationships[i].target);
			}
		}
		return ret;
	}

	this.getEnemies = function(){
		var ret = [];
		for(var i = 0; i<this.relationships.length; i++){
			if(this.relationships[i].value < 0){
				ret.push( this.relationships[i].target);
			}
		}
		return ret;
	}

	this.highInit = function(){
		return (this.class_name == "Rogue" || this.class_name == "Knight" || this.class_name == "Maid"|| this.class_name == "Mage"|| this.class_name == "Sylph"|| this.class_name == "Prince")
	}

	this.initializeLuck = function(){
		this.minLuck = getRandomInt(20,40); //middle of the road.
		this.maxLuck = this.minLuck + getRandomInt(1,20);   //max needs to be more than min.
		if(this.aspect == "Light"){
			if(this.highInit()){
				this.maxLuck += 35;
			}else{
				this.maxLuck += -35;
			}
		}else if(this.aspect == "Doom"){
			if(this.highInit()){
				this.minLuck += -35;
			}else{
				this.minLuck += 35;
			}
		}
		if(this.trickster && this.aspect != "Doom"){
			this.minLuck = 11111111111;
			this.maxLuck = 11111111111;
		}

	}

	this.decideTroll = function decideTroll(player){
		if(this.session.getSessionType() == "Human"){
			this.hairColor = getRandomElementFromArray(human_hair_colors);
			return;
		}

		if(this.session.getSessionType() == "Troll" || (this.session.getSessionType() == "Mixed" &&Math.seededRandom() > 0.5) ){
			this.isTroll = true;
			this.hairColor = "#000000"
			this.decideHemoCaste();
			this.decideLusus();
			this.object_to_prototype = this.lusus;
		}else{
			this.hairColor = getRandomElementFromArray(human_hair_colors);
		}
	}

	this.initializeFreeWill = function(){
		this.freeWill = getRandomInt(-25,25);
		if(this.aspect == "Mind"){
			if(this.highInit()){
				this.freeWill += 35;
			}else{
				this.freeWill += -35;
			}
		}else if(this.aspect == "Time"){
			if(this.highInit()){
				this.freeWill += -35;
			}else{
				this.freeWill += 35;
			}
		}
		if(this.trickster && this.aspect != "Doom"){
			this.freeWill = 11111111111;
		}
	}

	this.initializeHP= function(){
		this.hp = getRandomInt(50,300);
		if(this.aspect == "Life"){
			if(this.highInit()){
				this.hp += 50;
			}else{
				this.hp += -50;
			}
		}else if(this.aspect == "Doom"){
			if(this.highInit()){
				this.hp += -50;
			}else{
				this.hp += 50;
			}
		}
		this.currentHP = this.hp;
		if(this.trickster && this.aspect != "Doom"){
			this.currentHP = 11111111111;
			this.hp = 11111111111;
		}
	}

	this.renderSelf = function(){
		var canvasDiv = document.getElementById(this.spriteCanvasID);

		var ctx = canvasDiv.getContext("2d");
		this.clearSelf();
		var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));

		drawSpriteFromScratch(pSpriteBuffer, this);
		copyTmpCanvasToRealCanvasAtPos(canvasDiv, pSpriteBuffer,0,0)
	}

	this.clearSelf = function(){
		var canvasDiv = document.getElementById(this.spriteCanvasID);
		var ctx = canvasDiv.getContext("2d");
		ctx.clearRect(0, 0, canvasDiv.width, canvasDiv.height)
	}

	this.initializeMobility = function(){
		this.mobility = getRandomInt(0,75);
		if(this.aspect == "Breath"){
			if(this.highInit()){
				this.mobility += 35;
			}else{
				this.mobility += -35;
			}
		}else if(this.aspect == "Space"){
			if(this.highInit()){
				this.mobility += -35;
			}else{
				this.mobility += 35;
			}
		}
		if(this.trickster && this.aspect != "Doom"){
			this.mobility = 11111111111;
		}
	}

	this.initializeTriggerLevel = function(){
		this.triggerLevel = getRandomInt(0,2);
		if(this.aspect == "Rage"){
			if(this.highInit()){
				this.triggerLevel += 2;
			}else{
				this.triggerLevel += -2;
			}
		}else if(this.aspect == "Blood"){
			if(this.highInit()){
				this.triggerLevel += -2;
			}else{
				this.triggerLevel += 2;
			}
		}
	}

	//don't recalculate values, but can boost postivily or negatively by an amount. sure.
	this.initializeRelationships = function(){
		var amount = 5;
		if(this.aspect == "Heart"){
			if(this.highInit()){
				this.boostAllRelationshipsBy(amount)
			}else{
				this.boostAllRelationshipsBy(-1 * amount)
			}
		}else if(this.aspect == "Rage"){
			if(this.highInit()){
				this.boostAllRelationshipsWithMeBy(-1* amount);
				this.boostAllRelationshipsBy(-1*amount)
			}else{
				this.boostAllRelationshipsWithMeBy(amount);
				this.boostAllRelationshipsBy(amount)
			}
		}else if(this.aspect == "Blood"){
			if(this.highInit()){
				this.boostAllRelationshipsWithMeBy(amount);
			}else{
				this.boostAllRelationshipsWithMeBy(-1 * amount);
			}
		}

		if(this.trickster && this.aspect != "Doom" && this.aspect != "Heart"){
		for(var k = 0; k <this.relationships.length; k++){
				var r = this.relationships[k];
				r.value = 111111; //EVERYTHIGN IS BETTER!!!!!!!!!!!
				r.saved_type = r.goodBig;
			}
		}

		if(this.robot){
			for(var k = 0; k <this.relationships.length; k++){
					var r = this.relationships[k];
					r.value = 0; //robots are tin cans with no feelings
					r.saved_type = r.neutral;
					r.old_type = r.neutral;
				}
		}
	}

	this.initializePower = function(){
		this.power = 0;
		if(this.aspect == "Hope"){
			if(this.highInit()){
				this.power += 15
			}else{
				this.power += -15;
			}
		}
		if(this.trickster && this.aspect != "Doom"){
			this.power = 11111111111;
		}

		if(this.robot){
			this.power += 100; //robots are superior
		}
	}

	//this seems to NEVER be called for ghosts.  instead of things needed to render, can make this about char creator
	this.toJSON = function(){
		var json = {aspect: this.aspect, class_name: this.class_name, quirk: this.quirk, hair: this.hair,  hairColor: this.hairColor, isTroll: this.isTroll, bloodColor: this.bloodColor, leftHorn: this.leftHorn, rightHorn: this.rightHorn, interest1Category: this.interest1Category, interest2Category: this.interest2Category, interest1: this.interest1, interest2: this.interest2  };
		return json;
	}

	this.toString = function(){
		return (this.class_name+this.aspect).replace(/'/g, '');; //no spaces.
	}



	//void is associated with nothing, and thus can do/be anything.
	this.initializeVoid = function(){
		if(this.aspect == "Void"){

			var amount = 0;
			if(this.highInit()){
				amount += getRandomInt(1,35);
			}else{
				amount += -1 *getRandomInt(1,35);
			}
			var rand =getRandomInt(0,18); //one more than possibilities, can always start with NO boost.
			if(rand == 0){
				this.minLuck += amount;
			}else if(rand == 1){
				this.maxLuck += amount;
			}else if(rand == 2){
				this.freeWill += amount;
			}else if(rand == 3){
				this.hp += amount;
				this.currentHP += amount;
			}else if(rand == 4){
				this.mobility += amount;
			}else if(rand == 5){
				this.power += amount;
			}else if(rand == 6){
				this.boostAllRelationshipsWithMeBy(amount);
			}else if(rand == 7){
				this.boostAllRelationshipsBy(amount)
			}else if(rand == 8){
				this.triggerLevel += amount;
			}else if(rand == 9){
				this.minLuck += -1 * amount;
			}else if(rand == 10){
				this.maxLuck += -1 * amount;
			}else if(rand == 11){
				this.freeWill += -1 * amount;
			}else if(rand == 12){
				this.hp += -1 * amount;
				this.currentHP += -1*amount;
			}else if(rand == 13){
				this.mobility += -1 * amount;
			}else if(rand == 14){
				this.power += -1 * amount;
			}else if(rand == 15){
				this.boostAllRelationshipsWithMeBy(-1 * amount);
			}else if(rand == 16){
				this.boostAllRelationshipsBy(-1 * amount)
			}else if(rand == 17){
				this.triggerLevel += -1 * amount;
			}
			if(this.trickster){
				this.power = 11111111111;
				this.hp = 11111111111;
				this.currentHP = 11111111111;
			}
		}else{

		}
	}


	//if it's part of player json, need to copy it over.
	this.copyFromPlayer = function(replayPlayer){
		console.log("Overriding player from a replay Player. ")
		console.log(replayPlayer)
		this.aspect = replayPlayer.aspect;
		this.class_name = replayPlayer.class_name;
		this.hair = replayPlayer.hair;
		this.hairColor = replayPlayer.hairColor;
		this.isTroll = replayPlayer.isTroll;
		this.bloodColor = replayPlayer.bloodColor;
		this.leftHorn = replayPlayer.leftHorn;
		this.rightHorn = replayPlayer.rightHorn;
		//this.quirk.favoriteNumber = replayPlayer.quirk.favoriteNumber; //get overridden, has to be after initialization.
	}


	this.initialize = function(){
		this.initializeStats();
		this.initializeSprite();
		this.initializeDerivedStuff();  //TODO handle troll derived stuff. like quirk.
	}


	this.initializeDerivedStuff = function(){
		var tmp =getRandomLandFromPlayer(this);
		this.land1 = tmp[0]
		this.land2 = tmp[1];
		this.land = "Land of " + tmp[0] + " and " + tmp[1];
		this.chatHandle = getRandomChatHandle(this.class_name,this.aspect,this.interest1, this.interest2);
		this.mylevels = getLevelArray(this);//make them ahead of time for echeladder graphic

		if(this.isTroll){
			this.quirk = randomTrollSim(this)
			this.triggerLevel ++;//trolls are slightly less stable

		}else{
			this.quirk = randomHumanSim(this);
		}


		this.spriteCanvasID = this.chatHandle+this.id+"spriteCanvas";
		var canvasHTML = "<br><canvas style='display:none' id='" + this.spriteCanvasID+"' width='" +400 + "' height="+300 + "'>  </canvas>";
		$("#playerSprites").append(canvasHTML)
	}

	this.initializeSprite = function(){
		this.sprite = new GameEntity(session, "sprite",null); //unprototyped.
		//minLuck, maxLuck, hp, mobility, triggerLevel, freeWill, power, abscondable, canAbscond, framotifs, grist
		this.sprite.setStats(30,50,50,0,0,0,0,false, false, [],1000);//same as denizen minion, but empty power
		this.sprite.doomed = true
		this.sprite.sprite = true;
	}

	//players can start with any luck, (remember, Vriska started out super unlucky and only got AAAAAAAALL the luck when she hit godtier)
	//make sure session calls this before first tick, cause otherwise won't be initialized by right claspect after easter egg or character creation.
	this.initializeStats = function(){

		this.initializeLuck();
		this.initializeFreeWill();
		this.initializeHP();
		this.initializeMobility();
		this.initializeRelationships();
		this.initializePower();
		this.initializeVoid();
		this.initializeTriggerLevel();
		//reroll goddestiny and sprite as well. luck might have changed.
		var luck = this.rollForLuck();
		if(this.class_name == "Witch" || luck < 10){
			this.object_to_prototype = getRandomElementFromArray(disastor_objects);
			//console.log("disastor")
		}else if(luck > 65){
			this.object_to_prototype = getRandomElementFromArray(fortune_objects);
			//console.log("fortune")
		}
		if(luck>40){
			this.godDestiny =true;
		}
	}


}

function initializePlayers(players,session){
	var rawPlayers =  getRawParameterByName("players");
	var replayPlayers = [];
	if(rawPlayers && session.session_id == getParameterByName("seed")){ //don't override combo players. they'll be saved as "aliens"
		console.log("Getting custom players")
		var uncompressedPlayers = LZString.decompressFromEncodedURIComponent(rawPlayers);
		var json = JSON.parse(uncompressedPlayers);
		for(var i = 0; i<json.length; i++){
			console.log(json[i])
			replayPlayers.push(objToPlayer(json[i]));
		}
	}
	for(var i = 0; i<players.length; i++){
		if(replayPlayers[i]) players[i].copyFromPlayer(replayPlayers[i]); //DOES NOT use MORE PLAYERS THAN SESSION HAS ROOM FOR, BUT AT LEAST WON'T CRASH ON LESS.
		if(players[i].land){ //don't reinit aliens, their stats stay how they were cloned.
			players[i].initialize();
			players[i].guardian.initialize();
			if(replayPlayers[i]){
				players[i].quirk.favoriteNumber = parseInt(replayPlayers[i].quirk.favoriteNumber) //has to be after initialization
				if(players[i].isTroll){
					players[i].quirk.makeTrollQuirk(players[i]); //redo quirk
				}else{
					players[i].quirk.makeHumanQuirk(players[i]);
				}
			}
		}
	}

}

function initializePlayersNoDerived(players,session){
	var rawPlayers =  getRawParameterByName("players");
	var replayPlayers = [];
	if(rawPlayers && session.session_id == getParameterByName("seed")){
		var uncompressedPlayers = LZString.decompressFromEncodedURIComponent(rawPlayers);
		var json = JSON.parse(uncompressedPlayers);
		for(var i = 0; i<json.length; i++){
		replayPlayers.push(objToPlayer(json[i]));
	}
	}
	for(var i = 0; i<players.length; i++){
		if(replayPlayers[i]) players[i].copyFromPlayer(replayPlayers[i]); //DOES NOT use MORE PLAYERS THAN SESSION HAS ROOM FOR, BUT AT LEAST WON'T CRASH ON LESS.
		players[i].initializeStats();
		players[i].initializeSprite();
	}
}

function getColorFromAspect(aspect){
	var color = "";
	if(aspect == "Space"){
		color = "#00ff00";
	}else if(aspect == "Time"){
		color = "#ff0000";
	}else if(aspect == "Breath"){
		color = "#3399ff";
	}else if(aspect == "Doom"){
		color = "#003300";
	}else if(aspect == "Blood"){
		color = "#993300";
	}else if(aspect == "Heart"){
		color = "#ff3399";
	}else if(aspect == "Mind"){
		color = "#3da35a";
	}else if(aspect == "Light"){
		color = "#ff9933";
	}else if(aspect == "Void"){
		color = "#000066";
	}else if(aspect == "Rage"){
		color = "#9900cc";
	}else if(aspect == "Hope"){
		color = "#ffcc66";
	}else if(aspect == "Life"){
		color = "#494132";
	}
	return color;
}

function getShirtColorFromAspect(aspect){
	var color = "";
	if(aspect == "Space"){
		color = "#030303";
	}else if(aspect == "Time"){
		color = "#b70d0e";
	}else if(aspect == "Breath"){
		color = "#0087eb";
	}else if(aspect == "Doom"){
		color = "#204020";
	}else if(aspect == "Blood"){
		color = "#3d190a";
	}else if(aspect == "Heart"){
		color = "#6b0829";
	}else if(aspect == "Mind"){
		color = "#3da35a";
	}else if(aspect == "Light"){
		color = "#ff7f00";
	}else if(aspect == "Void"){
		color = "#000066";
	}else if(aspect == "Rage"){
		color = "#9900cc";
	}else if(aspect == "Hope"){
		color = "#ffe094";
	}else if(aspect == "Life"){
		color = "#ccc4b5";
	}
	return color;
}

function getDarkShirtColorFromAspect(aspect){
	var color = "";
	if(aspect == "Space"){
		color = "#242424";
	}else if(aspect == "Time"){
		color = "#970203";
	}else if(aspect == "Breath"){
		color = "#0070ED";
	}else if(aspect == "Doom"){
		color = "#11200F";
	}else if(aspect == "Blood"){
		color = "#2C1207";
	}else if(aspect == "Heart"){
		color = "#6B0829";
	}else if(aspect == "Mind"){
		color = "#3DA35A";
	}else if(aspect == "Light"){
		color = "#D66E04";
	}else if(aspect == "Void"){
		color = "#02285B";
	}else if(aspect == "Rage"){
		color = "#1E0C47";
	}else if(aspect == "Hope"){
		color = "#E8C15E";
	}else if(aspect == "Life"){
		color = "#CCC4B5";
	}
	return color;
}

function getFontColorFromAspect(aspect){
	return "<font color= '" + getColorFromAspect(aspect) + "'> ";
}

function randomPlayerNoDerived(session, c, a){
	var k = getRandomElementFromArray(prototyping_objects);


	var gd = false;

	var m = getRandomElementFromArray(moons);
	var id = Math.seed;
	var p =  new Player(session,c,a,k,m,gd,id);
	p.decideTroll();
	p.interest1 = getRandomElementFromArray(interests);
	p.interest2 = getRandomElementFromArray(interests);
	p.baby = getRandomInt(1,3)


	p.hair = getRandomInt(1,60);
	//hair color in decideTroll.
	p.leftHorn =  getRandomInt(1,46);
	p.rightHorn = p.leftHorn;
	if(Math.seededRandom() > .7 ){ //preference for symmetry
			p.rightHorn = getRandomInt(1,46);
	}
	p.initializeStats();
	p.initializeSprite();


	return p;

}

function randomPlayerWithClaspect(session, c,a){
	//console.log("random player");

	var k = getRandomElementFromArray(prototyping_objects);


	var gd = false;

	var m = getRandomElementFromArray(moons);
	var id = Math.seed;
	var p =  new Player(session,c,a,k,m,gd,id);
	p.decideTroll();
	p.interest1 = getRandomElementFromArray(interests);
	p.interest2 = getRandomElementFromArray(interests);
	p.initialize();

	//no longer any randomness directly in player class. don't want to eat seeds if i don't have to.
	p.baby = getRandomInt(1,3)


	p.hair = getRandomInt(1,60); //hair color in decide troll
	p.leftHorn =  getRandomInt(1,46);
	p.rightHorn = p.leftHorn;
	if(Math.seededRandom() > .7 ){ //preference for symmetry
			p.rightHorn = getRandomInt(1,46);
	}


	return p;

}
function randomPlayer(session){
	//remove class AND aspect from available
	var c = getRandomElementFromArray(available_classes);
	removeFromArray(c, available_classes);
	var a = getRandomElementFromArray(available_aspects);
	removeFromArray(a, available_aspects);
	return randomPlayerWithClaspect(session,c,a);

}

function randomPlayerWithoutRemoving(session){
	//remove class AND aspect from available
	var c = getRandomElementFromArray(available_classes);
	//removeFromArray(c, available_classes);
	var a = getRandomElementFromArray(available_aspects);
	//removeFromArray(a, available_aspects);
	return randomPlayerWithClaspect(session,c,a);

}

function randomSpacePlayer(session){
	//remove class from available
	var c = getRandomElementFromArray(available_classes);
	removeFromArray(c, available_classes);
	var a = required_aspects[0];
	return randomPlayerWithClaspect(session,c,a);
}

function randomTimePlayer(session){
	//remove class from available
	var c = getRandomElementFromArray(available_classes);
	removeFromArray(c, available_classes);
	var a = required_aspects[1];
	return randomPlayerWithClaspect(session,c,a);
}

function findAspectPlayer(playerList, aspect){
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.aspect == aspect){
			//console.log("Found " + aspect + " player");
			return p;
		}
	}
}

function findAllAspectPlayers(playerList, aspect){
	var ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.aspect == aspect){
			//console.log("Found " + aspect + " player");
			ret.push(p)
		}
	}
	return ret;
}


function getLeader(playerList){
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.leader){
			return p;
		}
	}
}

//in combo sessions, mibht be more than one rage player, for example.
function findClaspectPlayer(playerList, class_name, aspect){
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.class_name == class_name && p.aspect == aspect){
			//console.log("Found " + class_name + " player");
			return p;
		}
	}
}


function findClassPlayer(playerList, class_name){
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.class_name == class_name){
			//console.log("Found " + class_name + " player");
			return p;
		}
	}
}

function findStrongestPlayer(playerList){
	var strongest = playerList[0];

	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.power > strongest.power){
			strongest = p;
		}
	}
	return strongest;
}

function findDeadPlayers(playerList){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.dead){
			ret.push(p);
		}
	}
	return ret;
}

function findDoomedPlayers(playerList){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.doomed){
			ret.push(p);
		}
	}
	return ret;
}

function findLivingPlayers(playerList){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(!p.dead){
			ret.push(p);
		}
	}
	return ret;
}

function getPartyPower(party){
	var ret = 0;
	for(var i = 0; i<party.length; i++){
		ret += party[i].power;
	}
	return ret;
}

function getPlayersTitlesNoHTML(playerList){
	//console.log(playerList)
	if(playerList.length == 0){
		return "";
	}
		var ret = playerList[0].title();
		for(var i = 1; i<playerList.length; i++){
			ret += " and " + playerList[i].title();
		}
		return ret;
}

function getPlayersTitles(playerList){
	//console.log(playerList)
	if(playerList.length == 0){
		return "";
	}
		var ret = playerList[0].htmlTitle();
		for(var i = 1; i<playerList.length; i++){
			ret += " and " + playerList[i].htmlTitle();
		}
		return ret;
}

function partyRollForLuck(players){
	var ret = 0;
	for(var i = 0; i<players.length; i++){
		ret += players[i].rollForLuck();
	}
	return ret/players.length;
}

function getPlayersTitlesBasic(playerList){
	if(playerList.length == 0){
		return "";
	}
		var ret = playerList[0].htmlTitleBasic();
		for(var i = 1; i<playerList.length; i++){
			ret += " and " + playerList[i].htmlTitleBasic();
		}
		return ret;
	}

function findPlayersWithDreamSelves(playerList){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.dreamSelf && !p.isDreamSelf){
			ret.push(p);
		}
	}
	return ret;
}

function findPlayersWithoutDreamSelves(playerList){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(!p.dreamSelf || p.isDreamSelf){ //if you ARE your dream self, then when you go to sleep....
			ret.push(p);
		}
	}
	return ret;
}


//don't override existing source
function setEctobiologicalSource(playerList,source){
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		var g  = p.guardian; //not doing this caused a bug in session 149309 and probably many, many others.
		if(p.ectoBiologicalSource == null){
			p.ectoBiologicalSource = source;
			g.ectoBiologicalSource = source;
		}
	}
}


function findPlayersWithoutEctobiologicalSource(playerList){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		if(p.ectoBiologicalSource == null){
			ret.push(p);
		}
	}
	return ret;
}

//deeper than a snapshot, for yellowyard aliens
//have to treat properties that are objects differently. luckily i think those are only player and relationships.
function clonePlayer(player, session, isGuardian){
	var clone = new Player();
	for(var propertyName in player) {
		if(propertyName == "guardian"){
			if(!isGuardian){ //no infinite recursion, plz
				clone.guardian = clonePlayer(player.guardian, session, true);
				clone.guardian.guardian = clone;
		}
	}else if(propertyName == "relationships"){
		clone.relationships = cloneRelationshipsStopgap(player.relationships); //won't actually work, but will let me actually clone the relationships later without modifying originals
	}else{
				clone[propertyName] = player[propertyName]
	}
	}
	return clone;
}

function findPlayersFromSessionWithId(playerList, source){
	ret = [];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i];
		//if it' snull, you could be from here, but not yet ectoborn
		if(p.ectoBiologicalSource == source || p.ectoBiologicalSource == null){
			ret.push(p);
		}
	}
	return ret;
}

function findBadPrototyping(playerList){
	for(var i= 0; i<playerList.length; i++){
		if(playerList[i].object_to_prototype.power >= 200){
			return (playerList[i].object_to_prototype.htmlTitle());
		}
	}
}

function findHighestMobilityPlayer(playerList){
	var ret = playerList[0];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i]
		if(p.mobility > ret.mobility){
			ret = p;
		}
	}
	return ret;
}

function findLowestMobilityPlayer(playerList){
	var ret = playerList[0];
	for(var i= 0; i<playerList.length; i++){
		var p = playerList[i]
		if(p.mobility < ret.mobility){
			ret = p;
		}
	}
	return ret;
}

function findGoodPrototyping(playerList){
	for(var i= 0; i<playerList.length; i++){
		if(playerList[i].object_to_prototype.illegal ==true){
			console.log("found good")
			return (playerList[i].object_to_prototype.htmlTitle());
		}
	}
}

function getGuardiansForPlayers(playerList){
	var tmp = [];
	for(var i= 0; i<playerList.length; i++){
		var g = playerList[i].guardian;
		tmp.push(g);
	}
	return tmp;
}

function sortPlayersByFreeWill(players){
	return players.sort(compareFreeWill)
}

function compareFreeWill(a,b) {
  return b.freeWill - a.freeWill;
}

function getAverageMinLuck(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].minLuck;
	}
	return  Math.round(ret/players.length);
}

function getAverageMaxLuck(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].maxLuck;
	}
	return  Math.round(ret/players.length);
}

function getAverageTriggerLevel(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].triggerLevel;
	}
	return  Math.round(ret/players.length);
}

function getAverageHP(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].hp;
	}
	return  Math.round(ret/players.length);
}

function getAverageMobility(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].mobility;
	}
	return  Math.round(ret/players.length);
}

function getAverageRelationshipValue(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].getAverageRelationshipValue();
	}
	return Math.round(ret/players.length);
}

function getAveragePower(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].power;
	}
	return  Math.round(ret/players.length);
}

function getPVPQuip(deadPlayer, victor, deadRole, victorRole){
	if(victor.getPVPModifier(victorRole) > deadPlayer.getPVPModifier(deadRole)){
		return "Which is pretty much how you expected things to go down between a " + deadPlayer.class_name + " and a " + victor.class_name + " in that exact situation. ";
	}else{
		return "Which is weird because you would expect the " + deadPlayer.class_name + " to have a clear advantage. Guess echeladder rank really does matter?";
	}
}

function getAverageFreeWill(players){
	if(players.length == 0) return 0;
	var ret = 0;
	for(var i = 0; i< players.length; i++){
		ret += players[i].freeWill;
	}
	return  Math.round(ret/players.length);
}
