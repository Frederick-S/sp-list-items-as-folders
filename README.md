# sp-list-items-as-folders
Create SharePoint list items as folders recursively.

## Installation
```
npm sp-list-items-as-folders --save
```

## Usage
```js
var makeFolders = require('sp-list-items-as-folders');

var options = {
    'webUrl': 'web url',
    'listTitle': 'list title',
    'folderPath': 'Folder 1/Folder 2',
    'useAppContextSite': false,
    'fieldValues': {
        'Title': 'title'
    }
};

makeFolders(options, function () {
    // Do something
}, function (sender, args) {
    // Error
}):
```

## License
MIT.
