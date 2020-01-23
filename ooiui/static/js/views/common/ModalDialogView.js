"use strict";
/*
 * ooiui/static/js/views/common/ModalDialogView.js
 * Model definitions for Arrays
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/ModalDialog.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var ModalDialogView = Backbone.View.extend({
  className: 'modal fade',
  events: {
    'hidden.bs.modal' : 'hidden',
    'click #dataupdate' : 'setDataUpdateCookie'
  },
  hide: function() {
    this.$el.modal('hide');
  },
  hidden: function(e) {
    if(this.ack) {
      this.ack();
    }
  },
  setDataUpdateCookie: function(e) {
    var date = new Date();
    date.setTime(date.getTime() + 12500*1000);

    if(e.target.checked === true){
      // console.log('checked');
      Cookies.set('datanotification', 'hide', {expires: date, path: '/'});
    } else {
      // console.log('unchecked');
      Cookies.set('datanotification', 'show', {expires: date, path: '/'});
    }
  },
  setDataUpdateCookie2: function(e) {
    // console.log(e);

    // TODO: Get end date and whether to force the cookie and apply to the date and if statements below.

    // Here I should be able to get the custom_cache_metadatanotification key TTL and if >0 keep the banner
    // if True force popup to show
    // if False don't force the popup
    // if TTL <=0 or key missing don't popup or show banner

    let forcePopup = false;
    let showBanner = true;

    $.ajax({
      url: '/api/cache_keys/custom_cache_metadatanotification',
      type: 'GET',
      async: false,
      success: function(data) {
        // console.log(data);
        let key_value = JSON.parse(data).results[0].value.toLowerCase();
        // console.log(key_value);

        var date = new Date();
        date.setTime(date.getTime() + 12500*1000);

        if(e.target.checked === true || key_value === "false"){
          // console.log('checked');
          Cookies.set('datanotification', 'hide', {expires: date, path: '/'});
          // console.log(Cookies.get('datanotification'));
          $('#breaking-news-container').hide();
        } else {
          // console.log('unchecked');
          Cookies.set('datanotification', 'show', {expires: date, path: '/'});
          // console.log(Cookies.get('datanotification'));
          $('#breaking-news-container').show();
        }
      }
    });
  },
  initialize: function() {
    _.bindAll(this, "render", "show", "hidden");
  },
  show: function(options) {
    if(!options) {
      options = {};
    }
    if(options && typeof options.ack == "function") {
      this.ack = options.ack.bind(this);
    }
    this.render(options);
    if(options.type && options.type == "danger") {
      this.$el.find('.modal-content').addClass('alert alert-danger');
    } else if(options.type && options.type == "success") {
      this.$el.find('.modal-content').addClass('alert alert-success');
    } else if(options.type && options.type == "info") {
      this.$el.find('.modal-content').addClass('alert alert-info');
    } else if(options.type && options.type == "warning") {
      this.$el.find('.modal-content').addClass('alert alert-warning');
    }

    this.$el.modal('show');
  },
  template: JST['ooiui/static/js/partials/ModalDialog.html'],
  render: function(options) {
    if (options.title === undefined){
      options.title = 'OOI System Message';
    }
    this.$el.html(this.template(options));
  }
});

