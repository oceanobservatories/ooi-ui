var CalibrationEventModel = Backbone.Model.extend({
  urlRoot: '/api/asset_events',
  defaults: {
      class: ".CalibrationEvent",
      calibrationCoefficient: [],
      eventType: "ACTUAL",
      metaData: [ ],
      eventId: null,
      eventDescription: null,
      recordedBy: null,
      asset: {},
      notes: [ ],
      tense: null,
      startDate: null,
      endDate: null,
      attachments: [ ],
      remoteDocuments: [ ],
      dataSource: null
  }
});
