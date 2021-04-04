const countLocations = (inArr) => {
	var outArr = [];
	inArr.forEach((el) => {
		if (outArr.length == 0) {
			outArr.push({ name: el.destination, missions: 1 });
		} else {
			outArr.forEach((out, ind) => {
				if (el.destination == out.destination) {
					outArr[ind] = {
						name: el.destination,
						missions: outArr[ind].missions + 1,
					};
				}
			});
		}
	});
};
