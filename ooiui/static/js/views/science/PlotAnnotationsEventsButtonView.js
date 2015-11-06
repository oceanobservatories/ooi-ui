/*
 * ooiui/static/js/views/common/ModalDialogView.js
 * Events for annotations and event plot buttons
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/PlotAnnotationsEventsButtons.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 */

var PlotAnnotationsEvents = Backbone.View.extend({
  events: {
    'click #plot-annotations' : 'onPlotAnnotations',
    'click #plot-events'      : 'onPlotEvents',
  },
  initialize: function() {
    this.render();
  },
  onPlotAnnotations: function() {
    ooi.trigger('PlotAnnotations')
  },
  onPlotEvents: function() {
    ooi.trigger('PlotEvents')
  },
  template: JST['ooiui/static/js/partials/PlotAnnotationsEventsButtons.html'],
  render: function() {
    this.$el.html(this.template);
  }
});

