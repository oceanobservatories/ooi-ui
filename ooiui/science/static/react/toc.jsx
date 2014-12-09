
/* This takes a list in the props.results, any children are identified in each
 * objects children accessor */
var ListItem = React.createClass({
  /*
   * Render creates a nested HTML list of the items. It recursively iterates
   * through the list and keys off of the "children" key to go deeper into the
   * list. Each item in the list should contain: id, title and children. If
   * there are no children, children should be set to an empty list.
   */
  render: function() {
    var items = this.props.items;
    return (
      <ul>
        {items.map(function(item) {
          return (
            <li key={item.id}> {item.title}
              <ListItem items={item.children} />
            </li>
          )
        })}

      </ul>
    );
  }
});



var ArrayItem = React.createClass({
  render: function() {
    var results = this.props.results;
    var rows = [];
    for(var key in results) {
      rows.push(
        <li key={key}>
        {key}
        <ListItem items={results[key]} />
        </li>
      );
    }
    return (
      <ul>
        {rows}
      </ul>
    );
  }
});
var TOC = React.createClass({
  getInitialState: function() {
    return {data: {} };
  },
  loadTOC: function() {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      success: function(data) {
        this.setState({"data": data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadTOC();
  },
  render: function() {
    return (
      <div>
        <ArrayItem results={this.state.data} />
      </div>
    );
  }
});



React.render(
  <TOC url="/gettoc/" />,
  document.getElementById('TOC')
);


