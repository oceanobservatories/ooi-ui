var uFramePatchNote = Backbone.Model.extend();

var uFramePatchNoteList = Backbone.Collection.extend({
    model: uFramePatchNote,
    url: '/json/uFramePatchNotes.json'
});   
