/** @jsx React.DOM */


var Entity = React.createClass({
    getInitialState: function(){
        return {value: 'value', showForm: true}
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
            <h2>Creating an entity</h2>
            <form onSubmit={this.handleSubmit} >
            {inner}
                <input className="tiny button typesubmit" type="submit" value={submitValue} />
            </form>
          </div>
        );
    }
});

var Input = React.createClass({
    componentDidMount: function(){
        var films = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'js/post1960.json'
        });

        var speakers = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: 'js/speakers.json',
                filter: function(list){
                    return $.map(list, function(speaker){return {value: speaker}; });
                }
            }
        });

        var databases = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('db'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'js/databases.json'
        });

        var dbpedia = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 5,
            remote:
            {url: 'http://lookup.dbpedia.org/api/search/PrefixSearch?QueryClass=&MaxHits=5&QueryString=%QUERY',
                filter: function(dbpedia){
                               return $.map(dbpedia.results, function(result){
                               var className = !(typeof(result.classes[0]) === 'undefined') ?
                                       result.classes[0].label : '';

                        //var res_url = 'http://wikipedia.org/wiki/'+result.label.split(' ').join('_');
                        return {
                            value: result.label,//value: '<a href="' + res_url + '">'+ result.label + '</a>'
                            className: className
                        };
                    });
                }
            }
        });
        films.initialize();
        speakers.initialize();
        dbpedia.initialize();


        var element = this.getDOMNode();
        $(element).typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'films',
                source: films.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Cannot find matching film',
                        '</div>'
                    ].join('\n'),
                    header: '<h3 class="films">Films</h3>',
                    suggestion: Handlebars.compile('<p class="films">{{value}}<br /> <em>Made in {{year}}</em></p>')
                }
            },
            {
                name: 'speakers',
                displayKey: 'value',
                source: speakers.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Cannot find matching speaker',
                        '</div>'
                    ].join('\n'),
                    header: '<h3 class="speakers">Speakers</h3>'
                    //,suggestion: Handlebars.compile('<p  class="films">{{value}}</p>')
                }
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
                    suggestion: Handlebars.compile('<p>{{value}} <em>{{className}}</em></p>')
                }
            })


        var self = this;

        $(element).on('typeahead:selected', function(jquery, option){
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
        var style = {width: '250px', display: 'inline-block'}
        return(
        <input
            className="typeahead"
            style={style}
            type="text"
            value={this.props.value}
            ref="userinput"
            onChange={this.handleChange}
        />);
    }
});

var EnteredValue = React.createClass({
    render: function(){
        var style = {width: '250px', display: 'inline-block'}
        return <div style={style} >{this.props.value}</div>
    }
});

React.renderComponent(
    <Entity />,
    document.getElementById('entity')
);