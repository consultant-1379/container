module.exports = function (testRunner) {
    var nameSelector = '.eaContainer-SystemBar-name',
        appContentSelector = '.eaMyApp-content',
        appButtonSelector = '.eaContainer-applicationHolder .ebBtn',
        missingAppSelector = '.eb404Page-body',
        logoutButtonSelector = '.eaContainer-LogoutButton-link';

    testRunner.test('Default name is set to ENM', ['prod', 'dev'], function (test) {
        casper.waitForSelectorTextChange(nameSelector, function () {
            test.assertSelectorHasText(nameSelector, 'ENM');
        });
    });

    testRunner.test('Custom name in config.js/container.config.js', ['prod-custom-name', 'dev-custom-name'], function (test) {
        casper.waitForSelectorTextChange(nameSelector, function () {
            test.assertSelectorHasText(nameSelector, 'foo');
        });
    });

    testRunner.test('Applications can be loaded', ['prod', 'dev', 'backwards-compatibility/libs'], function (test) {
        casper.setHash('myapp');
        casper.waitForSelectorTextChange(appContentSelector, function () {
            test.assertSelectorHasText(appContentSelector, 'JSCore version');
        });
    });

    testRunner.test('Applications can be switched', ['prod', 'dev'], function (test) {
        casper.setHash('myapp');
        casper.waitForSelectorTextChange(appContentSelector, function () {
            test.assertSelectorHasText(appButtonSelector, 'This application is using current version of Brand Assets');
        });
        casper.setHash('myapp2');
        casper.waitForText('This application is using old version of Brand Assets');
    });

    testRunner.test('Title is set', ['prod', 'dev'], function (test) {
        casper.then(function () {
            test.assertTitle('');
        });
        casper.setHash('myapp');
        casper.waitForSelectorTextChange(appButtonSelector);
        casper.then(function () {
            test.assertTitle('My App 1');
        });
        casper.setHash('myapp2');
        casper.waitForText('This application is using old version of Brand Assets');
        casper.then(function () {
            test.assertTitle('My App 2');
        });
    });

    testRunner.test('Assets are loaded', ['dev'], function (test) {
        casper.setHash('myapp');
        casper.waitForSelectorTextChange(appButtonSelector, function () {
            test.assertEvalEquals(function(appButtonSelector) {
                var appBtn = document.querySelector(appButtonSelector);
                return window.getComputedStyle(appBtn).backgroundColor;
            }, 'rgb(9, 102, 179)', 'button should have styles from assets', appButtonSelector);
        });
    });

    testRunner.test('Assets are switched', ['prod', 'backwards-compatibility/assets'], function (test) {
        casper.setHash('myapp');
        casper.waitForText('This application is using current version of Brand Assets');
        casper.waitForSelectorTextChange(appButtonSelector, function () {
            test.assertEvalEquals(function(appButtonSelector) {
                var appBtn = document.querySelector(appButtonSelector);
                return window.getComputedStyle(appBtn).backgroundColor;
            }, 'rgb(9, 102, 179)', 'button should have styles from assets v1', appButtonSelector);
        });
        casper.setHash('myapp2');
        casper.waitForText('This application is using old version of Brand Assets');
        casper.then(function () {
            test.assertEvalEquals(function(appButtonSelector) {
                var appBtn = document.querySelector(appButtonSelector);
                return window.getComputedStyle(appBtn).backgroundColor;
            }, 'rgb(0, 102, 102)', 'button should have styles from assets v2', appButtonSelector);
        });
    });

    testRunner.test('404 page is shown when app doesn\'t exist', ['dev', 'prod'], function (test) {
        casper.setHash('foobar');
        casper.waitForSelectorTextChange(missingAppSelector, function () {
            test.assertSelectorHasText(missingAppSelector, 'Please select Another Application.');
        });
    });

    testRunner.test('Log out button is loaded', ['prod'], function (test) {
        casper.waitForSelectorTextChange(logoutButtonSelector, function () {
            test.assertSelectorHasText(logoutButtonSelector, 'Log Out');
        });
    });

    testRunner.test('Should load child applications', ['dev', 'prod'], function (test) {
        casper.setHash('network-overview');
        casper.waitForText('Network Overview');
        casper.setHash('network-overview/active-alerts');
        casper.waitForText('Active Alerts');
    });
};
