var ModalDownloadView= Backbone.View.extend({

  hide: function() {
    this.$el.modal('hide');
  },
  initialize: function() {
    _.bindAll(this, "render", "show" );
    this.render();
  },
  getTimeString: function(time) {
    // time = number of seconds

    // If time is null, don't worry about it
    if (_.isNull(time)){
      return '';
    }

    var baseString = "<p>Your data should be done processing in about ";
    var units;

    if (time > 4200){  // Anything over 70 minutes will have a min 2 hour wait time
      time = Math.ceil(time/3600.0).toString();
      units = ' hours';
    } else if (time > 2700){  // Between 45 and 70 minutes is 1 hour
      time = '1';
      units = ' hour';
    } else if (time > 60){  // Show minutes
      time = Math.ceil(time/60.0).toString();
      units = ' minutes';
    } else {  // Show seconds
      time = time.toString();
      units = ' seconds';
    }
    return baseString + time + units + '.</p>';
  },
  bytesToSize: function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  },
  getSizeString: function(size) {
    // time = number of seconds

    // If time is null, don't worry about it
    if (_.isNull(size)){
      return '';
    }

    var baseString = "<p>Estimated file download size: ";
    var sizes = this.bytesToSize(size);


    return baseString + sizes + '.</p>';
  },
  show: function(url, timeCalculation, sizeCalculation) {
    var timeString = this.getTimeString(timeCalculation);
    var sizeString = this.getSizeString(sizeCalculation);
    this.$el.find('#download-url').html('<p>A link containing your data will be emailed to <b>' + url +'</b></p>');
    this.$el.find('#download-url').append(timeString);
    this.$el.find('#download-url').append(sizeString);
    this.$el.find('#download-ok').modal('show');
  },
  template: JST['ooiui/static/js/partials/ModalDownload.html'],
  render: function() {
    this.$el.html(this.template());
  }
});

