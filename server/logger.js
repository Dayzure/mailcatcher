const winston = require('winston');
const wLogger = winston.createLogger({
    transports: [
      new winston.transports.Console()
    ]
  });

exports.info = function(message)
{
    wLogger.info(message);
}
exports.warning = function (message)
{
    wLogger.warn(message);
}
exports.error = function (message)
{
    wLogger.error(message);
}