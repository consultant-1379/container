module.exports = {

    printClasses: function (classes, projectRoot) {
        var outputClassesString = '<h3><a href="' + projectRoot + '">Container</a></h3><ul>',
            className, classLine;

        for (var i = 0; i < classes.length; i++) {
            var classObj = classes[i];

            if (classObj.access === 'private') {
                continue;
            }

            className = classObj.name;
            classLine = '<li><a href="' + projectRoot + 'classes/' + className + '.html">' + className + '</a></li>';
            outputClassesString += classLine;
        }
        outputClassesString += '</ul>';

        return outputClassesString;
    },

    parseClassName: function (className) {
        return className;
    },

    ifNotPrivate: function (key, options) {
        if (key !== 'private') {
            return options.fn(this);
        }
    },

    printExample: function (example, options) {
        var regex = /<pre[\s\S]*<\/pre>/;
        var matches = example.match(regex);

        if (!matches) {
            example = example.replace(/<p(?:.*?)>/g, '');
            example = example.replace(/<\/p>/g, '');
            example = example.replace(/</g, '&lt;');
            example = example.replace(/>/g, '&gt;');
            example = example.replace(/(\".*?\")/g, '<span class="str">' + '$1' + '</span>');
            example = example.replace(/(new|this|return|var |if|function)/g, '<span class="kwd">' + '$1' + '</span>');
            example = '<pre class="code prettyprint prettyprinted"><code>' + example + '</code></pre>';
        }

        return example;
    }
};