/** @jsx React.DOM */
var CommentBox = React.createClass({displayName: 'CommentBox',
   render: function(){
       return(
           React.DOM.div({className: "commentBox"}, 
            React.DOM.h1(null, "Comments"), 
            CommentList(null), 
            CommentForm(null)
            )
       )
   }
});

React.renderComponent(
  CommentBox(null),
  document.getElementById('content')
);

