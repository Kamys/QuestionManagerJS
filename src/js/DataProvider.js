const DataProvider = (function () {
    let instance;

    function Singleton() {
        if (instance) return instance;
        instance = this;
    }

    Singleton.prototype.getTests = function () {
        return JSON.parse($.cookie("test-data"));
    };

    Singleton.prototype.saveTest = function (dataTest) {
        const testJson = JSON.stringify(dataTest);
        $.cookie("test-data", testJson);
    };

    Singleton.prototype.saveCurrentTest = function (dataTest) {
        const testJson = JSON.stringify(dataTest);
        $.cookie("current-test", testJson);
    };

    Singleton.prototype.getCurrentTest = function () {
        return JSON.parse($.cookie("current-test"));
    };

    return Singleton;
})();