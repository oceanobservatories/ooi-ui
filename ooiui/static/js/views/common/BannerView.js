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
        theMessage += "<div>";
        theMessage += "<p style='font-size:16px;font-weight:bold;text-align:center;padding-top:10px;'>Important Data Update Available Now!</p>";
        theMessage += "</div>";
        theMessage += "<div style='font-size: 16px;text-align:left;padding-top: 10px;'>";
        theMessage += '<p>The OOI Data Teams have undertaken a thorough, program-wide review of all critical metadata in the system. Please follow this <a href="https://oceanobservatories.org/data-issues/ooi-critical-metadata-review/" title="Critical Metadata Review" target="_blank">link</a> to see how the process was conducted and learn if data you have downloaded were impacted.</p>';
        theMessage += "<p></p>";
        theMessage += "</div>";
        theMessage += '<div class="pull-bottom" style="font-size:16px;font-weight:bold;text-align:center;padding-top:10px;">\n';
        theMessage += '<p style="padding-top: 10px;"><input type="checkbox" id="dataupdate"></input><label for="dataupdate" style="padding-left: 5px">Ignore until next update?</label></p>';
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
                let key_data = JSON.parse(data).results[0]
                let key_value = undefined;

                if (key_data !== undefined) {
                    key_value = key_data.value.toLowerCase();
                }

                // console.log('key_value');
                // console.log(key_value);

                // We only want to show the popup message or banner on the home page
                if (window.location.pathname === '/') {
                    // Show the banner if the redis key says so
                    if (key_value === "true") {
                        $('#breaking-news-container').show();
                    } else {
                        $('#breaking-news-container').hide();
                    }

                    //  Show the popup if the user hasn't dismissed it and the redis key is defined
                    if (key_data !== undefined && dataNoticeCookie !== "hide") {
                        daWarningData.show({
                            message: theMessage,
                            type: "info"
                        });

                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
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

