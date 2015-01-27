var React = require('react');

var Entity = React.createClass({
    getInitialState: function(){
        return {value: '', showForm: true}
    },
    handleUserInput: function(value){
        this.setState({value: value});
    },
    handleSubmit: function(e){
        e.preventDefault();  // important!
        var form = this.state.showForm;
        value = (form == true) ? this.refs.userinput.getDOMNode().value : this.state.value;
        this.setState({showForm: !form, value: value});
    },
    render: function(){

        var value = this.state.value;
        var showForm = this.state.showForm;
        var submitValue = (showForm == true) ? 'add' : 'edit';
        var inner =  (showForm == true) ?
            <Input
                type="text"
                placeholder="term"
                value={value}
                ref="userinput"
                onUserInput={this.handleUserInput}
            /> :
            <EnteredValue
                value={value}
            /> ;
        return(
          <div>
            <h2>Wikipedia lookup</h2>
            <form onSubmit={this.handleSubmit} >
            {inner}
                <input className="btn btn-primary typesubmit" type="submit" value={submitValue} />
            </form>
          </div>
        );
    }
});

var Input = React.createClass({
    componentDidMount: function(){
   
        var dbpedia = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 5,
            remote:
            {url: 'http://lookup.dbpedia.org/api/search/PrefixSearch?QueryClass=&MaxHits=5&QueryString=%QUERY',
                filter: function(dbpedia){
                    return $.map(dbpedia.results, function(result){
                        var res_url = 'http://wikipedia.org/wiki/'+result.label.split(' ').join('_');
                        var url = Handlebars.Utils.escapeExpression(res_url);
                        var val =  '<a href="' + url + '" target="_blank">'+ result.label + '</a>';
                        var link = new Handlebars.SafeString(val);

                        var classes_array = $.map(result.classes, function(oneclass){
                            return oneclass.label;
                        })
                        var classes = classes_array.join(", ");
                        //var first_class = (classes_array.length > 0) ? classes_array[0] : "";

                        var cat_array = $.map(result.categories, function(onecat){
                            return onecat.label;
                        })
                        var categories = cat_array.join(", ");

                        var first_cat = (cat_array.length > 0) ? cat_array[0] : "";

                        return {
                            value: result.label,
                            url: link,
                            classes: classes,
                            categories: categories,
                            first_cat: first_cat
                        };
                    });
                }
            }
        });

        dbpedia.initialize();


        var element = this.getDOMNode();
        $(element).typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
       
            {
                name: 'dbpedia',
                displayKey: 'value',
                source: dbpedia.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Cannot find matching dbpedia entry',
                        '</div>'
                    ].join('\n'),
                    header: '<h3 class="dbpedia">Dbpedia</h3>',
                    suggestion: Handlebars.compile('<p style="font-size: 18px">{{value}}</p>{{url}}<br />' 
                        +
                   /* '<em><strong>Classes:</strong> {{classes}}</em><br />'  + */
                    '<em><strong>Category:</strong> {{first_cat}}</em><br />&nbsp;<br />')

                }
            })


        var self = this;

        $(element).on('typeahead:selected', function(jquery, option){
            console.log(option.value);
            self.props.value = option.value;
        });
    },
    componentWillUnmount: function(){
        var element = this.getDOMNode();
        $(element).typeahead('destroy');
    },
    handleChange: function(){
      this.props.onUserInput(
          this.refs.userinput.getDOMNode().value
      );
    },
    render: function(){
        
        return(
        <input
            className="typeahead"
            type="text"
            value={this.props.value}
            ref="userinput"
            onChange={this.handleChange}
        />);
    }
});

var EnteredValue = React.createClass({
    render: function(){
        var style = {width: '396px', height: '50px', display: 'inline-block'}
        return (
            <div className="value-entered" style={style} >{this.props.value}</div>
        )
    }
});

module.exports = Entity;