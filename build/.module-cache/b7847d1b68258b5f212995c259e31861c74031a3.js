/** @jsx React.DOM */
var CommentList = React.createClass({displayName: 'CommentList',
   render: function() {
       return (
           React.DOM.div({className: "commentList"}, 
           "Hello, world! I'm a CommentList."
           )
       )
   }
   });

var CommentForm = React.createClass({displayName: 'CommentForm',
    render: function() {
        return (
            React.DOM.div({className: "commentForm"}, 
            "Hello, world! I'm a CommentForm."
            )
        )
    }
});