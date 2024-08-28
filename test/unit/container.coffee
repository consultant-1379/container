root = if typeof exports != "undefined" && exports != null then exports else this
container = root.container

describe 'Container', ->
  containerElement = {}
  container = {}

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
    describe 'listenUrl()', ->
      it 'should call load()', (done) ->
        window.location.hash = 'foo1'
        setTimeout ->
          load = sinon.stub(container, 'load')
          container.listenUrl()
          expect(load.called).to.be.true
          done()
        , 0

    describe 'load()', ->
      it 'should be called on hash change', (done) ->
        load = sinon.stub(container, 'load')
        container.listenUrl()
        expect(load.calledOnce).to.be.true
        setTimeout ->
          window.location.hash = 'foo3'
          setTimeout ->
            expect(load.calledTwice).to.be.true
            load.restore()
            done()
          , 0
        , 0

      it 'should not be called if hash is empty on hash change', (done) ->
        load = sinon.stub(container, 'load')
        container.listenUrl()
        window.location.hash = ''
        setTimeout ->
          expect(load.calledOnce).to.be.true
          load.restore()
          done()
        , 0

      it 'should call onLoad()', (done) ->
        onLoad = container.onLoad
        container.onLoad = ->
          container.onLoad = onLoad
          done()
        container.load('MyApp')

      it 'should call error() if app doesn\'t exist', (done) ->
        error = container.error
        container.error = ->
          container.error = error
          done()
        container.load('foo')

    describe 'error()', ->
      it 'should throw an exception', ->
        container.error = -> throw "error"
        fn = -> container.error()
        expect(fn).to.throw()
