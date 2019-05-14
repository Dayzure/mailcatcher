var simplesmtp = require("simplesmtp");
var MailParser = require("mailparser").MailParser;
var persister = require('./persister.js');
var logger = require('./logger.js');
var settings = require('./settings.js');

var validEmails = settings.validEmails;

var smtp = simplesmtp.createServer({ disableDNSValidation: true, SMTPBanner: 'MailCatcher 0.1' });
smtp.listen(settings.smtpPort);

// Set up recipient validation function
smtp.on("validateRecipient", function (connection, email, done)
{
    logger.info('validating e-mail: ' + email);
    if (validEmails.indexOf(email) < 0)
    {
        logger.warning('Invliad recipient: ' + email);
        done(new Error("Invalid recipient"));
    }
    else
    {
        connection.customEmail = email;
        done();
    }
});

smtp.on("startData", function (connection)
{
    logger.info("onStartData");
    connection.parser = new MailParser();
    // setup an event listener when the parsing finishes
    connection.parser.on('data', data => {
        logger.info("onData from parser");
        if (data.type === 'text') {
            logger.info("onData :: text: " + data.text)
            logger.info(data);
            persister.saveMail(data, connection.customEmail);
        }
        if (data.type === 'attachment') {
            console.log(data.filename);
            data.content.pipe(process.stdout);
            data.content.on('end', () => data.release());
        }
    });

    connection.parser.on("end", function (mail_object)
    {
        logger.info("Parser data ended - should save");
    });
});

smtp.on("data", function (connection, chunk)
{
    logger.info("onData");
    connection.parser.write(chunk);
});

smtp.on("dataReady", function (connection, done)
{
    logger.info('recieved email form ' + connection.from + ', addressed to: ' + connection.to.join(', '));
    connection.parser.end();

    done();
    console.log("Delivered message by " + connection.from +
    	" to " + connection.to.join(", ") + ", sent from " + connection.host +
    	" (" + connection.remoteAddress + ")");
});