"use strict";
var ParentView = Backbone.View.extend({
    /* Parent class for the asset views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else { this.$el.html(this.template()); }
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        if (this.model)
            this.model.off();
    }
});


//Asset event detail view.
var AssetEventsTableView = ParentView.extend({
    /* This view lists out all the events associated with the asset.
     * A special note: when clicking the Calibration Event, the calibration
     * coeffcients will display.
     * - initialize()
     */
    template: JST['ooiui/static/js/partials/AssetEventsTable.html'],
    initialize: function() {
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    }
});


var AssetEventItemParentView = ParentView.extend({
    tagName: 'tbody',
    initialize: function() {
        _.bindAll(this, 'edit');
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    },
    events: {
        "click .edit-event": "edit"
    },
    edit: function(e) {
        e.preventDefault();

        // before editing the asset, make sure it's up to date.
        this.model.fetch();
        var eventEditorModal = new EventEditorModalView({ model:this.model });
        $(eventEditorModal.render().el).appendTo('#eventEditorModal');
        $('#eventEditorModal').modal('show');
        eventEditorModal.loadControls();
        eventEditorModal.populateFields();
        return this;
    }
});
var AssetDeploymentEventItemView = AssetEventItemParentView.extend({
    template: JST['ooiui/static/js/partials/AssetDeploymentEventItem.html'],
});
var AssetCalibrationEventItemView = AssetEventItemParentView.extend({
    template: JST['ooiui/static/js/partials/AssetCalibrationEventItem.html'],
});


var ParentEventModalView = ParentView.extend({
    initialize: function() {
        _.bindAll(this, 'save', 'loadControls', 'getFields');
    },
    loadControls: function() {
    },
    //Get the values of all of the input fields and return an object representing the data.
    getFields: function(){
        var fields = {},
            inputs = this.$el.find('input'),
            selectInputs = this.$el.find('select'),
            i, input, select;

        for (i = 0, input; i < inputs.length; i++){
            input = $(inputs[i]);
            fields[input.attr('id')] = input.val();
        }

        for (i = 0, select; i < selectInputs.length; i++){
            select = $(selectInputs[i]);
            fields[select.attr('id')] = select.val();
        }

        return fields;
    },
    save: function(e) {
        e.stopImmediatePropagation();
        this.model.set({'id': this.model.get('eventId')});
        //TODO: make sure that this gets validated.
        var fields = this.getFields();
        // Create the new asset model that will be saved to the collection,
        // and posted to the server.

        this.model.set('eventClass', fields.eventClass);
        this.model.set('startDate', Date.parse(fields.eventStartDate));
        this.model.set('endDate', Date.parse(fields.eventEndDate));
        this.model.set('eventDescription', fields.eventDescription);
        this.model.set('notes', fields.eventNotes);
        this.model.set('tense', fields.eventTense);

        if (this.model.get('eventClass') === '.CalibrationEvent') {
            var calibrationCoeff = [];
            var calItems = this.$el.find('#calibrationCoeff input');
            for (var i=0; i < calItems.length; i++) {
                var calKey = $(calItems[i]).attr('id'),
                    calVal = $(calItems[i]).val(),
                    calCoeff = {};

                calCoeff[calKey] = calVal;
                calibrationCoeff.push(calCoeff);
            }
        this.model.set('metaData', calibrationCoeff);
        }

        if (this.model.get('eventClass') === '.DeploymentEvent') {
            this.model.set('deploymentShipName', fields.deploymentShipName);
            this.model.set('cruiseNumber', fields.cruise);
            this.model.set('deploymentNumber', fields.deploymentNumber);
            this.model.set('depth', fields.deploymentDepth);
            this.model.set('locationLonLat', [fields.locationLon, fields.locationLat]);
            this.model.set('recoveryShipName', fields.recoveryShipName);
            this.model.set('recoveryCruiseNumber', fields.recoveryCruiseNumber);
            this.model.set('recoveryLocationLonLat', [fields.recoveryLocationLon, fields.recoveryLocationLat]);
        }

        this.model.set('asset', this.model.get('asset'));
        this.model.set('referenceDesignator', this.model.get('referenceDesignator'));

        var isValid = this.model.isValid(true);
        if (isValid){
            this.model.save(null, {
                success: function(model, response){
                    alert('Success!');
                    vent.trigger('asset:changeCollection');
                },
                error: function(response) {
                    alert("Sorry, this action is not currently supported by the data infrastructure. Please contact your system admin. " + response.responseText);
                    vent.trigger('asset:changeCollection');
                }
            });
            this.cleanUp();
            this.model.off();
        } else {
            alert('Please fill in all fields');
            var missingFields = this.$el.find('input');
                missingFields.push(this.$el.find('select'));

            $.each(missingFields, function(index, item) {
                if ($(missingFields[index]).val() === "") {
                    $(missingFields[index]).closest('.row').addClass('has-error');
                } else {

                    $(missingFields[index]).closest('.row').removeClass('has-error');
                }
            });
        }
    },
});


