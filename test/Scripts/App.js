/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var makeFolders = __webpack_require__(1);

	var getQueryStringParameter = function (param) {
	    var params = document.URL.split("?")[1].split("&");
	    var strParams = "";

	    for (var i = 0; i < params.length; i = i + 1) {
	        var singleParam = params[i].split("=");

	        if (singleParam[0] == param) {
	            return decodeURIComponent(singleParam[1]);
	        }
	    }
	};

	var appWebUrl = getQueryStringParameter('SPAppWebUrl');

	var options = {
	    'webUrl': appWebUrl,
	    'listTitle': 'TestList',
	    'folderPath': 'Folder 1/Folder 2'
	};

	makeFolders(options, function () {
	    $('#message').html('Folders are createdly successfully. <a href=\'' + appWebUrl + '/Lists/TestList/Folder 1\'>Folder 1</a>, <a href=\'' + appWebUrl + '/Lists/TestList/Folder 1/Folder 2\'>Folder 1/Folder 2</a>');
	}, function (sender, args) {
	    $('#message').text(args.get_message());
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var contextHelper = __webpack_require__(2);
	var folderCreationInformation = __webpack_require__(3);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	function contextHelper(webUrl, crossSite) {
	    var web = null;
	    var site = null;
	    var clientContext = null;
	    var appContextSite = null;

	    if (!webUrl) {
	        clientContext = SP.ClientContext.get_current();
	        web = clientContext.get_web();
	        site = clientContext.get_site();
	    } else if (crossSite) {
	        clientContext = SP.ClientContext.get_current();
	        appContextSite = new SP.AppContextSite(clientContext, webUrl);
	        web = appContextSite.get_web();
	        site = appContextSite.get_site();
	    } else {
	        clientContext = new SP.ClientContext(webUrl);
	        web = clientContext.get_web();
	        site = clientContext.get_site();
	    }

	    return {
	        web: web,
	        site: site,
	        clientContext: clientContext,
	        appContextSite: appContextSite
	    };
	}

	module.exports = contextHelper;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function (folderName, folderUrl) {
	    var listItemCreationInformation = new SP.ListItemCreationInformation();
	    listItemCreationInformation.set_underlyingObjectType(SP.FileSystemObjectType.folder);
	    listItemCreationInformation.set_leafName(folderName);

	    if (folderUrl) {
	        listItemCreationInformation.set_folderUrl(folderUrl);
	    }

	    return listItemCreationInformation;
	}


/***/ }
/******/ ]);