var PatchNoteView = Backbone.View.extend({
    template: JST["ooiui/static/js/partials/PatchNotes.html"],
    render: function() {
        var self = this;
        _.each(this.model.models, function(patchNote){
            var patchNoteTemplate = self.template(patchNote.toJSON());
            $(self.el).append(patchNoteTemplate);
        }, self);
        return this;
    }
});

var uFramePatchNoteView = Backbone.View.extend({
    template: JST["ooiui/static/js/partials/uFramePatchNotes.html"],
    render: function() {
        var self = this;
        _.each(this.model.models[0].attributes.release_notes, function(patchNote){
            var patchNoteTemplate = self.template(patchNote);
            $(self.el).append(patchNoteTemplate);
        }, self);
        return this;
    }
});
