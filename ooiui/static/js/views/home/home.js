// Instantiate the application for this page
var ooi = new OOI();

var vent = _.extend({}, Backbone.Events);

$(document).ready(function() {
    ooi.start().then(null, function() {

        $(".delayImg").each(function() {
            this.onload = function() {
                $(this).animate({opacity: 1}, 2000);
            };
            this.src = this.getAttribute("delayedSrc");
        });

        var map = new L.Map("map", {center: [37.8, -96.9], zoom: 4})
                        .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

        var svgLayer = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

        // fetch the arry collection and then render the map
        var arrayCollection = new ArrayCollection();
        arrayCollection.fetch().then(function() {
            var vectorMap = new VectorMap(map, svgLayer, arrayCollection);
            vectorMap.render();
        });
    });

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

