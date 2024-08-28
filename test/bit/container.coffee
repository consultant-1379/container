root = if typeof exports != "undefined" && exports != null then exports else this
container = root.container

describe 'Container', ->
  containerElement = {}
  container = {}

  head = document.head

  beforeEach ->
    containerElement = document.createElement('div')
    container = new root.Container {}, containerElement
    container.baseUrl = '../../apps'
    container.assetsBaseUrl = '../../assets'

  afterEach ->
    if container.listener
      window.removeEventListener('hashchange', container.listener)
      delete this.listener

    head = document.head;
    for key, style of container.assets
      if style.parentNode == head
        style.parentNode.removeChild(style)

    app.stop() for i, app of container.apps

  describe 'Methods', ->
    describe 'load', ->
      it 'should add CSS assets to the <head>', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          onLoad.apply(container, arguments)

          count = 0
          for css in head.childNodes
            if /assets\/assets-v1\/css\/assets.css$/.test css.href
              count = count + 1
          expect(count).to.equal(1)
          done()
        container.load('MyApp')

      it 'should remove previously loaded assets from the <head>', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          onLoad.apply(container, arguments)
          container.onLoad = ->
            onLoad.apply(container, arguments)

            count = 0
            for css in head.childNodes
              if /assets/.test css.href
                count = count + 1
            expect(count).to.equal(1)

            count = 0
            for css in head.childNodes
              if /assets-v2/.test css.href
                count = count + 1
            expect(count).to.equal(1)
            done()
          container.load('MyApp2')
        container.load('MyApp')

      it 'should put an instance of the app into the #container element', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          onLoad.apply(container, arguments)

          expect(containerElement.childNodes[0].className).to.equal('eaMyApp')
          done()
        container.load('MyApp')

      it 'should replace existing app with a new one', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          onLoad.apply(container, arguments)
          container.onLoad = ->
            onLoad.apply(container, arguments)

            expect(containerElement.childNodes.length).to.equal(1)
            expect(containerElement.childNodes[0].className).to.equal('eaMyApp2')
            done()
          container.load('MyApp2')
        container.load('MyApp')

      it 'should restore previous state of an app if it has been loaded before', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          onLoad.apply(container, arguments)
          containerElement.childNodes[0].innerHTML = '<span class="foo"></span>'
          container.onLoad = ->
            onLoad.apply(container, arguments)
            container.onLoad = ->
              onLoad.apply(container, arguments)
              expect(containerElement.childNodes[0].innerHTML).to.equal('<span class="foo"></span>')
              done()
            container.load('MyApp')
          container.load('MyApp2')
        container.load('MyApp')

      it 'should only keep styles belonging to one application', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          onLoad.apply(container, arguments)
          app1styles = (style for style in document.getElementsByTagName('style') when style.textContent != '')
          expect(app1styles.length).to.equal(1)
          containerElement.childNodes[0].innerHTML = '<span class="foo"></span>'
          container.onLoad = ->
            onLoad.apply(container, arguments)
            app2styles = (style for style in document.getElementsByTagName('style') when style.textContent != '')
            expect(app1styles[0]).not.to.equal(app2styles[0])
            container.onLoad = ->
              onLoad.apply(container, arguments)
              app1newStyles = (style for style in document.getElementsByTagName('style') when style.textContent != '')
              expect(app1styles.length).to.equal(app1newStyles.length)
              expect(app1styles[0]).to.equal(app1newStyles[0])
              done()
            container.load('MyApp')
          container.load('MyApp2')
        container.load('MyApp')
