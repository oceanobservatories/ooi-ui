// Define a model with some validation rules
var TroubleTicketModel = Backbone.Model.extend({
    // defaults: {
    //     role_name: "Administrator",
    //     organization: "ASA",
    //     role_id: 0
    // },
      url: '/api/new_event',
      new_event: function() {
        var self = this;
        this.save(null, {
          async: false,
          success: function(model, response, options) {
            var date = new Date();
            date.setTime(date.getTime() + (model.get('expiration') * 1000));
            $.cookie('ooiusertoken', model.get('token'), {expires: date});
          },
          parse: function(response) {
            var expiration = response.expiration;
            console.log("expiration");
            console.log(parseInt(expiration));
            return {
              new_event: this.get('new_event'),
              token: response.token,
              expiration: parseInt(response.expiration),
              password: "",
              attempts: 0 // on success reset attempts, we're logged in
            }
          },
          defaults: {
            new_event: "",
            password: "",
            token: "",
            expiration: "",
            attempts: 0
          }
        });
