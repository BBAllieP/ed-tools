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
	var tempFact = {};
	var tempFactMis = state[mission.Faction];
	for (var i; i < tempFactMis.length; i++) {
		if (tempFactMis[i].Id === mission.Id) {
			tempFactMis.splice(i, 1);
			tempFact[mission.Faction]= tempFactMis;
			return tempFact;
		}
	}
};

export const changeMission = (state, mission) => {
	var tempState = state;
	var tempFact = state[mission.Faction];
	for (var i; i < tempFact.length; i++) {
		if (tempFact[i].Id === mission.Id) {
			tempState[mission.Faction][i] = mission;
		}
	}
	return tempState;
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
