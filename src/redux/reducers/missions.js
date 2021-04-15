import "../actionTypes";

const initialState = {
	factions: [
		{
			name: "Faction 1",
			missions: [
				{
					id: 00001,
					faction: "Faction 1",
					targetFaction: "Targets",
					kills: 0,
					needed: 35,
					value: 10000000,
					destination: "System A",
					status: "progress",
					isWing: true,
				},
				{
					id: 00002,
					faction: "Faction 1",
					targetFaction: "Targets",
					kills: 0,
					needed: 25,
					value: 15000000,
					destination: "System A",
					status: "progress",
					isWing: true,
				},
			],
		},
		{
			name: "Faction 2",
			missions: [
				{
					id: 00003,
					faction: "Faction 2",
					targetFaction: "Targets",
					kills: 4,
					needed: 42,
					value: 25000000,
					destination: "System A",
					status: "progress",
					isWing: true,
				},
			],
		},
	],
};

export default function (state = initialState, action) {
	switch (action.type) {
		default: {
			return state;
		}
	}
}
