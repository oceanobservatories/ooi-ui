"use strict"
var browser = function() {
    // Return cached result if avalible, else get result then cache it.
    if (browser.prototype._cachedResult)
        return browser.prototype._cachedResult;

    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isChrome = !!window.chrome && !isOpera;// Chrome 1+
    var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
    //EDGE is reporting as chrome
    return (browser.prototype._cachedResult =
        isOpera ? 'Opera' :
        isFirefox ? 'Firefox' :
        isSafari ? 'Safari' :
        isChrome ? 'Chrome' :
        isIE ? 'IE' :
        '');
};
if(browser()=="IE" ||browser()=="Opera" ) document.location = "/notsupported";

var BannerView = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, "render");
    this.render();
  },
  
  templates: {
    banner: JST['ooiui/static/js/partials/Banner.html']
  },

  render: function() {
    this.$el.html(this.templates.banner());
  }
});

