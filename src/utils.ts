export const formatNumber = (value: number): string => {
	if (value < 10) {
		return "0" + value;
	}
	return "" + value;
};
export const formatDateToString = (creationDate: Date) => {
	const hours = formatNumber(creationDate.getHours());
	const minutes = formatNumber(creationDate.getMinutes());
	const day = formatNumber(creationDate.getDate());
	const month = formatNumber(creationDate.getMonth() + 1);
	const year = formatNumber(creationDate.getFullYear());

	return {
		datesortie: day + "/" + month + "/" + year,
		heuresortie: hours + ":" + minutes,
	};
};
