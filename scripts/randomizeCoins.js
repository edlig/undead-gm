export async function randomizeCoins(actor) {
  console.log('Undead GM | Рандомизация монет для актора:', actor);

  let cr = actor.system.details.cr;
	let type = actor.system.details.type.value;
	
	if(type === "custom" || type ==="humanoid") {
    let rand = new Roll("1d100");
    await rand.evaluate();
    console.log("Undead GM | ", actor.name," Random Roll: ", rand.total);

  ///////// Coins /////////
    async function rollCoins(PP, GP, SP, CP) {    
        let rollCP = await new Roll(CP).evaluate();
        let rollSP = await new Roll(SP).evaluate();
        let rollGP = await new Roll(GP).evaluate();
        let rollPP = await new Roll(PP).evaluate();

        let coins = {
          cp:rollCP.total,
          sp:rollSP.total,
          gp:rollGP.total,
          pp:rollPP.total
        }

        await actor.update({"system.currency": coins});       
        await console.log('Undead GM | Монеты для моба сгенерированы', coins);
    }
    
	if(cr<5){
	
		if(rand.total<31){
			console.log("Undead GM |  No coins found")                 //Nothing
		} else if (rand.total<61){
        await rollCoins("0","0","0","5d6");              //17CP avg
		} else if (rand.total<91){
			await rollCoins("0","0","4d6","5d6");         	//14SP avg
		} else {
			await rollCoins("0","3d6","4d6","5d6");   			//10GP avg
		}
    } else if(cr<11){
	
		if(rand.total<31){
			console.log("Undead GM |  No coins found")                 //Nothing
		} else if (rand.total<61){
        await rollCoins("0","0","0","4d6*100+4d6*10+4d6");              //1400CP avg
		} else if (rand.total<91){
			await rollCoins("0","0","6d6*10+6d6","4d6*10+4d6");         	//210SP avg
		} else {
			await rollCoins("0","4d6*10+4d6","6d6*10+6d6","4d6*10+4d6");   			//140GP avg
		}
    } else if(cr<17){
	
		if(rand.total<21){
			console.log("Undead GM |  No coins found")                 //Nothing
		} else if (rand.total<36){
        await rollCoins("0","0","4d6*100+4d6*10+4d6","0");              //1400SP avg
		} else if (rand.total<76){
			await rollCoins("0","1d6*100+1d6*10+1d6","4d6*100+4d6*10+4d60","0");         	//350GP avg
		} else {
			await rollCoins("1d6*10+1d6","2d6*100+2d6*10+2d6","4d6*100+4d6*10+4d6","0");   			//700GP avg
		}
	} else{
	
		if(rand.total<16){
			console.log("Undead GM |  No coins found")                 //Nothing
		} else if (rand.total<55){
        await rollCoins("0","8d6*100+8d6*10+8d6","0","0");              //2800GP avg
		} else {
			await rollCoins("1d6*100+1d6*10+1d6","1d6*1000+1d6*100+1d6*10+1d6","0","0");   			//3500GP avg	
		}	
	}
	}
}
