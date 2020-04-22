var Subreddit = React.createClass({displayName: "Subreddit",

    getItems: function (cb) {

        var url = "http://www.reddit.com/r/" + this.state.subreddit + "/"+this.state.type+".json?limit=" + this.state.limit + '&after=' + this.state.after;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (resp) {
                var items = resp.data.children.filter(function (item) {
                    return !item.data.is_self && item.data.preview;
                });

                this.setState(function (state) {
                    return {
                        items: state.items.concat(items),
                        after: resp.data.after,
                        subreddit: state.subreddit
                    }
                });

                if(cb) cb();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });

    },
    changeSubreddit: function (e) {


        this.setState(
            {
                subreddit: e.target.value,
                after: null,
                items: []
            }, function () {
                return this.getItems();
            });

    },
    changeType: function(e){
        this.setState({
            type:e.target.value,
            after: null,
            items: []
        }, function(){
            return this.getItems();
        });
    },
    getInitialState: function () {
        return {
            items: [],
            subreddit: 'earthporn',
            type: 'new',
            limit: 5,
            after: null,
            subreddits: [
                {
                    value: 'earthporn',
                    name: 'Earth Porn'
                },
                {
                    value: 'spaceporn',
                    name: 'Space Porn'
                },
                {
                    value: 'historyporn',
                    name: 'History Porn'
                },
                {
                    value: 'summerporn',
                    name: 'Summer Porn'
                },
                {
                    value: 'astrophotography',
                    name: 'AstroPhotography'
                }
            ]
        };
    },
    componentDidMount: function () {
        if (this.isMounted()) {
            this.getItems();
        }
    },
    componentDidUpdate: function (prevProps, prevState) {
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, this.props.title), 
                React.createElement("div", {className: "row"}, 
                    React.createElement(SelectSubReddit, {subreddits: this.state.subreddits, changer: this.changeSubreddit, value: this.state.subreddit}), 
                    React.createElement(RadioTypes, {type: this.state.type, changer: this.changeType})
                ), 
                React.createElement(Items, {data: this.state.items}), 
                React.createElement(LoadMore, {click: this.getItems})
            )
        )
    }
});

var LoadMore = React.createClass({displayName: "LoadMore",

    clickHandler: function(e){
        e.preventDefault();
        e.stopPropagation();

        var btn = $(e.target);
        btn.prop('disabled', true);

        this.props.click(function(){
            return btn.prop('disabled', false);
        });
    },
    render: function(){
        return (
            React.createElement("button", {className: "btn btn-block btn-success load", onClick: this.clickHandler}, "Load More")
        )
    }
});
/* Select SubReddit */
var SelectSubReddit = React.createClass({displayName: "SelectSubReddit",

    render: function () {
        return (
            React.createElement("div", {className: "col-sm-3"}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", null, "Select a Subreddit"), 
                    React.createElement("select", {className: "form-control", onChange: this.props.changer, value: this.props.value}, 
                this.props.subreddits.map(function (subreddit, index) {
                    return React.createElement("option", {value: subreddit.value, key: index}, subreddit.name)
                })
                    )
                )
            )
        )
    }
});

var RadioTypes = React.createClass({displayName: "RadioTypes",


    render: function () {
        return (
            React.createElement("div", {className: "col-sm-9"}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", null, "Select a results type"), 
                    React.createElement("div", {className: "radios"}, 
                        React.createElement("div", {className: "radio"}, 
                            React.createElement("label", null, 
                                React.createElement("input", {type: "radio", name: "type", value: "new", checked: this.props.type == 'new', onChange: this.props.changer}), 
                                "New shares"
                            )
                        ), 
                        React.createElement("div", {className: "radio"}, 
                            React.createElement("label", null, 
                                React.createElement("input", {type: "radio", name: "type", value: "hot", checked: this.props.type == 'hot', onChange: this.props.changer}), 
                                "Hot shares"
                            )
                        ), 
                        React.createElement("div", {className: "radio"}, 
                            React.createElement("label", null, 
                                React.createElement("input", {type: "radio", name: "type", value: "top", checked: this.props.type == 'top', onChange: this.props.changer}), 
                                "Top shares"
                            )
                        )
                    )


                )
            )
        )
    }
});

/* Items */
var Items = React.createClass({displayName: "Items",
    render: function () {
        var items = this.props.data.map(function (item, index) {
            return (React.createElement(Item, {data: item.data, key: index}));
        });
        return (
            React.createElement("ul", null, 
            items.map(function (item, index) {
                return React.createElement("li", {key: index}, item)
            })
            )
        )
    }
});

/* Item */
var Item = React.createClass({displayName: "Item",
    render: function () {
        item = this.props.data;
        url = "http://reddit.com" + item.permalink;
		resolutions = item.preview.images[0].resolutions		
		preview = resolutions[resolutions.length - 1].url.replace(/amp;/g, '');
        return (
            React.createElement("article", {className: "panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("h4", null, item.title)
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement("figure", null, 
						React.createElement("a", {href: item.url, target: "_blank", title: "Go Full Resolution Image"}, 
							React.createElement("img", {src: preview})
						)
                    )
                ), 
                React.createElement("div", {className: "panel-footer"}, 

                    React.createElement("span", {className: "pull-right"}, 
                        React.createElement("a", {className: "btn btn-xs btn-primary", href: url, target: "_blank"}, "Source"), 
                    "  ", 
                        React.createElement("a", {className: "btn btn-xs btn-info", href: item.url, target: "_blank"}, "Image")
                    ), 

                    React.createElement("div", {className: "clearfix"})
                )
            )
        )
    }
});

/* Render */
React.render(React.createElement(Subreddit, {title: "React Reddit Image Lister"}), document.getElementById('content'));



