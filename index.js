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
        makeFoldersRecursively(clientContext, web, list, options, folderNames, parentFolderUrl, done, error);
    } else {
        clientContext.load(web);
        clientContext.executeQueryAsync(function () {
            options.webUrl = web.get_url();

            makeFoldersRecursively(clientContext, web, list, options, folderNames, parentFolderUrl, done, error);
        }, error);
    }
}

function makeFoldersRecursively(clientContext, web, list, options, folderNames, parentFolderUrl, done, error) {
    var folderName = folderNames.shift();
    var listItemCreationInformation = folderCreationInformation(folderName, parentFolderUrl);
    var listItem = list.addItem(listItemCreationInformation);

    if (options.fieldValues) {
        for (var fieldName in options.fieldValues) {
            if (options.fieldValues.hasOwnProperty(fieldName)) {
                listItem.set_item(fieldName, options.fieldValues[fieldName]);
            }
        }
    }

    listItem.update();

    clientContext.load(listItem);
    clientContext.executeQueryAsync(function () {
        if (folderNames.length > 0) {
            if (options.useAppContextSite) {
                contextWrapper = contextHelper(options.webUrl, options.useAppContextSite);
                clientContext = contextWrapper.clientContext;
                web = contextWrapper.web;
                list = web.get_lists().getByTitle(options.listTitle);
            }

            if (!parentFolderUrl) {
                parentFolderUrl = options.webUrl + '/Lists/' + options.listTitle;
            }

            parentFolderUrl += '/' + folderName;

            makeFoldersRecursively(clientContext, web, list, options, folderNames, parentFolderUrl, done, error);
        } else {
            done();
        }
    }, error);
}

module.exports = makeFolders;
