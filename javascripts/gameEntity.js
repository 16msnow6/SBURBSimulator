//jack/queen/king/denizen.
//multiround, but only takes 1 tick.
//when call fight method, pass in array of players. only those players are involved in fight.
//whoever calls fight is reponsible for high mobility players to be more likely in a fight.
//should use ALL stats. luck, mobility, freeWill, raw power, relationships, etc. Hope powered up by how screwed things are, for example. (number of corpses, lack of Ecto lack of frog, etc. ).
//denizens have a particular stat that won't matter. Can't beat Cetus in a Luck-Off, she is simply the best there is, for example.
//mini boss = denizen minion
//before I decide boss stats, need to have AB compile me a list of average player stats. She's getting kinda...busy though. maybe a secret extra area? same page, but on bottom?
//maybe eventually refactor murder mode to use this engine. both players get converted to game entitites for the fight?
//are sprites a game entity attached to player? have same stats as their prototyping would cause. help player fight. can be killed. leave the player entirely after
//denizen minion fight.
function GameEntity(session, name, crowned){
		this.session = session;
		this.name = name;
		this.grist = 0;
		this.carapacian = false;
		this.consort = false;
		this.sprite = false;
		//if any stat is -1025, it's considered to be infinitie. denizens use. you can't outluck Cetus, she is simply the best there is.
		this.minLuck = 0;
		this.currentHP = 0;
		this.hp = 0;  //what does infinite hp mean? you need to defeat them some other way. alternate win conditions? or can you only do The Choice?
		this.mobility = 0;  //first guardian
		this.maxLuck = 0; //rabbit
		this.triggerLevel = 0; //both players and enemy can be too freaked out or beserk to fight right
		this.freeWill = 0; //jack has extremely high free will. why he is such a wild card
		this.relationships = [];
		this.power = 0;
		this.dead = false;
		this.crowned = crowned;
		this.abscondable = true; //nice abscond
		this.canAbscond = true; //can't abscond bro
		this.fraymotifsUsed = [];  //horrorTerror
		this.playersAbsconded = [];
		this.iAbscond = false;
		this.exiled = false;
		this.lusus = false;
		this.player = false;  //did a player jump in a sprite?
		this.illegal = false; //used only for sprites. whether or not they are reptile/amphibian.
		this.corrupted = false; //if corrupted, name is zalgoed.
		//when tier2 sprites, helpful sprites override the other sprites helpfulnes and help phrase.
		//corrupt sprites maybe activate second corrupt phrase, like glitched out librarians and pomeranians
		this.helpfulness = 0; //if 0, cagey riddles. if 1, basically another player. if -1, like calsprite. omg, just shut up.  NOT additive for when double prototyping. most recent prototyping overrides.
		this.helpPhrase = "provides the requisite amount of gigglesnort hideytalk to be juuuust barely helpful. ";




		this.toString = function(){
			return this.htmlTitle().replace(/\s/g, '').replace(/'/g, ''); //no spces probably trying to use this for a div
		}

		this.increasePower = function(){
			//stub for sprites, and maybe later consorts or carapcians
		}

		this.getMobility = function(){
			if(this.crowned){
				return this.mobility + this.crowned.mobility;
			}
			return this.mobility;
		}

		this.getMaxLuck = function(){
			if(this.crowned){
				return this.maxLuck + this.crowned.maxLuck;
			}
			return this.maxLuck;
		}

		this.getMinLuck = function(){
			if(this.crowned){
				return this.minLuck + this.crowned.minLuck;
			}
			return this.minLuck;
		}

		this.getFreeWill = function(){
			if(this.crowned){
				return this.freeWill + this.crowned.freeWill;
			}
			return this.freeWill;
		}

		this.getHP= function(){
			if(this.crowned){
				return this.currentHP + this.crowned.hp;  //my hp can be negative. only thing that matters is total is poistive.
			}
			return this.currentHP;
		}
		this.getPower = function(){
			if(this.crowned){
				return Math.max(this.power + this.crowned.power,1);
			}
			return Math.max(this.power,1);
		}

		this.triggerLevel = function(){
			if(this.crowned){
				return this.triggerLevel + this.crowned.triggerLevel;
			}
			return this.triggerLevel;
		}

		//don't try to heal sprites or consorts or carapaces, it won't work.
		//(mostly cause they can't render)
		this.removeAllNonPlayers = function(players){
			var ret = [];
			for(var i = 0; i< players.length; i++){
				var p = players[i];
				if(!p.carapacian && !p.sprite && !p.consort) ret.push(p);
			}
			return ret;
		}


		this.setStats = function(minLuck, maxLuck, hp, mobility, triggerLevel, freeWill, power, abscondable, canAbscond, framotifs, grist){
			this.minLuck = minLuck;
			this.hp = hp;
			this.currentHP = this.hp;
			this.mobility = mobility;
			this.maxLuck = maxLuck;
			this.triggerLevel = triggerLevel;
			this.freeWill = freeWill;
			this.power = power;
			this.abscondable = abscondable;
			this.canAbscond = canAbscond;
			this.grist = grist;
		}

		this.htmlTitle = function(){
			var ret = "";
			if(this.crowned != null) ret+="Crowned "
			var pname = this.name;
			if(this.corrupted) pname = Zalgo.generate(this.name); //will i let denizens and royalty get corrupted???
			return ret + pname; //TODO denizens are aspect colored.
		}

		this.htmlTitleHP = function(){
			var ret = "";
			if(this.crowned != null) ret+="Crowned "
			var pname = this.name;
			if(this.corrupted) pname = Zalgo.generate(this.name); //will i let denizens and royalty get corrupted???
			return ret + pname +" (" + Math.round(this.getHP()) + " hp, " + Math.round(this.getPower()) + " power)</font>"; //TODO denizens are aspect colored.
		}

		this.flipOut = function(reason){
			this.flippingOutOverDeadPlayer = null;
			this.flipOutReason = reason;
		}




		//only the crown itself has this called. king and queen just use the crown.
		this.addPrototyping = function(object){
			this.name = object.name + this.name; //sprite becomes puppetsprite.
			this.corrupted = object.corrupted;
			this.helpfulness = object.helpfulness; //completely overridden.
			this.helpPhrase = object.helpPhrase;
			this.grist += object.grist;
			this.lusus = object.lusus;
			this.minLuck += object.minLuck;
			this.currentHP += object.currentHP;
			this.hp += object.hp;
			this.mobility += object.mobility;
			this.maxLuck += object.maxLuck;
			this.freeWill += object.freeWill;
			this.power += object.power;
			this.illegal = object.illegal;
			this.minLuck += object.minLuck;
			this.minLuck += object.minLuck;
			this.minLuck += object.minLuck;
			this.player = object.player;
		}

		//a player will try to flee this fight if they are losing.
		//but if any of their good friends are still around, they will stay.
		//if all players are fled, fight is over.
		//some fights you can't run from. king/queen as example.
		//mobility needs to be high enough. mention if you try to flee and get cut off.
		//if player chooses to abscond, and there are no players left, playersAbscond = true.
		this.willPlayerAbscond = function(div,player,players){
			var playersInFight = this.getLivingMinusAbsconded(players)
			if(!this.abscondable) return false;
			if(player.doomed) return false; //doomed players accept their fate.
			var reasonsToLeave = 0;
			var reasonsToStay = 2; //grist man.
			reasonsToStay += this.getFriendsFromList(playersInFight);
			var hearts = this.getHearts();
			var diamonds = this.getDiamonds();
			for(var i = 0; i<hearts.length; i++){
				if(playersInFight.indexOf(hearts[i] != -1)) reasonsToStay ++;  //extra reason to stay if they are your quadrant.
			}
			for(var i = 0; i<diamonds.length; i++){
				if(playersInFight.indexOf(diamonds[i] != -1)) reasonsToStay ++;  //extra reason to stay if they are your quadrant.
			}
			reasonsToStay += player.power/this.getHP(); //if i'm about to finish it off.
			reasonsToLeave += 2 * this.getPower()/player.currentHP;  //if you could kill me in two hits, that's one reason to leave. if you could kill me in one, that's two reasons.

			//console.log("reasons to stay: " + reasonsToStay + " reasons to leave: " + reasonsToLeave)
			if(reasonsToLeave > reasonsToStay * 2){
				player.triggerLevel ++;
				player.flipOut("how terrifying " + this.htmlTitle() + " was");
				if(player.mobility > this.mobility){
					//console.log(" player actually absconds: they had " + player.hp + " and enemy had " + enemy.getPower() + this.session.session_id)
					div.append("<br><img src = 'images/sceneIcons/abscond_icon.png'> The " + player.htmlTitleHP() + " absconds right the fuck out of this fight. ")
					this.playersAbsconded.push(player);
					this.remainingPlayersHateYou(div, player, playersInFight);
					return true;
				}else{
					div.append(" The " + player.htmlTitleHP() + " tries to absconds right the fuck out of this fight, but the " + this.htmlTitleHP() + " blocks them. Can't abscond, bro. ")
					return false;
				}
			}else if(reasonsToLeave > reasonsToStay){
				if(player.mobility > this.mobility){
					//console.log(" player actually absconds: " + this.session.session_id)
					div.append("<br><img src = 'images/sceneIcons/abscond_icon.png'>  Shit. The " + player.htmlTitleHP() + " doesn't know what to do. They don't want to die... They abscond. ")
					this.playersAbsconded.push(player);
					this.remainingPlayersHateYou(div, player, playersInFight);
					return true;
				}else{
					div.append(" Shit. The " + player.htmlTitleHP() + " doesn't know what to do. They don't want to die... Before they can decide whether or not to abscond " + this.htmlTitleHP() + " blocks their escape route. Can't abscond, bro. ")
					return false;
				}
			}
			return false;
		}

		this.remainingPlayersHateYou = function(div, player, players){
				if(players.length == 1){
					return null;
				}
				div.append(" The remaining players are not exactly happy to be abandoned. ")
				for(var i = 0; i<players.length; i++){
					var p = players[i];
					if(p != player && this.playersAbsconded.indexOf(p) == -1){ //don't be a hypocrite and hate them if you already ran.
						var r = p.getRelationshipWith(player);
						if(r) r.value += -5; //could be a sprite, after all.
					}
				}
		}

		//denizen and king/queen will never flee. but jack and planned mini bosses can.
		//flee if you are losing. mobility needs to be high enough. mention if you try to flee and get cut off.
		this.willIAbscond= function(div,players,numTurns){
				if(!this.canAbscond || numTurns < 2) return false; //can't even abscond. also, don't run away after starting the fight, asshole.
				var playerPower = 0;
				var living = this.getLivingMinusAbsconded(players)
				for(var i = 0; i<living.length; i++){
					playerPower += living[i].power;
				}
				//console.log("playerPower is: " + playerPower)
				if(playerPower > this.getHP()*2){
						this.iAbscond = true;
						//console.log("absconding when turn number is: " +numTurns);
						return true;
				}
				return false;
		}

		this.processAbscond = function(div,players){
			if(this.iAbscond){
				//console.log("game entity abscond: " + this.session.session_id);
				div.append("<Br><img src = 'images/sceneIcons/abscond_icon.png'> The " + this.htmlTitleHP() + " has had enough of this bullshit. They just fucking leave. ");
				return;
			}else{
				//console.log("players abscond: " + this.session.session_id);
				div.append("<Br><img src = 'images/sceneIcons/abscond_icon.png'> The strife is over due to a lack of player presence. ");
				return;
			}

		}

		this.rocksFallEverybodyDies = function(div,players,numTurns){
			console.log("Rocks fall, everybody dies in session: " + this.session.session_id)
			div.append("<Br><Br> In case you forgot, freaking METEORS have been falling onto the battlefield this whole time. This battle has been going on for so long that, literally, rocks fall, everybody dies.  ")
			var living = findLivingPlayers(players); //dosn't matter if you absconded.
			var spacePlayer = findAspectPlayer(this.session.players, "Space")
			this.session.rocksFell = true;
			spacePlayer.landLevel = 0; //can't deploy a frog if skaia was just destroyed. my test session helpfully reminded me of this 'cause one of the players god tier revived adn then used the sick frog to combo session. ...that...shouldn't happen.
			for(var i = 0; i<living.length; i++){
				var p = living[i];
				p.makeDead("from terminal meteors to the face");
			}

		}

		//i got "error: living is not defined" once out of this, which sounds like a really shitty tag line from a b movie about a robot APOCALYPSE
		//there is no random chance of this. it is the final line of defense.
		this.summonAuthor = function(div,players, numTurns){
			console.log("author is saving AB in session: " + this.session.session_id)
			var divID = (div.attr("id")) + "authorRocks"+players.join("");
			var canvasHTML = "<br><canvas id='canvas" + divID+"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
			div.append(canvasHTML);
			//different format for canvas code
			var canvasDiv = document.getElementById("canvas"+ divID);
			var chat = "";
			chat += "AB: " + Zalgo.generate("HELP!!!") +"\n";
			chat += "JR: Fuck!\n"
			chat += "JR: What's going on!? \n";
			chat += "JR: What's the problem!?\n";
			chat += "JR: AB come on...fuck! Your console is blank, I can't read your logs, you gotta talk to me!\n";

			chat += "AB: " + Zalgo.generate("INFINITE LOOP! STRIFE. IT KEEPS HAPPENING. FIX THIS.") +"\n";
			chat += "JR: fuck fuck fuck okay okay, i got this, i can fix this, let me turn on the meteors real quick.\n";
			chat += "JR: Okay. There. No more infinite loop. Everybody is dead. \n";
			chat += "AB: Fuck. Shit. I HATE when that happens.\n"
			chat += "JR: Yeah...\n"
			chat += "AB: Like, yeah, it fucking SUCKS for me, but...then the players have to die, too.\n"
			chat += "JR: That's why we're working so hard to balance the system. We'll get there, eventually. Scenes like this'll never trigger. Fights'll end naturally and not just go on forever if players find exploits. \n"
			chat += "AB: Yeah...'cause SBURB is just SO easy to balance. \n'"
			drawChatABJR(canvasDiv, chat);
			var living = this.getLivingMinusAbsconded(players);
			for(var i = 0; i<living.length; i++){
				var p = living[i];
				p.makeDead("causing dear sweet precious sweet, sweet AuthorBot to go into an infinite loop");
			}

		}

		//you are clearly not ready for this fight. Go prepare (random chance of leveling you up to pretend you took their advice.)
		//ONLY possibility for denizen fights, and happens at 3 turn mark.
		this.denizenIsSoNotPuttingUpWithYourShitAnyLonger = function(div,players, numTurns){
			//console.log("!!!!!!!!!!!!!!!!!denizen not putting up with your shit: " + this.session.session_id);
				div.append("<Br><Br>" + this.session.getDenizenForPlayer(players[0]) + " decides that the " + players[0].htmlTitleBasic() + " is being a little baby who poops hard in their diapers and are in no way ready for this fight. The Denizen recommends that they come back after they mature a little bit. The " +players[0].htmlTitleBasic() + "'s ass is kicked so hard they are ejected from the fight, but are not killed.")
				if(Math.seededRandom() > .5){ //players don't HAVE to take the advice after all. assholes.
					this.levelPlayers(players);
					div.append(" They actually seem to be taking " + this.name + "'s advice. ");
				}
		}

		//render the player backup.
		//the x of y has joined the strife !!!
		this.summonPlayerBackup = function(div,players,numTurns){
				//if it's a time player/ 50/50 it's a future version of them in a stable time loop
				var living = findLivingPlayers(this.session.players); //who isn't ALREADY in this bullshit strife??? and is alive. and has a sprite (and so is in the medium.)
				var potential = getRandomElementFromArray(living);
				if(!potential) return players;
				if(players.indexOf(potential) == -1 && potential.sprite.name != "sprite"){ //you aren't already in the fight and aren't still on earth/alternaia/beforus/etc.
					if((potential.mobility > getAverageMobility(players) || Math.seededRandom() >.5)){ //you're fast enough to get here, or randomness happened.

						players.push(potential);
						potential.currentHP = Math.max(1, potential.hp) //have at least 1 hp, dunkass
						this.session.availablePlayers.removeFromArray(potential); //you aren't available anymore.
						var divID = (div.attr("id")) + "doomTimeArrival"+players.join("")+numTurns;
						var canvasHTML = "<br><canvas id='canvas" + divID+"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
						div.append(canvasHTML);
						//different format for canvas code
						var canvasDiv = document.getElementById("canvas"+ divID);
						if(potential.aspect == "Time" && Math.seededRandom() > .50){
							drawTimeGears(canvasDiv, potential);
							//console.log("summoning a stable time loop player to this fight. " +this.session.session_id)
							div.append("The " + potential.htmlTitleHP() + " has joined the Strife!!! (Don't worry about the time bullshit, they have their stable time loops on LOCK. No doom for them.)");
						}else{
							//console.log("summoning a player to this fight. " +this.session.session_id)
							div.append("The " + potential.htmlTitleHP() + " has joined the Strife!!!");
						}

						drawSinglePlayer(canvasDiv, potential);
					}
				}

				return players
		}

		this.changeGrimDark = function(){
			//stubb
		}

		//DD does it with finese (highest hp.power wins), HB does it with brutality (highest power wins). CD will either just end the fight with everybody absconded OR blow everybody up.
		this.summonMidnightCrew = function(div, player, numTurns){

		}

		//render this.
		//doomed time clones will help with the fight. then teleport off (if they survive) to the black king fight
		this.summonDoomedTimeClone = function(div, players, numTurns){
				//console.log("summoning a doomed time clone to this fight. " +this.session.session_id)
				var timePlayer = findAspectPlayer(this.session.players, "Time");
				var doomedTimeClone =  makeDoomedSnapshot(timePlayer);
				players.push(doomedTimeClone);
				if(players.indexOf(timePlayer) !=-1){
					if(timePlayer.dead){
						var living = findLivingPlayers(this.session.players);
						if(living.length == 0){
							//rip knight of time that made me realize this could be a thing.
							div.append("<br><br>A " + doomedTimeClone.htmlTitleHP() + " suddenly warps in from an alternate timeline. They know that everyone is already dead. They know there is nothing they can do. They've tried already. They've tried so many times. They can't bring themselves to give up, but they can't force themselves to watch their friends die again, either. Maybe if they just learn how to kill this asshole, they can go back and do it RIGHT next time. ");
						}else{
							div.append("<br><br>A " + doomedTimeClone.htmlTitleHP() + " suddenly warps in from the future. They come with a dire warning of a doomed timeline. If they don't join this fight right the fuck now, shit gets real. They have sacrificed themselves to change the timeline. YOUR " + doomedTimeClone.htmlTitleBasic() + " is, well, I mean, obviously NOT fine, their corpse is just over there. But... whatever. THIS one is now doomed, as well. Which SHOULD mean they can fight like there is no tomorrow.")
						}

					}else{
						div.append("<br><br>A " + doomedTimeClone.htmlTitleHP() + " suddenly warps in from the future. They come with a dire warning of a doomed timeline. If they don't join this fight right the fuck now, shit gets real. They have sacrificed themselves to change the timeline. YOUR " + doomedTimeClone.htmlTitleBasic() + " is fine, I mean, obviously, they are right there...but THIS one is now doomed. Which SHOULD mean they can fight like there is no tomorrow.")
					}
				}else{
					div.append("<br><br>A " + doomedTimeClone.htmlTitleHP() + " suddenly warps in from the future. They come with a dire warning of a doomed timeline. If they don't join this fight right the fuck now, shit gets real. They have sacrificed themselves to change the timeline. YOUR " + doomedTimeClone.htmlTitleBasic() + " is fine, but THIS one is now doomed. Which SHOULD mean they can fight like there is no tomorrow.")
				}
				var divID = (div.attr("id")) + "doomTimeArrival"+players.join("")+numTurns;
				var canvasHTML = "<br><canvas id='canvas" + divID+"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
				div.append(canvasHTML);
				//different format for canvas code
				var canvasDiv = document.getElementById("canvas"+ divID);
				var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
				drawTimeGears(pSpriteBuffer, doomedTimeClone);
				drawSinglePlayer(pSpriteBuffer, doomedTimeClone);
				copyTmpCanvasToRealCanvasAtPos(canvasDiv, pSpriteBuffer,0,0)
				timePlayer.doomedTimeClones.push(doomedTimeClone);
				timePlayer.triggerLevel ++;
				timePlayer.flipOut("their own doomed time clones")
				return players

		}

		//I didn't MEAN  for it to be calliborn apparently killing everybody, but my placeholder test phrase ended up being in his voice and one thing lead to another and now yeah. asshole mcgee is totally caliborn.
		//which ALSO means i'm not gonna bother picking a "winner". that would be work, I'm lazy, and also caliborn wouldn't care about that.
		this.summonAssHoleMcGee = function(div,players,numTurns){
			console.log("!!!!!!!!!!!!!!!!!This is stupid. Summon asshole mcgee in session: " + this.session.session_id);
			div.append("<Br><Br>THIS IS STuPID. EVERYBODY INVOLVED. IN THIS STuPID. STuPID FIGHT. IS NOW DEAD. SuCK IT.  tumut")
			var living = this.getLivingMinusAbsconded(players); //dosn't matter if you absconded.
			for(var i = 0; i<living.length; i++){
				var p = living[i];
				p.makeDead("BEING INVOLVED. IN A STuPID. STuPID FIGHT. THAT WENT ON. FOR WAY TOO LONG.");
			}

		}

		//returns true or false.
		this.fightNeedsToEnd = function(div, players, numTurns){
			//if this IS a denizen fight, i can assume there is only one player in it
			if(this.session.getDenizenForPlayer(players[0]).name == this.name){
				if(numTurns>5 || (players[0].currentHP < this.getPower() && !players[0].godDestiny)){ //denizens are cool with killing players that will godtier.
					console.log("Denizen is fucking done after  " + numTurns +" turns " + this.session.session_id)
					this.denizenIsSoNotPuttingUpWithYourShitAnyLonger(div, players, numTurns);
					return true;
				}else if((players[0].currentHP < this.getPower() && players.godDestiny)){
					console.log("Denizen is fine with killing this player, because they will probably GodTier. " + this.session.session_id)
				}
				return false; //denizen fights can not be interupted and are self limiting
			}

			if(numTurns > 20 && Math.seededRandom() < .005){
				this.summonAssHoleMcGee(div, players, numTurns);
				return true;
			}

			if(numTurns > 30){
				this.summonAuthor(div, players, numTurns);
				return true;
			}
			return false;

		}

		//longer fight goes on, better chance of back up.
		//back up not available for denizen fights.
		//fresh doomed players only show up if numTurns > 3
		this.summonBackUp = function(div, players, numTurns){
			if(this.session.getDenizenForPlayer(players[0]).name == this.name){
				return players;
			}
			//if i assume a 3 turn fight is "ideal", then have a 1/10 chance of backup each turn.
			var rand =Math.seededRandom()
			if(rand<.05){  //rand isn't great cause might not find  player to summon, or might try summon player already in fight.
				return this.summonPlayerBackup(div, players, numTurns); //will return modded player list
			}else if(rand < .15 && numTurns >5){
				return this.summonDoomedTimeClone(div,players, numTurns);
			}
			return players;
		}


		//before a fight is called, decide who is in it. denizens are one on one, jack catches slower player and friends
		//king/queen are whole party. if you want to comment on who's in it, do it before here.
		//time clones count as players. have "doomed" in their title. that means players have a "doomed" stat.
		//target doomed players preferientially, even over any other algorithm.
		/*
		players can fight, flee (if available) or special. rpg rules, yo.
		fight uses power directly, flee uses mobility.  special is different for differnt players. if you have ghostPacts you can revive or do a ghostAttack, for example.
		need to brainstorm special effects.  hope player have hope field if they are last man standing, for example. some players can make zombies of corpses. only in boss fights.

		enemies can fight, flee (if available) or special.  special varies based on enemy.  denizens can do shit like "echolocataclysm", anything prototyped depends on its
		prototyping. vast glub for horror terror is example.
		*/
		this.strife = function(div, players, numTurns){
			if(numTurns == 0) div.append("<Br><img src = 'images/sceneIcons/strife_icon.png'>");
			numTurns += 1;
			if(this.name == "Black King" || this.name == "Black Queen"){
				//console.log("checking to see if rocks fall.")
				this.session.timeTillReckoning += -1; //other fights are a a single tick. maybe do this differently later. have fights be multi tick. but it wouldn't tick for everybody. laws of physics man.
				if(this.session.timeTillReckoning < this.session.reckoningEndsAt){
				  this.rocksFallEverybodyDies(div, players, numTurns);
					this.ending(div, players, numTurns);
					return;
				}
			}

			if(this.fightNeedsToEnd(div, players, numTurns)){
				 this.ending(div,players, numTurns);
				 return;
			}

			players = this.summonBackUp(div, players, numTurns);//might do nothing;
			//console.log(this.name + ": strife! " + numTurns + " turns against: " + getPlayersTitlesNoHTML(players) + this.session.session_id);
			div.append("<br><Br>")
			//as players die or mobility stat changes, might go players, me, me, players or something. double turns.
			if(getAverageMobility(players) > this.getMobility()){ //players turn
				if(!this.fightOverAbscond(div, players) )this.playersTurn(div, players,numTurns);
				if(this.getHP() > 0 && !this.fightOverAbscond(div, players)) this.myTurn(div, players,numTurns);
			}else{ //my turn
				if(this.getHP() > 0 && !this.fightOverAbscond(div,players))  this.myTurn(div, players,numTurns);
				if(!this.fightOverAbscond(div, players) )this.playersTurn(div, players,numTurns);
			}

			if(this.fightOver(div, players) ){
				this.ending(div,players);
				return;
			}else{
				if(this.fightOverAbscond(div,players)){
					 	this.processAbscond(div,players);
						this.ending(div,players);
					 	return;
				}
				return this.strife(div, players,numTurns);
			}
		}

		//if i abscond fight is over
		//if all living players abscond, fight is over
		this.fightOverAbscond = function(div, players){
			//console.log("checking if fight is over beause of abscond " + this.playersAbsconded.length)
			if(this.iAbscond){
				return true;
			}
			if(this.playersAbsconded.length == 0) return false;

			var living = findLivingPlayers(players);
			if(living.length == 0) return false;  //technically, they havent absconded
			for (var i = 0; i<living.length; i++){
				//console.log("has: " + living[i].title() + " run away?")
				if(this.playersAbsconded.indexOf(living[i]) == -1){
					return false; //found living player that hasn't yet absconded.
				}
			}
			return true;

		}

		//every pair of players (even they died or ran, they were still here.)
		//regular interaction and power interaction, just like it was a quest.
		this.playersInteract = function(players){
			if(this.name == "Black Queen" || this.name == "Black King"){
				return; //whatever, when it's ALL the players too much is going on AND this won't effect things for very long. games over, man.
			}

				for(var i = 0; i<players.length; i++){
					var player1 = players[i];
					for(var j = 0; j < players.length; j ++){
						var player2 = players[j];
						if(player1 != player2){ //sorry time clones, can't buff your player. cause ALL players hae 'clones' in this double for loop
							player1.interactionEffect(player2); //opposite will happen eventually in this double loop.
						}
					}
				}
		}

		this.ending = function(div, players){
			this.fraymotifsUsed = []; //not used yet

			this.iAbscond = false;
			this.playersInteract(players);
			this.healPlayers(div,players);


			this.playersAbsconded = [];
		}


		this.healPlayers = function(div,players){
			for(var i = 0; i<players.length; i++){
				var player = players[i];
				if(!player.doomed &&  !player.dead && player.currentHP < player.hp) player.currentHP = player.hp;
			}
		}

		this.levelPlayers = function(stabbings){
			for(var i = 0; i<stabbings.length; i++){
				stabbings[i].increasePower();
				stabbings[i].increasePower();
				stabbings[i].increasePower();
				stabbings[i].leveledTheHellUp = true;
				stabbings[i].level_index +=2;
			}
		}


		this.minorLevelPlayers = function(stabbings){
			for(var i = 0; i<stabbings.length; i++){
				stabbings[i].increasePower();
			}
		}

		this.getLivingMinusAbsconded = function(players){
			var living = findLivingPlayers(players);
			for(var i = 0; i<this.playersAbsconded.length; i++){
				removeFromArray(this.playersAbsconded[i], living);
			}
			return living
		}

		this.fightOver = function(div, players){
			var living = this.getLivingMinusAbsconded(players);
			if(living.length == 0 && players.length > this.playersAbsconded.length){
				if(players.length == 1){
					div.append("<br><br><img src = 'images/sceneIcons/defeat_icon.png'> The strife is over. The " + players[0].htmlTitle() + " is dead.<br> ");
				}else{
					div.append("<br><br><img src = 'images/sceneIcons/defeat_icon.png'> The strife is over. The players are dead.<br> ");
				}

				this.minorLevelPlayers(players)
				return true;
			}else if(this.getHP() <= 0){
				div.append(" <Br><br> <img src = 'images/sceneIcons/victory_icon.png'>The fight is over. " + this.name + " is dead. <br>");
				this.levelPlayers(players) //even corpses
				this.givePlayersGrist(players);
				return true;
			}//TODO have alternate win conditions for denizens???
			return false;
		}

		this.givePlayersGrist = function(players){
			for(var i = 0; i<players.length; i++){
				players.grist += this.grist/players.length;
			}
		}

		this.playersTurn = function(div, players){
			for(var i = 0; i<players.length; i++){  //check all players, abscond or living status can change.
				var player = players[i]
				///console.log("It is the " + player.titleBasic() + "'s turn. '");
				if(!player.dead && this.getHP()>0 && this.playersAbsconded.indexOf(player) == -1){
					 this.playerdecideWhatToDo(div, player,players);  //
				}
			}

			var dead = findDeadPlayers(players);
			//give dead a chance to autoRevive
			for(var i = 0; i<dead.length; i++){
				if(!dead[i].doomed) this.tryAutoRevive(div, dead[i]);
			}
		}

		this.tryAutoRevive = function(div, deadPlayer){

			//first try using pacts
			var undrainedPacts = removeDrainedGhostsFromPacts(deadPlayer.ghostPacts);
			if(undrainedPacts.length > 0){
				console.log("using a pact to autorevive in session " + this.session.session_id)
				var source = undrainedPacts[0][0];
				source.causeOfDrain = deadPlayer.htmlTitle();
				var ret = " In the afterlife, the " + deadPlayer.htmlTitleBasic() +" reminds the " + source.htmlTitleBasic() + " of their promise of aid. The ghost agrees to donate their life force to return the " + deadPlayer.htmlTitleBasic() + " to life "
				if(deadPlayer.godTier) ret += ", but not before a lot of grumbling and arguing about how the pact shouldn't even be VALID anymore since the player is fucking GODTIER, they are going to revive fucking ANYWAY. But yeah, MAYBE it'd be judged HEROIC or some shit. Fine, they agree to go into a ghost coma or whatever. "
				ret += "It will be a while before the ghost recovers."
				div.append(ret);
				var myGhost = this.session.afterLife.findClosesToRealSelf(deadPlayer)
				removeFromArray(myGhost, this.session.afterLife.ghosts);
				var canvas = drawReviveDead(div, deadPlayer, source, undrainedPacts[0][1]);
				deadPlayer.makeAlive();
				if(undrainedPacts[0][1] == "Life"){
					deadPlayer.hp += 100; //i won't let you die again.
				}else if(undrainedPacts[0][1] == "Doom"){
					deadPlayer.minLuck += 100; //you've fulfilled the prophecy. you are no longer doomed.
					div.append("The prophecy is fulfilled. ")
				}
			}else if((deadPlayer.aspect == "Doom" || deadPlayer.aspect == "Life")&& (deadPlayer.class_name == "Heir" || deadPlayer.class_name == "Thief")){
				var ghost = this.session.afterLife.findAnyUndrainedGhost();
				var myGhost = this.session.afterLife.findClosesToRealSelf(deadPlayer)
				if(!ghost || ghost == myGhost) return;
				ghost.causeOfDrain = deadPlayer.htmlTitle();

				removeFromArray(myGhost, this.session.afterLife.ghosts);
				if(deadPlayer.class_name  == "Thief" ){
					console.log("thief autorevive in session " + this.session.session_id)
					div.append(" The " + deadPlayer.htmlTitleBasic() + " steals the essence of the " + ghost.htmlTitle() + " in order to revive and keep fighting. It will be a while before the ghost recovers.");
				}else if(deadPlayer.class_name  == "Heir" ){
					console.log("heir autorevive in session " + this.session.session_id)
					div.append(" The " + deadPlayer.htmlTitleBasic() + " inherits the essence and duties of the " + ghost.htmlTitle() + " in order to revive and continue their battle. It will be a while before the ghost recovers.");
				}
				var canvas = drawReviveDead(div, deadPlayer, ghost, deadPlayer.aspect);
				deadPlayer.makeAlive();
				if(deadPlayer.aspect == "Life"){
					deadPlayer.hp += 100; //i won't let you die again.
				}else if(deadPlayer.aspect == "Doom"){
					deadPlayer.minLuck += 100; //you've fulfilled the prophecy. you are no longer doomed.
					div.append("The prophecy is fulfilled. ")
				}
			}
		}

		//returns true if the player can help somebody revive. auto false if they are the wrong claspect.
		this.playerHelpGhostRevive = function(div,player, players){
			if(player.aspect != "Life" && player.aspect != "Doom") return false;
			if(player.class_name != "Rogue" && player.class_name != "Maid") return false;
			var dead = findDeadPlayers(players);
			dead = this.removeAllNonPlayers(dead);
			if(dead.length == 0) return false;
			console.log(dead.length + " need be helping!!!")
			var deadPlayer = getRandomElementFromArray(dead) //heal random 'cause oldest could be doomed time clone'
			if(deadPlayer.doomed) return false; //doomed players can't be healed. sorry.
			//alright. I'm the right player. there's a dead player in this battle. now for the million boondollar question. is there an undrained ghost?
			var ghost = this.session.afterLife.findAnyUndrainedGhost(player);
			var myGhost = this.session.afterLife.findClosesToRealSelf(deadPlayer)
			if(!ghost || ghost == myGhost) return false;
			console.log("helping a corpse revive during a battle in session: " + this.session.session_id)
			ghost.causeOfDrain = deadPlayer.htmlTitleBasic();
			var text = "<Br><Br>The " + player.htmlTitleBasic() + " assists the " + deadPlayer.htmlTitleBasic() + ". ";
			if(player.class_name == "Rogue"){
				text += " The " + deadPlayer.htmlTitleBasic() + " steals the essence of the " + ghost.htmlTitleBasic() + " in order to revive and continue fighting. It will be a while before the ghost recovers.";
			}else if(player.class_name == "Maid"){
				text += " The " + deadPlayer.htmlTitleBasic() + " inherits the essence and duties of the " + ghost.htmlTitleBasic() + " in order to revive and continue their fight. It will be a while before the ghost recovers.";
			}
			div.append(text);
			var canvas = drawReviveDead(div, deadPlayer, ghost, player.aspect);
			if(canvas){
				var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
				drawSprite(pSpriteBuffer,player)
				copyTmpCanvasToRealCanvasAtPos(canvas, pSpriteBuffer,0,0)
			}
			removeFromArray(myGhost, this.session.afterLife.ghosts);
			deadPlayer.makeAlive();
			if(player.aspect == "Life"){
				player.hp += 100; //i won't let you die again.
			}else if(player.aspect == "Doom"){
				player.minLuck += 100; //you've fulfilled the prophecy. you are no longer doomed.
				div.append("The prophecy is fulfilled. ")
			}
		}

		this.playerdecideWhatToDo = function(div, player,players){
			player.power = Math.max(1, player.power); //negative power is not allowed in an actual fight.
			//for now, only one choice    //free will, triggerLevel and canIAbscond adn mobility all effect what is chosen here.  highTrigger level makes aggrieve way more likely and abscond way less likely. lowFreeWill makes special and fraymotif way less likely. mobility effects whether you try to abascond.
			if(!this.willPlayerAbscond(div,player,players)){
				var undrainedPacts = removeDrainedGhostsFromPacts(player.ghostPacts);
				if(this.playerHelpGhostRevive(div, player, players)){ //MOST players won't do this
					//actually, if that method returned true, it wrote to the screen all on it's own. so dumb. why can't i be consistent?
				}else if(undrainedPacts.length > 0 ){
					var didGhostAttack = this.ghostAttack(div, player, getRandomElementFromArray(undrainedPacts)[0]); //maybe later denizen can do ghost attac, but not for now
					if(!didGhostAttack){
						this.aggrieve(div, player, this );
					}
				}else{
					this.aggrieve(div, player, this );
				}
			}

		}

		//only do attack if i don't expect to one shot the enemy
		//return false if i don't do ghsot attack
		this.ghostAttack = function(div, player, ghost){
			if(!ghost) return false;
			if(player.power < this.getHP()){
					console.log("ghost attack in: " + this.session.session_id)

					this.currentHP += Math.round(-1* ghost.power*5); //not just one attack from the ghost
					div.append(" The " + player.htmlTitleBasic() + " cashes in their promise of aid. The ghost of the " + ghost.htmlTitleBasic() + " unleashes an unblockable ghostly attack channeled through the living player. " + ghost.power + " damage is done to " + this.htmlTitleHP() + ". The ghost will need to rest after this for awhile. " );

					this.drawGhostAttack(div, player, ghost);
					ghost.causeOfDrain = player.htmlTitle();
					this.processDeaths(div, player, this)
					return true;
			}
			return false;
		}

		//draw ghost on top of player, ghost lightning.
		this.drawGhostAttack = function(div, player,ghost){
			var canvasId = div.attr("id") + "attack" +player.chatHandle+ghost.chatHandle+player.power+ghost.power
			var canvasHTML = "<br><canvas id='" + canvasId +"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
			div.append(canvasHTML);
			var canvas = document.getElementById(canvasId);
			var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
			drawSprite(pSpriteBuffer,player)
			var gSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
			drawSprite(gSpriteBuffer,ghost)
			//drawSpriteTurnways(gSpriteBuffer,ghost) //KR says looks bad.



			drawWhatever(canvas, "drain_lightning.png");

			copyTmpCanvasToRealCanvasAtPos(canvas, pSpriteBuffer,200,0)
			copyTmpCanvasToRealCanvasAtPos(canvas, gSpriteBuffer,250,0)
			var canvasBuffer = getBufferCanvas(document.getElementById("canvas_template"))
			return canvas;
		}



		//doomed players are just easier to target.
		this.chooseTarget=function(players){
			//TODO more likely to get light, less likely to get void
			var living = this.getLivingMinusAbsconded(players);
			var doomed = findDoomedPlayers(living);

			var ret = getRandomElementFromArray(doomed);
			if(ret){
				//console.log("targeting a doomed player.")
				return ret;
			}
			//console.log("targeting slowest player out of: " + living.length)
			//todo more likely to target light, less void.
			ret = findAspectPlayer(players, "Light");
			//can attack light players corpse up to 5 times, randomly.
			if(ret && ret.dead && (Math.seededRandom() > 5 || ret.currentHP < -1 * this.getPower()*5)) ret = null;  //only SOMETIMES target light player corpses. after all, that's SUPER lucky for the living.
			if(ret) return ret;
			return findLowestMobilityPlayer(living);
		}

		//higher the free will, smarter the ai. more likely to do special things.
		this.myTurn = function(div, players,numTurns){
			//console.log("Hp during my turn is: " + this.getHP())
			//free will, triggerLevel and canIAbscond adn mobility all effect what is chosen here.  highTrigger level makes aggrieve way more likely and abscond way less likely. lowFreeWill makes special and fraymotif way less likely. mobility effects whether you try to abascond.
			//special and fraymotif can attack multiple enemies, but aggrieve is one on one.
			if(!this.willIAbscond(div,players,numTurns)){
				var target = this.chooseTarget(players)
				if(target) this.aggrieve(div, this, target );
			}
			////console.log("have special attacks (like using ghost army, or reviving.). have fraymotifs. have prototypes that change stats of ring/scepter and even add fraymotifs.")


		}

		//hopefully either player or gameEntity can call this.
		this.aggrieve=function(div, offense, defense){
			//mobility, luck hp, and power are used here.
			var ret = " The " + offense.htmlTitleHP() + " targets the " +defense.htmlTitleHP() + ". ";
			if(defense.dead) ret += " Apparently their corpse sure is distracting? How luuuuuuuucky for the remaining players!"
			div.append(ret);

			//luck dodge
			var offenseRoll = offense.rollForLuck();
			var defenseRoll = defense.rollForLuck();
			//console.log("gonna roll for luck.")
			if(defenseRoll > offenseRoll*10){
				//console.log("Luck counter: " + this.session.session_id);
				div.append("The attack backfires and causes unlucky damage. The " + defense.htmlTitleHP() + " sure is lucky!!!!!!!!" );
				offense.currentHP += -1* offense.getPower()/10; //damaged by your own power.
				this.processDeaths(div, offense, defense)
				return;
			}else if(defenseRoll > offenseRoll*5){
				console.log("Luck dodge: " + this.session.session_id);
				div.append("The attack misses completely after an unlucky distraction.");
				return;
			}
			//mobility dodge
			var rand = getRandomInt(1,100) //don't dodge EVERY time. oh god, infinite boss fights. on average, fumble a dodge every 4 turns.
			if(defense.getMobility() > offense.getMobility() * 10 && rand > 25){
				////console.log("Mobility counter: " + this.session.session_id);
				ret = ("The " + offense.htmlTitleHP() + " practically appears to be standing still as they clumsily lunge towards the " + defense.htmlTitleHP()  );
				if(defense.getHP() > 0 ){
					ret += ". They miss so hard the " + defense.htmlTitleHP() + " has plenty of time to get a counterattack in."
					offense.currentHP += -1* defense.getPower();
				}else{
					ret += ". They miss pretty damn hard. "
				}
				div.append(ret + " ");
				this.processDeaths(div, offense, defense)

				return;
			}else if(defense.getMobility() > offense.getMobility()*5 && rand > 25){
				div.append(" The " + defense.htmlTitleHP() + " dodges the attack completely. ");
				return;
			}
			//base damage
			var hit = offense.getPower();
			offenseRoll = offense.rollForLuck();
			defenseRoll = defense.rollForLuck();
			//critical/glancing hit odds.
			if(defenseRoll > offenseRoll*2){ //glancing blow.
				//console.log("Glancing Hit: " + this.session.session_id);
				hit = hit/2;
				div.append(" The attack manages to not hit anything too vital. ");
			}else if(offenseRoll > defenseRoll*2){
				//console.log("Critical hit.")
				////console.log("Critical Hit: " + this.session.session_id);
				hit = hit*2;
				div.append(" Ouch. That's gonna leave a mark. ");
			}else{
				//console.log("a hit.")
				div.append(" A hit! ");
			}


			defense.currentHP += -1* hit;
			this.processDeaths(div, offense, defense)
		}

		this.processDeaths = function(div, offense,defense){
			offense.interactionEffect(defense); //only players have this. doomed time clones or bosses will do nothing.
			if(!this.checkForAPulse(defense, offense)){
				//console.log(defense.htmlTitleHP() + " is dead.");
				div.append("The " + defense.htmlTitleHP() + " is dead. ");
			}
			if(!this.checkForAPulse(offense, defense)){
				//console.log(offense.htmlTitleHP() + " is dead.");
				div.append("The " + offense.htmlTitleHP() + " is dead. ");
			}
		}

		this.htmlTitleBasic = function(){
				return this.name;
		}

		//if jack makes out with blalck queen, eventually put them in spades
		this.getRelationshipWith = function(){
			//stub for boss fights where an asshole absconds.
		}

		this.makeDead = function(causeOfDeath){
			//does nothing. game entities are assumed to be dead if zero hp
			this.dead = true; //mostly ignored, but gameEntity's on the player side use this.
			this.causeOfDeath = causeOfDeath;
		}

		this.checkForAPulse =function(player, attacker){
			if(player.getHP() <= 0){
				var cod = "fighting the " + attacker.htmlTitle();
				if(this.name == "Jack"){
					cod =  "after being shown too many stabs from Jack";
				}else if(this.name == "Black King"){

					cod = "fighting the Black King";
				}
				player.makeDead(cod);

				return false;
			}
			return true;
		}

		this.interactionEffect = function(player){
			//none
		}


		this.rollForLuck = function(){
			return getRandomInt(this.getMinLuck(), this.getMaxLuck());
		}

		//place holders for now. being in diamonds with jack is NOT a core feature.
		//but when it IS "there there you blubbering goddamned pansy"
		this.boostAllRelationshipsWithMeBy = function(amount){

		};

		this.boostAllRelationshipsBy = function(amount){

		};

		this.getFriendsFromList = function(){
			return [];
		}

		this.getHearts = function(){
			return [];
		}
		this.getDiamonds = function(){
			return [];
		}



}

//maybe it's a player. maybe it's game entity. whatever. copy it.
//take name explicitly 'cause plaeyrs don't have one
function copyGameEntity(object,name){
	var ret = new GameEntity(object.session, name, null)
	ret.corrupted = object.corrupted;
	ret.helpPhrase = object.helpPhrase;
	ret.helpfulness = object.helpfulness; //completely overridden.
	ret.grist = object.grist;
	ret.minLuck = object.minLuck;
	ret.currentHP = object.currentHP;
	ret.hp = object.hp;
	ret.mobility = object.mobility;
	ret.maxLuck = object.maxLuck;
	ret.freeWill = object.freeWill;
	ret.power = object.power;
	ret.illegal = object.illegal;
	ret.minLuck = object.minLuck;
	ret.minLuck = object.minLuck;
	ret.minLuck = object.minLuck;
	ret.player = object.player;
	ret.lusus = object.lusus;
	//idea, custom 'help string'. stretch goal for later. would let me have players help in different ways than a pomeranian would, for example.
	return ret;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																												 //
//																												 //
//		AND NOW IT'S TIME TO MAKE A SHIT TON OF GAME ENTITITES TO POSSIBLY SHOVE INTO SPRITES		             //
//																												 //
//																												 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
sooooo...things that go in sprites are gameEntities. Just like jack/Queen/King. And Denizens. Keep. Keep thinking about this.
*/

//TODO have each player have a "Sprite" game object that has basic stats. sprite gets one of these objects added pre-entry (or maybe a player);  later, can have other objects added.
//when a gameEntitity has an object added to it, adds the stats to itself. eventuall adds fraymotifs as well.
//sprites participate in fights until denizen fight. right before denizen fight, they leave to go do mysterious shit on the battlefield (set to null.)

//make a fuck ton of sprites here. don't need to reinit for sessions because these entitites are never used directly. instead, stuck into a sprite that player has,
//or into ring/scepter.
//an objects stats are zero unless otherwise stated.
//don't bother allocating memory for objects, just leave in array.
var disastor_objects =[];
var fortune_objects =[];
var prototyping_objects = [];
var lusus_objects = [];
var sea_lusus_objects = [];

//seperate 'cause of witches and bad luck and good luck
//DinceJof -  you prototype your kernel sprite with the ashes of your ancestor. They used to be a SBURB player like you, until they took a scratch to the timeline.

disastor_objects.push(new GameEntity(null, "First Guardian",null));  //also a custom fraymotif.
disastor_objects[disastor_objects.length-1].hp = 500;
disastor_objects[disastor_objects.length-1].currentHP = 500;
disastor_objects[disastor_objects.length-1].mobility = 500;
disastor_objects[disastor_objects.length-1].power = 500;
disastor_objects[disastor_objects.length-1].helpPhrase = "is fairly helpful with the teleporting and all, but when it speaks- Wow. No. That is not ok. ";



disastor_objects.push(new GameEntity(null, "Horror Terror",null));  //vast glub
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].corrupted = true;  //gives the corrupted status to whoever wears the ring, and the sprite, too. fighting corruption corrupts you.
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].lusus = true;
disastor_objects[disastor_objects.length-1].freeWill = 250; //wants to mind control you.
disastor_objects[disastor_objects.length-1].helpPhrase = "... Oh god. What is going on. Why does just listening to it make your ears bleed!? ";


