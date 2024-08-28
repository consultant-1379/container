// Generated by CoffeeScript 1.6.2
(function() {
  var container, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  container = root.container;

  describe('Container', function() {
    var containerElement, head;

    containerElement = {};
    container = {};
    head = document.head;
    beforeEach(function() {
      containerElement = document.createElement('div');
      container = new root.Container({}, containerElement);
      container.baseUrl = '../../apps';
      return container.assetsBaseUrl = '../../assets';
    });
    afterEach(function() {
      var app, i, key, style, _ref, _ref1, _results;

      if (container.listener) {
        window.removeEventListener('hashchange', container.listener);
        delete this.listener;
      }
      head = document.head;
      _ref = container.assets;
      for (key in _ref) {
        style = _ref[key];
        if (style.parentNode === head) {
          style.parentNode.removeChild(style);
        }
      }
      _ref1 = container.apps;
      _results = [];
      for (i in _ref1) {
        app = _ref1[i];
        _results.push(app.stop());
      }
      return _results;
    });
    return describe('Methods', function() {
      return describe('load', function() {
        it('should add CSS assets to the <head>', function(done) {
          var onLoad;

          onLoad = container.onLoad;
          container.onLoad = function() {
            var count, css, _i, _len, _ref;

            onLoad.apply(container, arguments);
            count = 0;
            _ref = head.childNodes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              css = _ref[_i];
              if (/assets\/assets-v1\/css\/assets.css$/.test(css.href)) {
                count = count + 1;
              }
            }
            expect(count).to.equal(1);
            return done();
          };
          return container.load('MyApp');
        });
        it('should remove previously loaded assets from the <head>', function(done) {
          var onLoad;

          onLoad = container.onLoad;
          container.onLoad = function() {
            onLoad.apply(container, arguments);
            container.onLoad = function() {
              var count, css, _i, _j, _len, _len1, _ref, _ref1;

              onLoad.apply(container, arguments);
              count = 0;
              _ref = head.childNodes;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                css = _ref[_i];
                if (/assets/.test(css.href)) {
                  count = count + 1;
                }
              }
              expect(count).to.equal(1);
              count = 0;
              _ref1 = head.childNodes;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                css = _ref1[_j];
                if (/assets-v2/.test(css.href)) {
                  count = count + 1;
                }
              }
              expect(count).to.equal(1);
              return done();
            };
            return container.load('MyApp2');
          };
          return container.load('MyApp');
        });
        it('should put an instance of the app into the #container element', function(done) {
          var onLoad;

          onLoad = container.onLoad;
          container.onLoad = function() {
            onLoad.apply(container, arguments);
            expect(containerElement.childNodes[0].className).to.equal('eaMyApp');
            return done();
          };
          return container.load('MyApp');
        });
        it('should replace existing app with a new one', function(done) {
          var onLoad;

          onLoad = container.onLoad;
          container.onLoad = function() {
            onLoad.apply(container, arguments);
            container.onLoad = function() {
              onLoad.apply(container, arguments);
              expect(containerElement.childNodes.length).to.equal(1);
              expect(containerElement.childNodes[0].className).to.equal('eaMyApp2');
              return done();
            };
            return container.load('MyApp2');
          };
          return container.load('MyApp');
        });
        it('should restore previous state of an app if it has been loaded before', function(done) {
          var onLoad;

          onLoad = container.onLoad;
          container.onLoad = function() {
            onLoad.apply(container, arguments);
            containerElement.childNodes[0].innerHTML = '<span class="foo"></span>';
            container.onLoad = function() {
              onLoad.apply(container, arguments);
              container.onLoad = function() {
                onLoad.apply(container, arguments);
                expect(containerElement.childNodes[0].innerHTML).to.equal('<span class="foo"></span>');
                return done();
              };
              return container.load('MyApp');
            };
            return container.load('MyApp2');
          };
          return container.load('MyApp');
        });
        return it('should only keep styles belonging to one application', function(done) {
          var onLoad;

          onLoad = container.onLoad;
          container.onLoad = function() {
            var app1styles, style;

            onLoad.apply(container, arguments);
            app1styles = (function() {
              var _i, _len, _ref, _results;

              _ref = document.getElementsByTagName('style');
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                style = _ref[_i];
                if (style.textContent !== '') {
                  _results.push(style);
                }
              }
              return _results;
            })();
            expect(app1styles.length).to.equal(1);
            containerElement.childNodes[0].innerHTML = '<span class="foo"></span>';
            container.onLoad = function() {
              var app2styles;

              onLoad.apply(container, arguments);
              app2styles = (function() {
                var _i, _len, _ref, _results;

                _ref = document.getElementsByTagName('style');
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  style = _ref[_i];
                  if (style.textContent !== '') {
                    _results.push(style);
                  }
                }
                return _results;
              })();
              expect(app1styles[0]).not.to.equal(app2styles[0]);
              container.onLoad = function() {
                var app1newStyles;

                onLoad.apply(container, arguments);
                app1newStyles = (function() {
                  var _i, _len, _ref, _results;

                  _ref = document.getElementsByTagName('style');
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    style = _ref[_i];
                    if (style.textContent !== '') {
                      _results.push(style);
                    }
                  }
                  return _results;
                })();
                expect(app1styles.length).to.equal(app1newStyles.length);
                expect(app1styles[0]).to.equal(app1newStyles[0]);
                return done();
              };
              return container.load('MyApp');
            };
            return container.load('MyApp2');
          };
          return container.load('MyApp');
        });
      });
    });
  });

}).call(this);
