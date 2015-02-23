/**
 * The Analysis view.
 *
 * @return Analysis view
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/AnalysisResultsPresenter',
  'text!map/templates/analysisResults.handlebars',
  'text!map/templates/analysisResultsFailure.handlebars',
  'text!map/templates/analysisResultsUnavailable.handlebars',
  'text!map/templates/analysisResultsLoading.handlebars',
], function(_, Handlebars, Presenter, tpl, failureTpl, unavailableTpl, loadingTpl) {

  'use strict';

  var AnalysisResultsModel = Backbone.Model.extend({
    defaults: {
      boxHidden: true
    }
  });


  var AnalysisResultsView = Backbone.View.extend({

    el: '#analysis-result',

    template: Handlebars.compile(tpl),

    templates: {
      failure: Handlebars.compile(failureTpl),
      unavailable: Handlebars.compile(unavailableTpl),
      loading: Handlebars.compile(loadingTpl)
    },

    events:{
      'click #analysis-delete': '_deleteAnalysis',
      'click #analysis-subscribe': '_subscribe',
      'click .download-links span' :'_toggleDownloads',
    },

    initialize: function() {
      this.model = new AnalysisResultsModel();
      this.presenter = new Presenter(this);
      this._cacheSelector();
    },

    _cacheSelector: function() {
      this.$tab = $('#analysis-tab');
      this.$resultsHide = $('.results-hide');
      this.$downloadDropdown = this.$('.download-dropdown');
      this.$subscribeButton = this.$('#subscribeButton');
      this.$subscribeButton_title = this.$('#subscribeButton-title');
    },

    /**
     * Render analysis results.
     *
     * @param  {Object} params Analysis html params
     */
    renderAnalysis: function(params) {
      this.params = params;
      this.$resultsHide.addClass('hidden');
      this.$el.html(this.template(params)).removeClass('hidden');
      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + this.params.layer.title);

    },

    /**
     * Render loading analysis message.
     */
    renderLoading: function() {
      //this._update(this.templates.loading());
    },

    renderUnavailable: function() {
      //this._update(this.templates.unavailable());
    },

    toggleSubscribeButton: function(toggle) {
      this.$subscribeButton.toggleClass('disabled', toggle);
      this.$subscribeButton_title.toggleClass('disabled', toggle);
    },

    /**
     * Render failure analysis request message.
     */
    renderFailure: function() {
      this._update(this.templates.failure());
    },

    _deleteAnalysis: function() {
      this.$resultsHide.removeClass('hidden');
      this.$el.addClass('hidden');
      this.presenter.deleteAnalysis();
      ga('send', 'event', 'Map', 'Delete-Analysis', 'Layer: ' + this.params.layer.title);
    },
    _subscribe: function() {
      this.presenter.subscribeAnalysis();
      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + this.params.layer.title);
    },

    _toggleDownloads: function() {
      this.$downloadDropdown.toggleClass('hidden');
      ga('send', 'event', 'Map', 'Download', 'Downloads-' + 'Layer: ' + this.params.layer.title);
    }
  });

  return AnalysisResultsView;

});
