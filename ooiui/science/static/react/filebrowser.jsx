/** @jsx React.DOM */
/*
 * ooiui/science/static/react/filebrowser.jsx
 * Defines the components that compose the File Browser
 */

var OverviewHeader = React.createClass({
  render: function() {
      return (
        <h4 className="overview">{this.props.title}
          <i className="glyphicon glyphicon-info-sign info-icon"></i>
        </h4>   
      )
    }
});


/*
 * FolderBrowser
 * Presents a tree-style layout for a folder structure and allows the user to
 * select items this is an integration with fancytree.
 */
var FolderBrowser = React.createClass({
  render: function() {
    return (
      <div className="col-md-8 col-lg-8">
        <div className="panel panel-default">
          <div className="panel-body">
            <div>                       
               <OverviewHeader title={"Array"}/>
                <div className="col-1 input-group">
                  <div className="right-inner-addon">
                     <input id="searchQuery" type="Search" placeholder="Search..." className="form-control" />
                     <i className="glyphicon glyphicon-search"></i>                               
                   </div> 
                   <div className="input-group-btn">
                     <button id="search-reset" type="button" className="btn btn-info">
                       <span className="glyphicon glyphicon-remove-sign"></span>
                     </button>
                   </div> 
                </div> 
                <div id="tocmenusection" className="toc-panel">                         
                </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    )
  }
});

/*
 * FileInfo
 * Presents a simple area to display information about the file
 */
var FileInfo = React.createClass({
  render: function() {
    return (
      <div className="col-md-4 col-lg-4">
        <span>FileInfo</span>
      </div>
    )
  }
});

/*
 * FileBrowser
 * This component manages state for both FolderBrowser and FileBrowser
 */
var FileBrowser = React.createClass({
  render: function () {
    return (
      <div className="fileBrowser">
        <FolderBrowser />
        <FileInfo />
      </div>
    );
  }
});


React.render(
  <FileBrowser />,
  document.getElementById('FileBrowser')
);

    