var EventCreatorModalView = ParentEventModalView.extend({
    /* Renders out a modal window, which contains a form for
     * creating a new asset.
     * TODO: create field validations for each of the inputs.
     * - initialize()
     * - setupFields() ... this is useful, if there are modifications
     *      that need to be done to the template after it's rendered.
     * - save()
     * - cancel()
     * - cleanup()
     */
    template: JST['ooiui/static/js/partials/EventEditorModal.html'],
    initialize: function() {
        _.bindAll(this, 'save', 'cancel', 'setupFields');
        Backbone.Validation.bind(this);
    },
    events: {
        "click button#cancel" : "cancel",
        "click button#save" : "save"
    },
    setupFields: function() {
    },
    loadControls: function() {
        this.$el.find('.modal-footer').append('<button id="cancel" type="button" class="btn btn-default">Cancel</button>')
                                      .append('<button id="save" type="button" class="btn btn-primary">Save</button>');
    },
    cancel: function() {
        this.cleanUp();
    },
    cleanUp: function() {
        $('#eventCreatorModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.remove();
        this.unbind();
    }
});


var EventEditorModalView = ParentEventModalView.extend({
    /* This will render out a event editor modal window.
     * Only certain fields are editable to date, noteably
     * the fields omitted are the reference designator.
     * - initialize()
     * - submit()
     * - cancel()
     * - destory() ... This will delete an asset...beware!
     * - cleanUp()
     */
    template: JST['ooiui/static/js/partials/EventEditorModal.html'],
    initialize: function() {
        _.bindAll(this, 'cancel', 'destroy', 'populateFields');
        Backbone.Validation.bind(this);
    },
    events: {
        "click button#cancelEdit" : "cancel",
        "click button#saveEdit" : "save",
        "click button#delete" : "destroy"
    },
    loadControls: function() {
        this.$el.find('.modal-footer').append('<button id="delete" type="button" class="btn btn-danger">Delete</button>')
                                      .append('<button id="cancelEdit" type="button" class="btn btn-default">Cancel</button>')
                                      .append('<button id="saveEdit" type="button" class="btn btn-primary">Save</button>');
    },
    populateFields: function() {
        console.log(this.model);
        $('#eventClass').val(this.model.get('eventClass'));
        $('#eventTense').val(this.model.get('tense'));
        $('#eventEndDate').datepicker();
        $('#eventStartDate').datepicker();
        if (this.model.get('eventClass') === '.CalibrationEvent') {
            this.addCalData();
        }
    },
    addCalData: function() {
        var calItems = [];
        $.each(this.model.get('calibrationCoefficient'), function(index, item) {
            calItems.push('<div class="row meta-input">' +
                '<label class="col-md-5 meta-key">'+item.name+'</label>' +
                '<div class="col-md-6">' +
                '<input id="'+item.name+'" class="meta-val form-control" type="text" placeholder="Value" value="'+item.values+'">' +
                '</div>' +
            '</div>');
        });
        $('#calibrationCoeff').append(calItems.join(""));
    },
    cancel: function() {
        this.cleanUp();
    },
    destroy: function() {
        var youSure = confirm("Are you sure you would like to delete this asset?");
        if (youSure) {
            this.model.destroy();
            vent.trigger('asset:derender');
            vent.trigger('asset:changeCollection');
            this.cleanUp();
        }
    },
    cleanUp: function() {
        $('#eventEditorModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.derender();
        this.unbind();
    }
});
