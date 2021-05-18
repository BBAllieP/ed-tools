export const addMission = (state, mission) => {
	var tempState = state;
	var tempFact;
	var found = false;
	for (const fact in tempState) {
		if (fact.key === mission.Faction) {
			tempFact={};
			tempFact = fact;
			tempFact[fact.key] = [...fact.Missions, mission];
			found = true;
		}
	}
	if (!found) {
		var factName = `${mission.Faction}`;
		tempFact = {};
		tempFact[factName] = [mission];
	}
	return tempFact;
};

export const removeMission = (state, mission) => {
	//var factMissions = [...state[mission.Faction]];
	//console.log(factMissions);
	return state[mission.Faction].filter((mis) => {
		if (mis.MissionID === mission.MissionID) {
			return false;
		} else {
			return true;
		}
	})
};

export const changeMission = (state, mission) => {
	//var factMissions = [];
	var factMissions = [...state[mission.Faction]];
	//console.log(factMissions);
	return factMissions.map((mis)=> {
		if(mis.MissionID === mission.MissionID){
			return {...mission};
		} else {
			return {...mis};
		}
	})
};

export const translateFactions = (factions) => {
	let tempFact = {};
	if(factions != null){
		factions.forEach((f) => {
		tempFact[f.Name] = f.Missions;
	});
	}
	
	return tempFact;
};
