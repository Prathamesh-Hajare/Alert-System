const winston = require("winston");
const path = require("path");

// Define the path for the log file where logs will be saved
const logPath = path.join(__dirname, "..", "logs", "alert_system.log");

// Create a winston logger with custom settings
const logger = winston.createLogger({
	level: "info",

	// Format the log messages to include timestamp and a custom format
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level.toUpperCase()}: ${message}`;
		})
	),

	// Define where the log messages will be output: a log file and console
	transports: [
		new winston.transports.File({ filename: logPath }),
		new winston.transports.Console(),
	],
});

module.exports = logger;
