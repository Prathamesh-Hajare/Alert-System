# Scalable Alert Notification System

## Overview

The **Scalable Alert Notification System** is designed to handle the evaluation and notification of millions of alerts in real-time, ensuring timely processing without any lag. Alerts are evaluated based on defined intervals, metric queries, and conditions. The system uses parallel processing to evaluate alerts concurrently, detects lag, and provides real-time monitoring.

### Key Features:

- **Parallel Processing**: Process multiple alerts concurrently using worker threads.
- **Efficient Scheduling**: Alerts are evaluated at precise intervals using a scheduler.
- **Lag Detection and Debugging**: Logs and alerts administrators when processing delays exceed predefined thresholds.
- **Simulated Metric Query Execution**: Simulate real-time metric query delays to test the system’s response to lag.
- **Error Logging**: Track execution times and log any delays in processing.

---

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development and asynchronous processing.
- **JavaScript**: Language for implementing the system's logic, workers, and query simulation.
- **setInterval / setTimeout**: For scheduling alert evaluations at precise intervals.
- **File System (fs)**: For managing alert logs and system files.

---

## Prerequisites

- Node.js v14+ or higher
- node-cron for scheduling alerts
- worker_threads for managing alert processing
- chalk for colorful logging
- fs and path for file handling

---

## Project Structure

```bash
alert-system/
│
├── config/
│   └── config.js           # Configuration for the alert system (intervals, thresholds)
│
├── workers/
│   └── worker.js           # Worker logic for parallel processing of alerts
│
├── logs/
│   └── alert_system.log    # Log file for recording alert evaluations and errors
│
├── alerts/
│   └── alerts.json         # File containing the alerts in JSON format
│
├── index.js                # Main entry point to run the system
├── package.json            # Node.js dependencies and scripts
└── README.md               # This file
```

# Installation

**Clone the repository:**

```bash
git clone https://github.com/Prathamesh-Hajare/alert-system.git
cd alert-system
```

**Install dependencies:**

```bash
npm install
```

**Create the required alerts.json file inside the alerts folder with the following structure:**

```bash
{
  "alert1": {
    "interval": 1,
    "message": "CPU usage is high"
  },
  "alert2": {
    "interval": 5,
    "message": "Memory usage is critical"
  }
}
```

**Set up a configuration file in the config folder (config.js):**

```bash
module.exports = {
  LAG_THRESHOLD: 1000, // in milliseconds
  SUMMARY_INTERVAL: 60000 // 1 minute (in milliseconds) to display summary
};
```

**Start the alert system by running:**

```bash
node index.js
```

The system will read the alert configurations from alerts/alerts.json, schedule them based on their defined intervals, and evaluate them in worker threads.

The system will log each evaluation's success or lag and display a summary of evaluations every configured interval (defined in config.js).

## How It Works

### Alert Scheduling:

- Alerts are configured with an evaluation interval (in minutes). For example, an alert with an interval of `5` will be evaluated every 5 minutes.
- The scheduler uses `setInterval()` to trigger each alert evaluation at the defined interval.

### Parallel Evaluation:

- Worker threads (`worker.js`) handle multiple alert evaluations concurrently. Each alert is assigned a worker to execute the metric query and check if the condition is met.

### Simulating Metric Query Delays:

- The system simulates metric query delays by introducing random sleep intervals using `setTimeout()` to mimic real-time query latencies.

### Lag Detection:

- Each alert’s scheduled and actual execution time is logged. The system compares these timestamps to detect lag.
- If the delay exceeds the configured threshold, an error is logged.

### Result Notification:

- If the condition for an alert is met, a notification (in this case, a simple log) is generated.

---

## Monitoring and Debugging

### Logs

- **Detailed Logs**:  
  Logs are stored in `logs/alert_system.log`, containing:

  - Scheduled time of the alert
  - Actual time of the alert evaluation
  - Time lag (if any)
  - Alert evaluation status (success or failure)
  - Any errors encountered during evaluation

- **Centralized Log File**:  
  Logs are written into a single log file for easy monitoring and debugging.

### Success, Failure, and Lag Monitoring

- **Success Evaluations**:  
  When an alert is evaluated on time and meets its condition, it is logged as a success.

- **Failure Evaluations**:  
  If an alert evaluation fails to meet its condition (e.g., metric query fails or the condition is not satisfied), it is logged as a failure.

- **Lag Detection**:  
  The system checks if an alert is processed on time by comparing the scheduled and actual execution timestamps. If the processing exceeds a certain delay (set by `LAG_THRESHOLD`), it logs a lag event.

---
