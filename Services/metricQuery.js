const runMetricQuery = async (query) => {
	return new Promise((resolve) => {
		const simulatedMetricValue = Math.random() * 100;
		const randomSleep = Math.floor(Math.random() * 1000);

		setTimeout(() => {
			resolve(simulatedMetricValue);
		}, randomSleep);
	});
};

module.exports = runMetricQuery;
