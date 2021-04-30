export const makeMil = (val) => {
	return `${Math.round((val / 1000000) * 100) / 100} mil`;
};
