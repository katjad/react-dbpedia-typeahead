/** @jsx React.DOM */

var Entity = React.createClass({
    getInitialState: function() {
        return data;
    },
    render: function() {
        return (
            <div >
                <h1>This will be the entity</h1>
                   <InputOrValue value={this.state.value} />
            </div>
        );
    }
});

var data = {form: 1, value: "enter value"};

var InputOrValue = React.createClass({
    getInitialState: function(){
        return data;
    },
    handleSubmit: function(e){
        e.preventDefault();
        value = this.state.value.trim();
        if(!value){
            return;
        }
        newform = !this.state.form;
        this.replaceState({form: newform});
        return;
    },

    render: function(){

       value = this.state.value;
       var inner =  (this.state.form == 1) ? <Input value={value} /> : <EnteredValue value={value} /> ;
       return(
           <form className="Input" onSubmit={this.handleSubmit}>
           {inner}
           <input className="button" type="submit" value="Submit" />
           </form>
       )
    }
});

var Input = React.createClass({
    getInitialState: function(){
        return data;
    },

    handleChange: function(event) {
    // getting the value entered in the form
    var value = event.target.value;

    // setting the value property of state to the entered value
    this.replaceState({value: value});

    // setting the value attribute to the entered value
    this.props.value = value;
    },

    render: function(){
        var value = this.state.value;
        return(
            <input className="typeahead" type="text" value={value} onChange={this.handleChange} ref="entry" />
        )
    }
});

var EnteredValue = React.createClass({
    getInitialState: function() {
        return data;
    },
    render: function(){
        value = this.props.value;
        return <div> {value} </div>
    }
});

React.renderComponent(
    <Entity data={data} />,
    document.getElementById('entity')
);

