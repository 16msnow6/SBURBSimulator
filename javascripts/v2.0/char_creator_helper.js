//need to render all players
function CharacterCreatorHelper(players){
	this.div = $("#character_creator");
	this.players = players;
	//have css for each sprite template.  sprite template is 400 x 300, fit 3 on a line?
	//max of 4 lines?

	this.drawAllPlayers = function(){
		bloodColors.push("#ff0000") //for humans
		for(var i = 0; i<this.players.length; i++){
			this.drawSinglePlayer(this.players[i]);
		}
	}
	this.drawSinglePlayer = function(player){
		//debug code, remove later
		player.interest1 = "Custom Interest"
		player.interest1Category = "Music"
		player.interest2 = "Rap" //not a custom interest, make sure sim doesn't try to add it twice.
		player.interest2Category = "Music"
		//console.log("drawing: " + player.title())
		var str = "";
		var divId =  player.chatHandle;
		divId = divId.replace(/\s+/g, '')
		str += "<div class='createdCharacter'>"
		var canvasHTML = "<canvas class = 'createdCharacterCanvas' id='canvas" +divId + "' width='" +400 + "' height="+300 + "'>  </canvas>";
		str += "<div class = 'charOptions'>"
		str += (this.drawOneClassDropDown(player));
		str += ("of");
		str+= (this.drawOneAspectDropDown(player));
		str += "Hair Type:" + this.drawOneHairDropDown(player);
		str += "Hair Color:" + this.drawOneHairColorPicker(player);
		str += "Species: " + this.drawOneSpeciesDropDown(player);
		str += "Left Horn: " + this.drawOneLeftHornDropDown(player);
		str += "Right Horn: " + this.drawOneRightHornDropDown(player);
		str += "BloodColor: " + this.drawOneBloodColorDropDown(player);
		str += "Favorite Number: " + this.drawOneFavoriteNumberDropDown(player);
		str += "</div>"

		str += (canvasHTML);
		str += "</div>"
		this.div.append(str);

		player.spriteCanvasID = player.chatHandle+player.id+"spriteCanvas";
		var canvasHTML = "<br><canvas style='display:none' id='" + player.spriteCanvasID+"' width='" +400 + "' height="+300 + "'>  </canvas>";
		$("#playerSprites").append(canvasHTML)

		player.renderSelf();

		var canvas = document.getElementById("canvas"+ divId);
		//drawSinglePlayer(canvas, player);
		var p1SpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
		drawSpriteFromScratch(p1SpriteBuffer,player)
		//drawBG(p1SpriteBuffer, "#ff9999", "#ff00ff")
		copyTmpCanvasToRealCanvasAtPos(canvas, p1SpriteBuffer,0,0)
		this.wireUpPlayerDropDowns(player);

	}

	this.redrawSinglePlayer = function(player){
		  player.renderSelf();
			var divId = "canvas" + player.chatHandle;
			divId = divId.replace(/\s+/g, '');
			var canvas =$("#"+divId)[0]
			drawSolidBG(canvas, "#ffffff")
			drawSinglePlayer(canvas, player);
	}


	this.wireUpPlayerDropDowns = function(player){
			var c2 =  $("#classNameID" +player.chatHandle) ;
			var a2 =  $("#aspectID" +player.chatHandle) ;
			var hairDiv  =  $("#hairTypeID" +player.chatHandle) ;
			var hairColorDiv  =  $("#hairColorID" +player.chatHandle) ;
			var speciesDiv  =  $("#speciesID" +player.chatHandle) ;
			var leftHornDiv  =  $("#leftHornID" +player.chatHandle) ;
			var rightHornDiv  =  $("#rightHornID" +player.chatHandle) ;
			var bloodDiv  =  $("#bloodColorID" +player.chatHandle) ;
			var favoriteNumberDiv  =  $("#favoriteNumberID" +player.chatHandle) ;


			var that = this;
			c2.change(function() {
					var classDropDown = $('[name="className' +player.chatHandle +'"] option:selected') //need to get what is selected inside the .change, otheriise is always the same
					player.class_name = classDropDown.val();
					that.redrawSinglePlayer(player);
			});

			favoriteNumberDiv.change(function() {
					var numberDropDown = $('[name="favoriteNumber' +player.chatHandle +'"] option:selected') //need to get what is selected inside the .change, otheriise is always the same
					player.quirk.favoriteNumber = numberDropDown.val();
					that.redrawSinglePlayer(player);
			});


			a2.change(function() {
					var aspectDropDown = $('[name="aspect' +player.chatHandle +'"] option:selected')
					player.aspect = aspectDropDown.val();
					that.redrawSinglePlayer(player);
			});

			hairDiv.change(function() {
				  var aspectDropDown = $('[name="hair' +player.chatHandle +'"] option:selected')
					player.hair = aspectDropDown.val();
					that.redrawSinglePlayer(player);
			});

			hairColorDiv.change(function() {
					//var aspectDropDown = $('[name="hairColor' +player.chatHandle +'"] option:selected')
					player.hairColor = hairColorDiv.val();
					that.redrawSinglePlayer(player);
			});

			leftHornDiv.change(function() {
					var aspectDropDown = $('[name="leftHorn' +player.chatHandle +'"] option:selected')
					player.leftHorn = aspectDropDown.val();
					that.redrawSinglePlayer(player);
			});

			rightHornDiv.change(function() {
					var aspectDropDown = $('[name="rightHorn' +player.chatHandle +'"] option:selected')
					player.rightHorn = aspectDropDown.val();
					that.redrawSinglePlayer(player);
			});

			bloodDiv.change(function() {
					var aspectDropDown = $('[name="bloodColor' +player.chatHandle +'"] option:selected')
					player.bloodColor = aspectDropDown.val();
					that.redrawSinglePlayer(player);
			});

			speciesDiv.change(function() {
					var aspectDropDown = $('[name="species' +player.chatHandle +'"] option:selected')
					var str = aspectDropDown.val();
					if(str == "Troll"){
						player.isTroll = true;
					}else{
						player.isTroll = false;
					}
					that.redrawSinglePlayer(player);
			});
	}

	//(1,60)
	this.drawOneHairDropDown = function(player){
		var html = "<select id = 'hairTypeID" + player.chatHandle + "' name='hair" +player.chatHandle +"'>";
		for(var i = 1; i<= 60; i++){
			if(player.hair == i){
				html += '<option  selected = "selected" value="' + i +'">' + i+'</option>'
			}else{
				html += '<option value="' + i +'">' + i+'</option>'
			}
		}
		html += '</select>'
		return html;
	}

	//0,12
	this.drawOneFavoriteNumberDropDown = function(player){
		var html = "<select id = 'favoriteNumberID" + player.chatHandle + "' name='favoriteNumber" +player.chatHandle +"'>";
		for(var i = 0; i<= 12; i++){
			if(player.quirk.favoriteNumber == i){
				html += '<option  selected = "selected" value="' + i +'">' + i+'</option>'
			}else{
				html += '<option value="' + i +'">' + i+'</option>'
			}
		}
		html += '</select>'
		return html;
	}

	this.drawOneLeftHornDropDown = function(player){
		var html = "<select id = 'leftHornID" + player.chatHandle + "' name='leftHorn" +player.chatHandle +"'>";
		for(var i = 1; i<= 46; i++){
			if(player.leftHorn == i){
				html += '<option  selected = "selected" value="' + i +'">' + i+'</option>'
			}else{
				html += '<option value="' + i +'">' + i+'</option>'
			}
		}
		html += '</select>'
		return html;
	}

	this.drawOneRightHornDropDown = function(player){
		var html = "<select id = 'rightHornID" + player.chatHandle + "' name='rightHorn" +player.chatHandle +"'>";
		for(var i = 1; i<= 46; i++){
			if(player.leftHorn == i){
				html += '<option  selected = "selected" value="' + i +'">' + i+'</option>'
			}else{
				html += '<option value="' + i +'">' + i+'</option>'
			}
		}
		html += '</select>'
		return html;
	}

	this.drawOneClassDropDown = function(player){
		available_classes = classes.slice(0); //re-init available classes. make deep copy
		var html = "<select id = 'classNameID" + player.chatHandle + "' name='className" +player.chatHandle +"'>";
		for(var i = 0; i< available_classes.length; i++){
			if(available_classes[i] == player.class_name){
				html += '<option  selected = "selected" value="' + available_classes[i] +'">' + available_classes[i]+'</option>'
			}else{
				html += '<option value="' + available_classes[i] +'">' + available_classes[i]+'</option>'
			}
		}
		html += '</select>'
		return html;
	}

	this.drawOneSpeciesDropDown = function(player){
		var species = ["Human", "Troll"]
		var html = "<select id = 'speciesID" + player.chatHandle + "' name='species" +player.chatHandle +"'>";
		for(var i = 0; i< species.length; i++){
			if((species[i] == "Troll" && player.isTroll) || (species[i] == "Human" && !player.isTroll)){
				html += '<option  selected = "species" value="' + species[i] +'">' + species[i]+'</option>'
			}else{
				html += '<option value="' + species[i] +'">' + species[i]+'</option>'
			}
		}
		html += '</select>'
		return html;

	}

	this.drawOneHairColorPicker = function(player){
		var id = "hairColorID" + player.chatHandle
		var html = "<input id = '" + id + "' type='color' name='favcolor' value='" + player.hairColor + "'>"
		return html;
	}
	this.drawOneHairColorDropDownOLD = function(player){
		var html = "<select id = 'hairColorID" + player.chatHandle + "' name='hairColor" +player.chatHandle +"'>";
		for(var i = 0; i< human_hair_colors.length; i++){
			if(human_hair_colors[i] == player.hairColor){
				html += '<option style="background:' + human_hair_colors[i] + '" selected = "hairColor" value="' + human_hair_colors[i] +'">' + human_hair_colors[i]+'</option>'
			}else{
				html += '<option style="background:' + human_hair_colors[i] + '"value="' + human_hair_colors[i] +'">' + human_hair_colors[i]+'</option>'
			}
		}
		html += '</select>'
		return html;
	}

	this.drawOneBloodColorDropDown = function(player){
		var html = "<select id = 'bloodColorID" + player.chatHandle + "' name='bloodColor" +player.chatHandle +"'>"
		for(var i = 0; i< bloodColors.length; i++){
			if(bloodColors[i] == player.bloodColor){
				html += '<option style="background:' + bloodColors[i] + '" selected = "bloodColor" value="' + bloodColors[i] +'">' + bloodColors[i]+'</option>'
			}else{
				html += '<option style="background:' + bloodColors[i] + '"value="' + bloodColors[i] +'">' + bloodColors[i]+'</option>'
			}
		}
		html += '</select>'
		return html;
	}





	this.drawOneAspectDropDown = function(player){
		available_aspects = nonrequired_aspects.slice(0); //required_aspects
	  available_aspects = available_aspects.concat(required_aspects.slice(0));
		var html = "<select id = 'aspectID" + player.chatHandle + "'' name='aspect" +player.chatHandle +"'>";
		for(var i = 0; i< available_aspects.length; i++){
			if(available_aspects[i] == player.aspect){
				html += '<option selected = "selected" value="' + available_aspects[i] + '" >' + available_aspects[i]+'</option>'
			}else{
				html += '<option value="' + available_aspects[i] + '" >' + available_aspects[i]+'</option>'
			}

		}
		html += '</select>'
		return html;
	}

}
