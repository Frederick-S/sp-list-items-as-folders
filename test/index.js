var makeFolders = require('../index.js');

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
