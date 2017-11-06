var uFramePatchNote = Backbone.Model.extend();

var uFramePatchNoteList = Backbone.Collection.extend({
  model: uFramePatchNote,
  url: '/json/uFramePatchNotes.json'
});

var uFrameVersionModel = Backbone.Model.extend();

var uFrameVersionCollection = Backbone.Collection.extend({
  model: uFrameVersionModel,
  url: '/api/uframe/versions'
});

var uFrameReleaseNotesModel = Backbone.Model.extend();

var uFrameReleaseNotesCollection = Backbone.Collection.extend({
  model: uFrameReleaseNotesModel,
  url: '/api/uframe/release_notes'
});
