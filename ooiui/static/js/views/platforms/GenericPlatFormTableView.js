"use strict"

var streams =  [{
      "array_name": "Station Papa",
      "assembly_name": null,
      "display_name": "3-D Single Point Velocity Meter",
      "download": {
        "csv": "api/uframe/get_csv/telemetered_vel3d-l-wfp-sio-mule-metadata/GP02HYPM-WFP03-05-VEL3DL000",
        "json": "api/uframe/get_json/telemetered_vel3d-l-wfp-sio-mule-metadata/GP02HYPM-WFP03-05-VEL3DL000",
        "netcdf": "api/uframe/get_netcdf/telemetered_vel3d-l-wfp-sio-mule-metadata/GP02HYPM-WFP03-05-VEL3DL000",
        "profile": "api/uframe/get_profiles/telemetered_vel3d-l-wfp-sio-mule-metadata/GP02HYPM-WFP03-05-VEL3DL000"
      },
      "end": "2016-01-02T07:41:07.000Z",
      "long_display_name": "Station Papa Apex Profiler Mooring Wire-Following Profiler Lower 3-D Single Point Velocity Meter",
      "parameter_display_name": [
        "Time, UTC",
        "Port Timestamp, UTC",
        "Driver Timestamp, UTC",
        "Internal Timestamp, UTC",
        "Preferred Timestamp",
        "Serial Number",
        "Ingestion Timestamp, UTC",
        "Number of records in the file",
        "Time Sensor Start, Seconds since Jan 1 1970 UTC",
        "Time Sensor Stop, Seconds since Jan 1 1970 UTC",
        "Full Decimation Factor",
        "Controller timestamp, Seconds since Jan 1 1970 UTC"
      ],
      "parameter_id": [
        "pd7",
        "pd10",
        "pd11",
        "pd12",
        "pd16",
        "pd312",
        "pd863",
        "pd2241",
        "pd2242",
        "pd2243",
        "pd2244",
        "pd2245"
      ],
      "platform_name": "Apex Profiler Mooring",
      "reference_designator": "GP02HYPM-WFP03-05-VEL3DL000",
      "site_name": "Apex Profiler Mooring",
      "start": "2013-07-26T16:48:27.000Z",
      "stream_display_name": null,
      "stream_name": "telemetered_vel3d-l-wfp-sio-mule-metadata",
      "units": [
        "seconds since 1900-01-01",
        "seconds since 1900-01-01",
        "seconds since 1900-01-01",
        "seconds since 1900-01-01",
        "1",
        "1",
        "seconds since 1900-01-01",
        "counts",
        "seconds since 1970-01-01",
        "seconds since 1970-01-01",
        "1",
        "seconds since 1970-01-01"
      ],
      "variable_type": [
        "double",
        "double",
        "double",
        "double",
        "string",
        "string",
        "double",
        "ushort",
        "uint",
        "uint",
        "ushort",
        "uint"
      ],
      "variable_types": {},
      "variables": [
        "time",
        "port_timestamp",
        "driver_timestamp",
        "internal_timestamp",
        "preferred_timestamp",
        "serial_number",
        "ingestion_timestamp",
        "vel3d_l_number_of_records",
        "vel3d_l_time_on",
        "vel3d_l_time_off",
        "vel3d_l_decimation_factor",
        "vel3d_l_controller_timestamp"
      ],
      "variables_shape": [
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar"
      ]
    },
    {
      "array_name": "Station Papa",
      "assembly_name": null,
      "display_name": "Single Point  Meter",
      "download": {
        "csv": "api/uframe/get_csv/telemetered_vel3d-l-wfp-instrument/GP02HYPM-WFP03-05-VEL3DL000",
        "json": "api/uframe/get_json/telemetered_vel3d-l-wfp-instrument/GP02HYPM-WFP03-05-VEL3DL000",
        "netcdf": "api/uframe/get_netcdf/telemetered_vel3d-l-wfp-instrument/GP02HYPM-WFP03-05-VEL3DL000",
        "profile": "api/uframe/get_profiles/telemetered_vel3d-l-wfp-instrument/GP02HYPM-WFP03-05-VEL3DL000"
      },
      "end": "2016-01-02T07:04:02.000Z",
      "long_display_name": "Station Papa Apex Profiler Mooring Wire-Following Profiler Lower 3-D Single Point Velocity Meter",
      "parameter_display_name": [
        "Time, UTC",
        "Port Timestamp, UTC",
        "Driver Timestamp, UTC",
        "Internal Timestamp, UTC",
        "Preferred Timestamp",
        "Ingestion Timestamp, UTC",
        "Instrument Heading, degrees",
        "X component of Tilt, degrees",
        "Y component of Tilt, degrees",
        "Compass X",
        "Compass Y",
        "Compass Z",
        "Path Velocity 1, cm/sec",
        "Path Velocity 2, cm/sec",
        "Path Velocity 3, cm/sec",
        "Path Velocity 4,, cm/sec",
        "Eastward Turbulent Velocity, m s-1",
        "Northward Turbulent Velocity, m s-1",
        "Upward Turbulent Velocity - Ascending, m s-1",
        "Upward Turbulent Velocity - Ascending, m s-1"
      ],
      "parameter_id": [
        "pd7",
        "pd10",
        "pd11",
        "pd12",
        "pd16",
        "pd863",
        "pd2230",
        "pd2231",
        "pd2232",
        "pd2233",
        "pd2234",
        "pd2235",
        "pd2236",
        "pd2237",
        "pd2238",
        "pd2239",
        "pd3487",
        "pd3488",
        "pd3489",
        "pd3490"
      ],
      "platform_name": "Apex Profiler Mooring",
      "reference_designator": "GP02HYPM-WFP03-05-VEL3DL000",
      "site_name": "Apex Profiler Mooring",
      "start": "2013-07-26T15:00:18.000Z",
      "stream_display_name": null,
      "stream_name": "telemetered_vel3d-l-wfp-instrument",
      "units": [
        "seconds since 1900-01-01",
        "seconds since 1900-01-01",
        "seconds since 1900-01-01",
        "seconds since 1900-01-01",
        "1",
        "seconds since 1900-01-01",
        "degrees",
        "degrees",
        "degrees",
        "1",
        "1",
        "1",
        "cm s-1",
        "cm s-1",
        "cm s-1",
        "cm s-1",
        "m s-1",
        "m s-1",
        "m s-1",
        "m s-1"
      ],
      "variable_type": [
        "double",
        "double",
        "double",
        "double",
        "string",
        "double",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float",
        "float"
      ],
      "variable_types": {},
      "variables": [
        "time",
        "port_timestamp",
        "driver_timestamp",
        "internal_timestamp",
        "preferred_timestamp",
        "ingestion_timestamp",
        "vel3d_l_heading",
        "vel3d_l_tx",
        "vel3d_l_ty",
        "vel3d_l_hx",
        "vel3d_l_hy",
        "vel3d_l_hz",
        "vel3d_l_vp1",
        "vel3d_l_vp2",
        "vel3d_l_vp3",
        "vel3d_l_vp4",
        "vel3d_l_eastward_velocity",
        "vel3d_l_northward_velocity",
        "vel3d_l_upward_velocity_ascending",
        "vel3d_l_upward_velocity_descending"
      ],
      "variables_shape": [
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "scalar",
        "function",
        "function",
        "function",
        "function"
      ]
    }
]

var DataCollection = Backbone.Collection.extend();

var GenericPlatFormTable = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render", "changeID");

    this.collection = new DataCollection(streams);
    this.render();

  },
  
  changeID: function(){
     
      this.$el.find("#tableViews").attr("id", "data-" + this.id);
  },


  template: JST['ooiui/static/js/partials/GenericPlatFormTable.html'],

  render: function(){
    var self = this;

    this.$el.html(this.template({model: this.model}));

    //this.changeID()

    var row = " <thead> <tr>" +
                "<th>Intrument</th> <th>Design Depth</th> <th>Start Time</th>"+
                "<th>End Time</th> <th>Plot</th> </tr> </thead>";

      this.collection.each(function(model) {
                 
                 console.log("row");
                 //console.log(self.id)
    //             var rowView = new GenericPlatFormTableRow({model: model});

                 row += "<tr> <td>" + model.get("display_name")  + "</td>";
                 row += " <td>" + "depth"  + "</td> ";
                 row += " <td>" + model.get("start") + "</td> ";
                 row += "<td>" + model.get("end") + "</td>";
                 row += "<td>" + "plot" + "</td> </tr>";

                //self.$el.find(self.id).append(rowView);
                self.$el.append(row);
      });
      return this;
  }
});
