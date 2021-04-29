export const addMission = (state, mission) => {
	var tempState = state;
	var tempFact;
	var found = false;
	for (const fact in tempState) {
		if (fact.key == mission.Faction) {
			tempFact = fact;
			tempFact = [...fact.Missions, mission];
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
	var tempFact = state[mission.Faction];
	for (var i; i < tempFact.length; i++) {
		if (tempFact[i].Id == mission.Id) {
			tempFact.splice(i, 1);
			return tempFact;
		}
	}
};

export const changeMission = (state, mission) => {
	var tempFact = state[mission.Faction];
	for (var i; i < tempFact.length; i++) {
		if (tempFact[i].Id == mission.Id) {
			tempFact[i] = mission;
		}
	}
	return tempFact;
};
