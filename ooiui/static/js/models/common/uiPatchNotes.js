var uiPatchNote = Backbone.Model.extend();

var uiPatchNoteList = Backbone.Collection.extend({
    model: uiPatchNote,
    url: '/json/uiPatchNotes.json'
});   