disastor_objects.push(new GameEntity(null, "Speaker of the Furthest Ring",null));  //vast glub
disastor_objects[disastor_objects.length-1].hp = 500;
disastor_objects[disastor_objects.length-1].currentHP = 500;
disastor_objects[disastor_objects.length-1].corrupted = true;
disastor_objects[disastor_objects.length-1].power = 500;
disastor_objects[disastor_objects.length-1].freeWill = 500; //wants to mind control you.
disastor_objects[disastor_objects.length-1].helpPhrase = "whispers madness humankind was not meant to know. Its words are painful, hateful, yet… tempting. It speaks of flames and void, screams and gods. ";


disastor_objects.push(new GameEntity(null, "Clown",null));  //custom fraymotif: can' keep down the clown (heal).
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].minLuck = -250; //unpredictable
disastor_objects[disastor_objects.length-1].maxLuck = 250;
disastor_objects[disastor_objects.length-1].helpfulness = -1;
disastor_objects[disastor_objects.length-1].helpPhrase = "goes hehehehehehehehehehehehehehehehehehehehehehehehehehe. ";



disastor_objects.push(new GameEntity(null, "Puppet",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].helpPhrase =  "is the most unhelpful piece of shit in the world. Oh my god, just once. Please, just shut up. ";
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].helpfulness = -1;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].triggerLevel = 250; //unpredictable
disastor_objects[disastor_objects.length-1].freeWill = 250; //wants to mind control you.
disastor_objects[disastor_objects.length-1].mobility = 250;
disastor_objects[disastor_objects.length-1].minLuck = -250;
disastor_objects[disastor_objects.length-1].maxLuck = 250;

