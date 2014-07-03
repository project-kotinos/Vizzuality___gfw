require.config({ 

    paths: {
      jquery: '../vendor/assets/bower_components/jquery/dist/jquery',
      underscore: '../vendor/assets/bower_components/underscore/underscore',
      backbone: '../vendor/assets/bower_components/backbone/backbone',
      d3: '../vendor/assets/bower_components/d3/d3',
      cartodb: '../vendor/assets/bower_components/cartodb/dist/cartodb',
      text: '../vendor/assets/bower_components/requirejs-text/text',
      moment: '../vendor/assets/bower_components/moment/moment',
      mps: '../vendor/assets/bower_components/minpubsub/minpubsub',

      main: '../app/assets/javascripts/map/main',
      gmap: '../app/assets/javascripts/map/gmap',
      store: '../vendor/assets/javascripts/store',
      Class: '../vendor/assets/javascripts/class',
      uri: '../vendor/assets/javascripts/uri',
      utils: '../app/assets/javascripts/map/utils',
      nsa: '../app/assets/javascripts/map/nsa',
      router: '../app/assets/javascripts/map/router',
      presenters: '../app/assets/javascripts/map/presenters',
      views: '../app/assets/javascripts/map/views',
      templates: '../app/assets/javascripts/map/templates',
      services: '../app/assets/javascripts/map/services',
      helpers: '../jstest/helpers',

      spec: '../jstest/spec',
      jasmine: '../jstest/lib/jasmine',
      jasmine_html: '../jstest/lib/jasmine-html',
      jasmine_boot: '../jstest/lib/boot',
      mock_ajax: '../jstest/lib/mock-ajax'
  },

  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone',
    },
    uri: {
      exports: 'UriTemplate',
    },
    Class: {
      exports: 'Class',
    }
  }
});

require([
  'mock_ajax', 
  'main', 
  // 'spec/nsa_spec',
  // 'spec/AnalysisService_spec',
  // 'spec/AnalysisButtonPresenter_spec',
  //'spec/MapLayerService_spec',
  // 'spec/MapPresenter_spec',
  // 'spec/UMDLossLayerPresenter_spec',
  // 'spec/PlaceService_spec',
  'spec/CountryService_spec',
  'spec/AnalysisService_spec'
], function (mock_ajax, main, nsa_spec){
  console.log('Setting up specs...');
});