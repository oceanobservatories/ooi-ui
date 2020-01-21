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
    banner: JST['ooiui/static/js/partials/Banner.html'],
    newsBanner: JST['ooiui/static/js/partials/NewsBanner.html']
  },

  changeTitle: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    this.$el.html(this.templates.banner({ isNewsActive:this.checkStreaming() }));
    if (this.checkStreaming() || this.checkOnHomepage() || this.checkDataNoticeCookie()){
      this.$el.find('#news-banner').append(this.templates.newsBanner());
    }
  },

  checkOnHomepage: function() {
      if (window.location.pathname === '/'){
          return true;
      } else {
          return false;
      }
  },

    checkDataNoticeCookie: function() {
        let dataNoticeCookie = Cookies.get('datanotification');
        // console.log('dataNoticeCookie');
        // console.log(dataNoticeCookie);

        let daWarningData = new ModalDialogView();
        let theMessage = '';
        theMessage += "<div style='font-size: 16px;text-align:center;padding-top: 10px;'>";
        theMessage += "<p>Important Data Update Available Now!</p>";
        theMessage += "<p>Please click the OOI Logo to review metadata changes effecting previous data downloads you may have performed.</p>";
        theMessage += "<p></p>";
        theMessage += '<div class="pull-bottom">\n' +
            '        <a href="https://oceanobservatories.org/data-issues/" title="OOI Data Issues" target="_blank">\n' +
            '          <img alt="OOI Data Issues" class="banner-image-icon" src="/img/logos-banners/OOI_Logo.svg" style="">\n' +
            '        </a>\n' +
            '      </div>';
        theMessage += '<p style="padding-top: 10px;"><input type="checkbox" id="dataupdate"></input><label for="dataupdate">Ignore until next update?</label></p>';
        theMessage += "</div>";

        $.ajax({
            url: '/api/cache_keys/custom_cache_metadatanotification',
            type: 'GET',
            async: false,
            success: function(data) {
                var date = new Date();
                date.setTime(date.getTime() + 12500*1000);
                // console.log('checkDataNoticeCookie');
                // console.log(data);
                let key_value = undefined;

                if (JSON.parse(data).results[0] !== undefined) {
                    key_value = JSON.parse(data).results[0].value.toLowerCase();
                }

                // console.log('key_value');
                // console.log(key_value);

                if (key_value === "true" && dataNoticeCookie === undefined) {
                    // Cookies.set('datanotification', 'show', {expires: date, path: '/'});
                    $('#breaking-news-container').show();

                    daWarningData.show({
                        message: theMessage,
                        type: "info"
                    });

                    return true;
                } else if (key_value === "true" && dataNoticeCookie === "show") {
                    $('#breaking-news-container').show();
                    return true;
                } else if (key_value === 'true' && dataNoticeCookie === "hide") {
                    // Cookies.set('datanotification', 'hide', {expires: date, path: '/'});
                    $('#breaking-news-container').hide();
                    return false;
                } else if (key_value === undefined || dataNoticeCookie === "hide") {
                    // Cookies.set('datanotification', 'show', {expires: date, path: '/'});
                    $('#breaking-news-container').hide();
                    return false;
                } else if (dataNoticeCookie === 'show') {
                    $('#breaking-news-container').show();
                    return true;
                } else {
                    $('#breaking-news-container').show();

                    daWarningData.show({
                        message: theMessage,
                        type: "info"
                    });
                }
            }
        });
    },

  checkStreaming: function() {
    var streaming = false;
    // Let's see what time it is
    var currentTime = moment.utc();
    // Compare to the time that streaming is on
    var hoursOn = [3, 6, 9, 12, 15, 18, 21, 24];
    if (hoursOn.indexOf(currentTime.hour()) > -1){
      // Now check if the time falls within the 14 minute duration that video is on
      if (currentTime.minute() < 15){
        streaming = true;
      }
    }
    //return streaming;
    // TODO: Disables the streaming camera banner until there is a programmatic way to determine the state
    return false;
  }
});

