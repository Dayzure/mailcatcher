var azure = require('azure-storage');
var sanitizer = require("sanitizer");
var logger = require('./logger.js');
var settings = require('./settings.js');

const blobService  = azure.createBlobService(settings.storageConnectionString);

exports.saveMail = function (mail, originalReceiver)
{
    logger.info("Saving mail...");
    var htmlBody = mail.html;
    if (typeof (htmlBody) === "undefined" || htmlBody == null || htmlBody.length < 10)
    {
        htmlBody = mail.text;
    }

    htmlBody = '<pre>' + htmlBody + '</pre>';

    var blobName = settings.newGuid() + '.html';

    var options = {
        contentSettings:
            {
                contentType: 'text/html; charset=utf-8'
            }
    };

    blobService.createBlockBlobFromText(settings.blobContainer, blobName, htmlBody, options, function (error)
    {
        if (!error)
        {
            logger.info('should have uploaded to ' + settings.blobContainer + '/' + blobName);
        }
        else
        {
            logger.error('Could not save html body of e-mail ' + error);
            process.stdout.write('Could not save html body of e-mail ' + error);
            console.log(error);
        }
    });

    var plainBody = '';
    if (typeof (mail.text) == 'undefined' && typeof (mail.html) != 'undefined')
    {
        plainBody = stripHTML(mail.html);
    }
    else
    {
        plainBody = stripHTML(mail.text);
    }
    plainBody = plainBody.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    logger.info('PlainBody: \n' + plainBody + '\n========================');

}

function stripHTML(html)
{
    html = html.replace("<br/>", "\n");
    html = html.replace("<br />", "\n");
    html = html.replace("</p>", "</p>\n");
    var clean = sanitizer.sanitize(html, function (str)
    {
        return str;
    });
    // Remove all remaining HTML tags.
    clean = clean.replace(/<(?:.|\n)*?>/gm, "");

    // RegEx to remove needless newlines and whitespace.
    // See: http://stackoverflow.com/questions/816085/removing-redundant-line-breaks-with-regular-expressions
    clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");

    // Return the final string, minus any leading/trailing whitespace.
    return clean.trim();
}

function dumpHeaders(hdrs)
{
    
}