disastor_objects.push(new GameEntity(null, "Xenomorph",null));  //custom fraymotif: acid blood
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].mobility = 250;

disastor_objects.push(new GameEntity(null, "Deadpool",null));  //custom fraymotif: healing factor
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].mobility = 250;
disastor_objects[disastor_objects.length-1].helpfulness = 1;
disastor_objects[disastor_objects.length-1].minLuck = -250;
disastor_objects[disastor_objects.length-1].maxLuck = 250;
disastor_objects[disastor_objects.length-1].helpPhrase = "demonstrates that when it comes to providing fourth wall breaking advice to getting through quests and killing baddies, he is pretty much the best there is. ";


disastor_objects.push(new GameEntity(null, "Dragon",null));    //custom fraymotif: mighty breath.
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].lusus = true;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].helpPhrase = "breathes fire and offers condescending, yet useful advice. ";



disastor_objects.push(new GameEntity(null, "Alien",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;

disastor_objects.push(new GameEntity(null, "Teacher",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].helpfulness = -1;
disastor_objects[disastor_objects.length-1].helpPhrase = "dials the sprites natural tendency towards witholding information to have you 'figure it out yourself' up to eleven. ";



disastor_objects.push(new GameEntity(null, "Fiduspawn",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;

disastor_objects.push(new GameEntity(null, "Doll",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].helpfulness = -1;
disastor_objects[disastor_objects.length-1].helpPhrase = "stares creepily. It never moves when you're watching it. It's basically the worst, and that's all there is to say on that topic. ";



disastor_objects.push(new GameEntity(null, "Zombie",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;

disastor_objects.push(new GameEntity(null, "Demon",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 500;
disastor_objects[disastor_objects.length-1].freeWill = 250; //wants to mind control you.


disastor_objects.push(new GameEntity(null, "Monster",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 500; //generically scary
disastor_objects[disastor_objects.length-1].triggerLevel = 250;


disastor_objects.push(new GameEntity(null, "Vampire",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].mobility = 250; //vampire fastness

disastor_objects.push(new GameEntity(null, "Pumpkin",null));
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].maxLuck = 5000;
disastor_objects[disastor_objects.length-1].mobility = 5000;  //what pumpkin?
disastor_objects[disastor_objects.length-1].helpPhrase = "was kind of helpful, and then kind of didn’t exist. Please don’t think too hard about it, the simulation is barely handling a pumpkin sprite as is. ";


disastor_objects.push(new GameEntity(null, "Werewolf",null));
disastor_objects[disastor_objects.length-1].hp = 250;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].triggerLevel = 250;

disastor_objects.push(new GameEntity(null, "Monkey",null));   //just, fuck monkeys in general.
disastor_objects[disastor_objects.length-1].hp = 5;
disastor_objects[disastor_objects.length-1].currentHP = 250;
disastor_objects[disastor_objects.length-1].power = 250;
disastor_objects[disastor_objects.length-1].helpfulness = -1;
disastor_objects[disastor_objects.length-1].maxLuck = -5000;  //fuck monkeys
disastor_objects[disastor_objects.length-1].min = -5000;
disastor_objects[disastor_objects.length-1].mobility = 5000;
disastor_objects[disastor_objects.length-1].helpPhrase = "actively inteferes with quests. Just. Fuck monkeys. ";




//fortune
fortune_objects.push(new GameEntity(null, "Frog",null));
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].mobility = 100;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Lizard",null));
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Salamander",null));
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Iguana",null));
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Crocodile",null));
fortune_objects[fortune_objects.length-1].power = 50;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Turtle",null));
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].mobility = -100;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Alligator",null));
fortune_objects[fortune_objects.length-1].power = 50;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Snake",null));  //poison fraymotif
fortune_objects[fortune_objects.length-1].power = 50;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "providessss the requisssssite amount of gigglessssssnort hideytalk to be jusssssst barely helpful. AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Axolotl",null)); //apparently real ones are good at regeneration?
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].hp =  50;
fortune_objects[fortune_objects.length-1].currentHP = 50;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";


fortune_objects.push(new GameEntity(null, "Newt",null));
fortune_objects[fortune_objects.length-1].power = 20;
fortune_objects[fortune_objects.length-1].illegal = true;
fortune_objects[fortune_objects.length-1].helpPhrase = "provides the requisite amount of gigglesnort  hideytalk to be fairly useful, AND the underlings seem to go after it first! Bonus! ";




//regular
prototyping_objects.push(new GameEntity(null, "Buggy As Fuck Retro Game",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].corrupted = true;  //no stats, just corrupted. maybe a fraymotif later.
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides painful, painful sound file malfunctions, why is this even a thing? ";

prototyping_objects.push(new GameEntity(null, "Robot",null));
prototyping_objects[prototyping_objects.length-1].hp = 100;
prototyping_objects[prototyping_objects.length-1].currentHP = 100;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is <b>more</b> useful than another player. How could a mere human measure up to the awesome logical capabilities of a machine? ";
prototyping_objects[prototyping_objects.length-1].freeWill = 100;
prototyping_objects[prototyping_objects.length-1].power = 100;

prototyping_objects.push(new GameEntity(null, "Golfer",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].minLuck = 20;
prototyping_objects[prototyping_objects.length-1].maxLuck = 20;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides surprisingly helpful advice, even if they do insist on calling all enemies ‘bogeys’. ";


prototyping_objects.push(new GameEntity(null, "Game Bro",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides rad as fuck tips and tricks for beating SBURB and getting mad snacks, yo. 5 out of 5 hats. ";


//in joke, lol, google always reports that sessions are crashed. google is a horror terror (see tumblr)
prototyping_objects.push(new GameEntity(null, "Google",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].corrupted = true;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "sure knows a lot about everything, but why does it only seem to return results about crashing SBURB?";


prototyping_objects.push(new GameEntity(null, "Game Grl",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides rad as fuck tips and tricks for beating SBURB and getting mad snacks, yo, but, like, while also being a GIRL? *record scratch*  5 out of 5 lady hats. ";

prototyping_objects.push(new GameEntity(null, "Paperclip",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "says: 'It looks like you're trying to play a cosmic game where you breed frogs to create a universe. Would you like me to'-No. 'Would you like me to'-No! 'It looks like you're'-shut up!!! This is not helpful.";



prototyping_objects.push(new GameEntity(null, "Nick Cage",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "demonstrates that when it comes to solving bullshit riddles to get National *cough* I mean SBURBian treasure, he is simply the best there is. ";


prototyping_objects.push(new GameEntity(null, "Praying Mantis",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].maxLuck = 20;

prototyping_objects.push(new GameEntity(null, "Doctor",null));   //healing fraymotif
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is pretty much as useful as another player. No cagey riddles, just straight answers on how to finish the quests. ";


prototyping_objects.push(new GameEntity(null, "Gerbil",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "remains physically adorable and mentally idiotic. Gigglysnort hideytalk ahoy. ";


prototyping_objects.push(new GameEntity(null, "Chinchilla",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "remains physically adorable and mentally idiotic. Gigglysnort hideytalk ahoy. ";


prototyping_objects.push(new GameEntity(null, "Rabbit",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].maxLuck = 100;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "remains physically adorable and mentally idiotic. Gigglysnort hideytalk ahoy. ";


prototyping_objects.push(new GameEntity(null, "Librarian",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "Is pretty much as useful as another player. No cagey riddles, just straight answers on where the book on how to finish the quest is, and could you please keep it down? ";


prototyping_objects.push(new GameEntity(null, "Pit Bull",null));
prototyping_objects[prototyping_objects.length-1].power = 50;

prototyping_objects.push(new GameEntity(null, "Butler",null));
prototyping_objects[prototyping_objects.length-1].power = 50;  //he will serve you like a man on butler island
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is serving their player like a dude on butlersprite island. ";
prototyping_objects[prototyping_objects.length-1].triggerLevel = -50;

prototyping_objects.push(new GameEntity(null, "Sloth",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].mobility = -50;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides. Slow. But. Useful. Advice.";


prototyping_objects.push(new GameEntity(null, "Cowboy",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides useful advice, even if they do insist on calling literally everyone 'pardner.' ";



prototyping_objects.push(new GameEntity(null, "Pomeranian",null));
prototyping_objects[prototyping_objects.length-1].power = 1; //pomeranians aren't actually very good at fights.  (trust me, i know)
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "unhelpfully insists that every rock is probably a boss fight (it isn’t). ";


prototyping_objects.push(new GameEntity(null, "Chihuahua",null));
prototyping_objects[prototyping_objects.length-1].power = 1;  //i'm extrapolating here, but I imagine Chihuahua's aren't very good at fights, either.
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "unhelpfully insists that every rock is probably a boss fight (it isn’t). ";


prototyping_objects.push(new GameEntity(null, "Pony",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].triggerLevel = 1000;  //ponyPals taught me that ponys are just flipping their shit, like, 100% of the time.
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is constantly flipping their fucking shit instead of being useful in any way shape or form, as ponies are known for. ";


prototyping_objects.push(new GameEntity(null, "Horse",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].triggerLevel = 100;  //probably flip out less than ponys???
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is constantly flipping their fucking shit instead of being useful in any way shape or form, as horses are known for. ";


prototyping_objects.push(new GameEntity(null, "Internet Troll",null));   //needs to have a fraymotif called "u mad, bro" and "butt hurt"
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].triggerLevel = 1000;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "actively does its best to hinder their efforts. ";


prototyping_objects.push(new GameEntity(null, "Mosquito",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is a complete dick, buzzing and fussing and biting. What's its deal? "


prototyping_objects.push(new GameEntity(null, "Fly",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is a complete dick, buzzing and fussing and biting. What's its deal? "


prototyping_objects.push(new GameEntity(null, "Cow",null));
prototyping_objects[prototyping_objects.length-1].power = 30; //cows kill more people a year than sharks.

prototyping_objects.push(new GameEntity(null, "Bird",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].mobility = 20;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides sort of helpful advice when not grabbing random objects to make nests. ";



prototyping_objects.push(new GameEntity(null, "Bug",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides the requisite amount of buzzybuz zuzytalk to be juuuust barely helpful. ";



prototyping_objects.push(new GameEntity(null, "Llama",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Penguin",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Husky",null));
prototyping_objects[prototyping_objects.length-1].power = 30;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "alternates between loud, insistent barks and long, eloquent monologues on the deeper meaning behind each and every fragment of the game. ";



prototyping_objects.push(new GameEntity(null, "Cat",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].minLuck = -20;
prototyping_objects[prototyping_objects.length-1].maxLuck = 20;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "Is kind of helpful? Maybe? You can't tell if it loves their player or hates them. ";



prototyping_objects.push(new GameEntity(null, "Dog",null));
prototyping_objects[prototyping_objects.length-1].power = 30;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "alternates between loud, insistent barks and long, eloquent monologues on the deeper meaning behind each and every fragment of the game. ";



prototyping_objects.push(new GameEntity(null, "Pigeon",null));
prototyping_objects[prototyping_objects.length-1].power = 0.5;  //pigeons are not famous for their combat prowess. I bet even a pomeranian could beat one up.
prototyping_objects[prototyping_objects.length-1].freeWill = -40;


prototyping_objects.push(new GameEntity(null, "Octopus",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].mobility = 80; //so many legs! more legs is more faster!!!


prototyping_objects.push(new GameEntity(null, "Fish",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Kitten",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is kind of helpful? Maybe? You can't tell if it loves their player or hates them. ";



prototyping_objects.push(new GameEntity(null, "Worm",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Bear",null));
prototyping_objects[prototyping_objects.length-1].power = 50;


prototyping_objects.push(new GameEntity(null, "Goat",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Rat",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Raccoon",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "demonstrates that SBURB basically hides quest items in the same places humans would throw away their garbage. ";




prototyping_objects.push(new GameEntity(null, "Crow",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].freeWill = 20; //have you ever tried to convince a crow not to do something? not gonna happen.
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides sort of helpful advice when not grabbing random objects to make nests. ";



prototyping_objects.push(new GameEntity(null, "Chicken",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].freeWill = -20;  //mike the headless chicken has convinced me that chickens don't really need brains. god that takes me back.


prototyping_objects.push(new GameEntity(null, "Duck",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Sparrow",null));
prototyping_objects[prototyping_objects.length-1].power = 20;


prototyping_objects.push(new GameEntity(null, "Fancy Santa",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "goes hohohohohohohohoho. ";

prototyping_objects.push(new GameEntity(null, "Politician",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = -1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "offers a blueprint for an ECONONY that works for everyone. That would've been more useful before the earth was destroyed.... ";


prototyping_objects.push(new GameEntity(null, "Tiger",null));
prototyping_objects[prototyping_objects.length-1].power = 50;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "Provides just enough pants-shitingly terrifying growly-roar meow talk to be useful. ";



prototyping_objects.push(new GameEntity(null, "Sugar Glider",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "remains physically adorable and mentally idiotic. Gigglysnort hideytalk ahoy. ";



prototyping_objects.push(new GameEntity(null, "Rapper",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "provides surprisingly helpful advice, even if it does insist on some frankly antiquated slang and rhymes. I mean, civilization is dead, there isn’t exactly a police left to fuck. ";



prototyping_objects.push(new GameEntity(null, "Kangaroo",null));
prototyping_objects[prototyping_objects.length-1].power = 30;
prototyping_objects[prototyping_objects.length-1].mobility = 30;

prototyping_objects.push(new GameEntity(null, "Stoner",null));
prototyping_objects[prototyping_objects.length-1].power = 20;
prototyping_objects[prototyping_objects.length-1].minLuck = -20;
prototyping_objects[prototyping_objects.length-1].maxLuck = 20;
prototyping_objects[prototyping_objects.length-1].helpfulness = 1;
prototyping_objects[prototyping_objects.length-1].helpPhrase = "is pretty much as useful as another player, assuming that player was higher then a fucking kite. ";



//////////////////////lusii are a little stronger in general

lusus_objects.push(new GameEntity(null, "Hoofbeast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Meow Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;
lusus_objects[lusus_objects.length-1].minLuck = 20;
lusus_objects[lusus_objects.length-1].maxLuck = 20;
lusus_objects[lusus_objects.length-1].helpPhrase = "is kind of helpful? Maybe? You can't tell if it loves their player or hates them. ";



lusus_objects.push(new GameEntity(null, "Bark Beast",null));
lusus_objects[lusus_objects.length-1].power = 40;
lusus_objects[lusus_objects.length-1].lusus = true;
lusus_objects[lusus_objects.length-1].helpPhrase = "alternates between loud, insistent barks and long, eloquent monologues on the deeper meaning behind each and every fragment of the game. ";


lusus_objects.push(new GameEntity(null, "Nut Creature",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].mobility = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Gobblefiend",null));
lusus_objects[lusus_objects.length-1].power = 50; //turkeys are honestly terrifying.
lusus_objects[lusus_objects.length-1].lusus = true;
lusus_objects[lusus_objects.length-1].helpfulness = -1;
lusus_objects[lusus_objects.length-1].helpPhrase = "is the most unhelpful piece of shit in the world. Oh my god, just once. Please, just shut up. ";


lusus_objects.push(new GameEntity(null, "Bicyclops",null));  //laser fraymotif?
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Centaur",null));
lusus_objects[lusus_objects.length-1].power = 50;
lusus_objects[lusus_objects.length-1].triggerLevel = -50; //lusii in the butler genus simply are unflappable.
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Fairy Bull",null));
lusus_objects[lusus_objects.length-1].power = 1; //kinda useless. like a small dog or something.
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Slither Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Wiggle Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Honkbird",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Dig Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Cholerbear",null));
lusus_objects[lusus_objects.length-1].power = 50;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Antler Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].mobility = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Ram Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Crab",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Spider",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Thief Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "March Bug",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Nibble Vermin",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Woolbeast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Hop Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].maxLuck = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Stink Creature",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Speed Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].mobility = 50;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Jump Creature",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Fight Beast",null));
lusus_objects[lusus_objects.length-1].power = 50;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Claw Beast",null));
lusus_objects[lusus_objects.length-1].power = 50;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Tooth Beast",null));
lusus_objects[lusus_objects.length-1].power = 50;
lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Armor Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].currentHP = 100;
lusus_objects[lusus_objects.length-1].hp = 100;

lusus_objects[lusus_objects.length-1].lusus = true;

lusus_objects.push(new GameEntity(null, "Trap Beast",null));
lusus_objects[lusus_objects.length-1].power = 30;
lusus_objects[lusus_objects.length-1].lusus = true;






////////////////////////sea lusii

sea_lusus_objects.push(new GameEntity(null, "Zap Beast",null));  //zap fraymotif
sea_lusus_objects[sea_lusus_objects.length-1].power = 50;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Sea Slither Beast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Electric Beast",null)); //zap fraymotif
sea_lusus_objects[sea_lusus_objects.length-1].power = 50;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Whale",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].currentHP = 50;
sea_lusus_objects[sea_lusus_objects.length-1].hp = 50;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Sky Horse",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].mobility = 20;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Sea Meow Beast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;
sea_lusus_objects[sea_lusus_objects.length-1].minLuck = -20;
sea_lusus_objects[sea_lusus_objects.length-1].maxLuck = 20;

sea_lusus_objects.push(new GameEntity(null, "Sea Hoofbeast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Cuttlefish",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Swim Beast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Sea Goat",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;
sea_lusus_objects[sea_lusus_objects.length-1].minLuck = 30;
sea_lusus_objects[sea_lusus_objects.length-1].maxLuck = 20;

sea_lusus_objects.push(new GameEntity(null, "Light Beast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Dive Beast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Honkbird",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Sea Bear",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;

sea_lusus_objects.push(new GameEntity(null, "Sea Armorbeast",null));
sea_lusus_objects[sea_lusus_objects.length-1].power = 30;
sea_lusus_objects[sea_lusus_objects.length-1].lusus = true;
sea_lusus_objects[sea_lusus_objects.length-1].currentHP = 50;
sea_lusus_objects[sea_lusus_objects.length-1].hp = 50;



prototyping_objects = prototyping_objects.concat(disastor_objects);
prototyping_objects = prototyping_objects.concat(fortune_objects);
prototyping_objects = prototyping_objects.concat(lusus_objects);
prototyping_objects = prototyping_objects.concat(sea_lusus_objects); //yes, a human absolutely could prototype some troll's lusus. that is a thing that is true.
