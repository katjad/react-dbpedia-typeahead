/** @jsx React.DOM */

var Entity = React.createClass({
    getInitialState: function() {
        return {data: data}
    },
    render: function() {
        return (
            <div >
                <h1>This will be the entity</h1>
                   <InputOrValue value={this.state.data.value} />
            </div>
        );
    }
});

var data = {form: 1, value: "enter value", submit: 'add'};

var InputOrValue = React.createClass({
    getInitialState: function(){
        return {data: data}
    },
    handleSubmit: function(e){
        e.preventDefault();
        value = this.state.data.value.trim();
        if(!value){
            return;
        }
        this.state.data.form = !this.state.data.form;
        this.state.data.submit = (this.state.data.submit == 'add') ?  'edit' : 'add' ;
        this.setState({data: data});
        return;
    },

    render: function(){
       var submit = this.state.data.submit;
       var value=this.state.data.value;
       var inner =  (this.state.data.form == 1) ? <Input value={value} /> : <EnteredValue value={value} /> ;
       return(
           <form onSubmit={this.handleSubmit}>
             {inner}
           <input className="tiny button typesubmit" type="submit" value={submit} />
           </form>
       )
    }
});

var Input = React.createClass({
    getInitialState: function(){
        return {data: data}
    },

    handleChange: function(event) {
    // getting the value entered in the form


    var element = this.getDOMNode();
        console.log(element.value);
    var value = event.target.value;

    // setting the value property of state to the entered value
    this.state.data.value = value;
    this.setState({data: data});

    // setting the value attribute to the entered value
    this.props.value = value;
    },
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
        films.initialize();
        speakers.initialize();


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
        });

        var self = this;

        $(element).on('typeahead:selected', function(jquery, option){
          //$(this).trigger("change");
            console.log(option);
            self.state.data.value = option.value;
        });
     },
    componentWillUnmount: function(){
        var element = this.getDOMNode();
        $(element).typeahead('destroy');
    },

    render: function(){
        var value = this.state.data.value;
        return(

                <input className="typeahead" type="text" value={value} onChange={this.handleChange} ref="entry" />

               )
    }
});

var EnteredValue = React.createClass({
    getInitialState: function() {
        return {data: data};
    },
    render: function(){
        value = this.props.value;
        return <span className="search-box" > {value} </span>
    }
});

React.renderComponent(
    <Entity data={data} />,
    document.getElementById('entity')
);

