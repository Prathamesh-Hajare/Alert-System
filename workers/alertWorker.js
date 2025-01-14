const { parentPort, workerData } = require("worker_threads");
const runMetricQuery = require("../Services/metricQuery.js");
const logger = require("../Services/logger.js");

// Function to evaluate the alert condition based on the metric value
const evaluateAlert = async (alert) => {
	const { id, metric_query, condition_operator, condition_value } = alert;

	// query to get metric value
	const metricValue = await runMetricQuery(metric_query);

	let conditionMet = false;
	// Check the condition operator and evaluate the metric value against the threshold
	switch (condition_operator) {
		case ">":
			conditionMet = metricValue > condition_value;
			break;
		case "<":
			conditionMet = metricValue < condition_value;
			break;
		default:
			// log an error if operator not recognized
			logger.error(`Unknown condition operator: ${condition_operator}`);
			break;
	}

	// Get the current timestamp for when the alert was evaluated
	const timestamp = new Date();
	if (conditionMet) {
		logger.info(`Alert ${id} triggered at ${timestamp}`);
	} else {
		logger.info(`Alert ${id} did not trigger at ${timestamp}`);
	}
};

// Evaluate the alert and notify the parent thread once done
evaluateAlert(workerData.alert).then(() => parentPort.postMessage("done"));
