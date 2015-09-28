var contextHelper = require('sp-context-helper');
var folderCreationInformation = require('sp-folder-creation-information');

function makeFolders(options, done, error) {
    var contextWrapper = contextHelper(options.webUrl, options.useAppContextSite);
    var clientContext = contextWrapper.clientContext;
    var web = contextWrapper.web;
    var list = web.get_lists().getByTitle(options.listTitle);
    var folderNames = options.folderPath.split('/');
    var parentFolderUrl = '';

    if (contextWrapper.webUrl) {
        makeFoldersRecursively(clientContext, options.webUrl, list, options.listTitle, folderNames, parentFolderUrl, options.fieldValues, done, error);
    } else {
        clientContext.load(web);
        clientContext.executeQueryAsync(function () {
            options.webUrl = web.get_url();

            makeFoldersRecursively(clientContext, options.webUrl, list, options.listTitle, folderNames, parentFolderUrl, options.fieldValues, done, error);
        }, error);
    }
}

function makeFoldersRecursively(clientContext, webUrl, list, listTitle, folderNames, parentFolderUrl, fieldValues, done, error) {
    var folderName = folderNames.shift();
    var listItemCreationInformation = folderCreationInformation(folderName, parentFolderUrl);
    var listItem = list.addItem(listItemCreationInformation);

    if (fieldValues) {
        for (var fieldName in fieldValues) {
            if (fieldValues.hasOwnProperty(fieldName)) {
                listItem.set_item(fieldName, fieldValues[fieldName]);
            }
        }
    }

    listItem.update();

    clientContext.load(listItem);
    clientContext.executeQueryAsync(function () {
        if (folderNames.length > 0) {
            if (!parentFolderUrl) {
                parentFolderUrl = webUrl + '/Lists/' + listTitle;
            }

            parentFolderUrl += '/' + folderName;

            makeFoldersRecursively(clientContext, webUrl, list, listTitle, folderNames, parentFolderUrl, fieldValues, done, error);
        } else {
            done();
        }
    }, error);
}

module.exports = makeFolders;
