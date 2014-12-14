function buildtocmenu(data){
	


	// Initialize Fancytree
    $("#tocmenusection").fancytree({
      extensions: ["glyph","filter", "wide", "childcounter"],
      checkbox: false,
      selectMode: 2,
      glyph: {
        map: {
          doc: "glyphicon glyphicon-map-marker",
          docOpen: "glyphicon glyphicon-map-marker",
          checkbox: "glyphicon glyphicon-unchecked",
          checkboxSelected: "glyphicon glyphicon-check",
          checkboxUnknown: "glyphicon glyphicon-share",
          error: "glyphicon glyphicon-warning-sign",
          expanderClosed: "glyphicon glyphicon-plus-sign",
          expanderLazy: "glyphicon glyphicon-plus-sign",
          expanderOpen: "glyphicon glyphicon-minus-sign",
          folder: "glyphicon glyphicon-folder-close",
          folderOpen: "glyphicon glyphicon-folder-open",
          loading: "glyphicon glyphicon-refresh"
          // loading: "icon-spinner icon-spin"
        }
      },
      filter: {
        mode: "hide"
      },
      childcounter: {
        deep: false,
        hideZeros: true,
        hideExpanded: true
      },
      wide: {
        iconWidth: "1em",     // Adjust this if @fancy-icon-width != "16px"
        iconSpacing: "0.5em", // Adjust this if @fancy-icon-spacing != "3px"
        levelOfs: "1.5em"     // Adjust this if ul padding != "16px"
      },

      source: data
      
    });


}