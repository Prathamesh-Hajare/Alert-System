const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { Worker } = require("worker_threads");
const logger = require("./Services/logger.js");
const config = require("./config/config");

let chalk;
(async () => {
	chalk = await import("chalk");
})();

// Defined a path to read alert configuration
const alertsFilePath = path.join(__dirname, "alerts", "alerts.json");
const alerts = JSON.parse(fs.readFileSync(alertsFilePath, "utf8"));

// Initialize counters for lagged, failed, and successful alerts
let laggedCount = 0;
let failedCount = 0;
let successCount = 0;

// Function to schedule and manage alerts based on their defined intervals
const scheduleAlert = (alert, id) => {
	const intervalInMinutes = alert.interval;
	const cronExpression = `*/${intervalInMinutes} * * * *`; // Create cron expression

	// Schedule the task
	cron.schedule(cronExpression, () => {
		const scheduledTime = new Date();
		logger.info(`Scheduled evaluation for alert ${id} at ${scheduledTime}`);

		// Create a new worker
		const worker = new Worker("./workers/alertWorker.js", {
			workerData: { alert: { ...alert, id } },
		});

		// Handle the message from the worker and calculate any lag in execution time
		worker.on("message", () => {
			const actualTime = new Date();
			const lag = actualTime - scheduledTime;

			// Log lag if it exceeds the threshold defined in config
			if (lag > config.LAG_THRESHOLD) {
				laggedCount++;
				logger.error(
					`ALERT ${id} LAG DETECTED: Scheduled: ${scheduledTime}, Actual: ${actualTime}, Lag: ${lag} ms`
				);
			} else {
				successCount++;
				logger.info(
					`ALERT ${id} evaluation complete at ${actualTime}. Lag: ${lag} ms`
				);
			}
		});

		// Handle errors in worker thread
		worker.on("error", (error) => {
			failedCount++; // Increment failed count
			logger.error(`Worker error for alert ${id}: ${error.message}`);
		});
	});
};

// Iterate through each alert and schedule its evaluation
Object.entries(alerts).forEach(([id, alert]) => {
	scheduleAlert(alert, id);
});

// Function to log the final summary of the alert evaluations
const logFinalSummary = () => {
	logger.info(
		`Evaluation Summary: ${chalk.default.green(
			"Success"
		)}: ${successCount}, ${chalk.default.yellow(
			"Lagged"
		)}: ${laggedCount}, ${chalk.default.red("Failed")}: ${failedCount}`
	);
};

// Optionally, log the summary at a specific interval or when the application is terminating
setInterval(logFinalSummary, 60000);
