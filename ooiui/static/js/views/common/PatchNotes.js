var PatchNoteView = Backbone.View.extend({
    template: JST["ooiui/static/js/partials/PatchNotes.html"],
    render: function(eventName) {
        var self = this;
        _.each(this.model.models, function(patchNote){
            var patchNoteTemplate = self.template(patchNote.toJSON());
            $(self.el).append(patchNoteTemplate);
        }, self);
        return this;
    }
});
