const winston = require('winston');
const chalk = require('chalk').default;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      let coloredMessage;
      switch (level) {
        case 'error':
          coloredMessage = chalk.red(message);
          break;
        case 'warn':
          coloredMessage = chalk.yellow(message);
          break;
        case 'info':
          coloredMessage = chalk.green(message);
          break;
        case 'debug':
          coloredMessage = chalk.blue(message);
          break;
        default:
          coloredMessage = message; // Default to no color
      }
      return `${timestamp} ${level.toUpperCase()}: ${coloredMessage}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console() // Console transport will now use the custom format
  ],
});

module.exports = logger;
