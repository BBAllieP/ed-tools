import "../actionTypes";

const initialState = {
	missions: [
		{
			id: 00001,
			faction: "Faction 1",
			kills: 0,
			needed: 35,
			value: 10000000,
			destination: "System A",
			status: "progress",
		},
		{
			id: 00002,
			faction: "Faction 1",
			kills: 0,
			needed: 25,
			value: 15000000,
			destination: "System A",
			status: "progress",
		},
		{
			id: 00003,
			faction: "Faction 2",
			kills: 4,
			needed: 42,
			value: 25000000,
			destination: "System A",
			status: "progress",
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
