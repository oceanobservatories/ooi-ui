// Instantiate the application for this page
var ooi = new OOI();

var vent = _.extend({}, Backbone.Events);

$(document).ready(function() {
    $(".delayImg").each(function() {
        this.onload = function() {
            $(this).animate({opacity: 1}, 2000);
        };
        this.src = this.getAttribute("delayedSrc");
    });

    ooi.start();
});

var bannerTitle = "CHANGE ME";

_.extend(OOI.prototype, Backbone.Events,  {
  login: new LoginModel(),
  views: {},
  collections: {
    organizations: new Organizations(),
  },
  models: {},

  start: function() {
    var self = this;
    this.login.fetch({async:false});
    //--------------------------------------------------------------------------------
    // Views
    //--------------------------------------------------------------------------------
    this.views.banner = new BannerView({bannerTitle});
    $('body').prepend(this.views.banner.el);

    this.views.navbar = new NavbarView({
      el: $('#navbar')
    });
  }
});

