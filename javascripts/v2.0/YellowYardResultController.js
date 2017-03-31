/*
	While the session contains a list of every ImportantEvent that happens inside of it,
	THIS object contains a list of every ImportantEvent the Observer has decided to change.

	it can also compare two important events to see if they are the same.

	TODO: ~~~~~~~~~~~~~~~~~ HAVE AB COMMENT ON SESSIONS THAT HAVE THIS AVAILABLE. " Shit. That went south fast. I better tell JR."

	When I described this to a friend they said "aren't you worried this will turn into a bucket of spiders?".
	(.i.e become intractably complicated and impossible to debug)
	My response: "This has always been a bucket of spidres, I just decided to dump the whole thing on my head and do a little dance with it."

	This is such a stupid idea. So many things can go wrong.  But it's so irresistable. I NEED to make ridiculous ground hog day time shenanigans possible. It is my destiny.

	hrmm...if time playered triggered, maybe can add evil actions, like Damara was doing.
	dirupt ectobiology. kill players, etc. could trigger some godtiers
*/
var yyrEventsGlobalVar = [];

function YellowYardResultController(){
    this.eventsToUndo = [];

    this.doesEventNeedToBeUndone = function(e){
        for(var i = 0; i<this.eventsToUndo.length; i++){
          var e2 = this.eventsToUndo[i];
		 // console.log("checking if needs to be undone")
          if(doEventsMatch(e,e2)){
              return e2;
          }
        }
        return null;
    }




}
/*
	This is not perfecct.  A player can, for example, die multiple times with the same mvp power level.
	But i figure if multiple mind-influenced time players warp into save them multiple times (even from one decision), well...time shenanigans.
	it is not unreasonable to imagien 2 timelines that are extremely similar where the Observer made the same choice. 
*/
function doEventsMatch(newEvent, storedEvent){
	//console.log("comparing: '" + newEvent.humanLabel() + "' to '" + storedEvent.humanLabel() + "'")
  if(newEvent.session.session_id != storedEvent.session.session_id){
      //console.log("session id did not match.")
      return false;
  }
  //are they the same kind of event
  if(newEvent.constructor.name != storedEvent.constructor.name){
    //console.log("constructor did not match.")
    return false;
  }
  if(newEvent.mvp_value != storedEvent.mvp_value){
      //console.log("mvp did not match")
      return false;
  }
  if(newEvent.player && storedEvent.player){
	  //should work even if player is supposed to be null
	  if(newEvent.player.class_name != storedEvent.player.class_name){
		 //console.log("player class did not match")
		  return false;
	  }
	  
	    if(newEvent.player.aspect != storedEvent.player.aspect){
      //console.log("player aspect did not match")
		return false;
		}
  }



  //since i know the events match, make sure my player is up to date with the current session.
  //had a stupidly tragic bug where I was bringing players back in the DEAD SESSION instead of this new version of it.
  storedEvent.player = newEvent.player;
  storedEvent.session = newEvent.session; //cant get space players otherwise
  //trigger the new sessions timePlayer.  time shenanigans wear on sanaity.
  var alphaTimePlayer = findAspectPlayer(newEvent.session.players, "Time");
  alphaTimePlayer.triggerLevel += 0.2; //how many re-dos does this give me before they snap?
  alphaTimePlayer.doomedTimeClones.push(storedEvent.doomedTimeClone);

  return true;
}


function decision(){
  var a =$("input[name='decision']:checked").val()
  var eventDecided = yyrEventsGlobalVar[parseInt(a)];
  //alert(eventDecided.humanLabel());
  curSessionGlobalVar.addEventToUndoAndReset(eventDecided);
}