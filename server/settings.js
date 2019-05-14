var azure = require('azure-storage');
var logger = require('./logger.js');

var storageConnectionString = process.env.STORAGE_CONN_STRING; 
if(typeof(storageConnectionString) === "undefined")
{
    storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=stconsharedwesteu;AccountKey=<put_your_storage_key_here>';
}
var validEmails = process.env.VALID_EMAILS;
if(typeof(validEmails) === "undefined")
{
    validEmails = 'list@of.valid,emails@to.accept';
}

var smtpPort = 25;

function s4()
{
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
};

exports.newGuid = function()
{
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}

exports.storageConnectionString = storageConnectionString;
exports.smtpPort = smtpPort;
exports.blobContainer = 'mcdatablobs';
exports.validEmails = validEmails;