var Subreddit = React.createClass({

    getItems: function (reset, cb) {

        var url = "http://www.reddit.com/r/" + this.state.subreddit + "/"+this.state.type+".json?limit=" + this.state.limit + '&after=' + this.state.after;

        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
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
                return this.getItems(1);
            });

    },
    changeType: function(e){
        this.setState({
            type:e.target.value,
            after: null,
            items: []
        }, function(){
            return this.getItems(1);
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
            <div>
                <h1>{this.props.title}</h1>
                <div className="row">
                    <SelectSubReddit subreddits={this.state.subreddits} changer={this.changeSubreddit} value={this.state.subreddit}/>
                    <RadioTypes type={this.state.type} changer={this.changeType}/>
                </div>
                <Items data={this.state.items}/>
                <LoadMore click={this.getItems}/>
            </div>
        )
    }
});

var LoadMore = React.createClass({

    clickHandler: function(e){
        e.preventDefault();
        e.stopPropagation();

        var btn = $(e.target);
        btn.prop('disabled', true);

        this.props.click(0, function(){
            return btn.prop('disabled', false);
        });
    },
    render: function(){
        return (
            <button className="btn btn-block load" onClick={this.clickHandler}>Load More</button>
        )
    }
});
/* Select SubReddit */
var SelectSubReddit = React.createClass({

    render: function () {
        return (
            <div className='col-sm-6'>
                <div className="form-group">
                    <label>Select a Subreddit</label>
                    <select className="form-control" onChange={this.props.changer} value={this.props.value}>
                {this.props.subreddits.map(function (subreddit, index) {
                    return <option value={subreddit.value} key={index}>{subreddit.name}</option>
                })}
                    </select>
                </div>
            </div>
        )
    }
});

var RadioTypes = React.createClass({


    render: function () {
        return (
            <div className="col-sm-6">
                <div className="form-group">
                    <label>Select a results type</label>
                    <div className="radios">
                        <div className="radio">
                            <label>
                                <input type="radio" name="type" value="new" checked={this.props.type == 'new'} onChange={this.props.changer}/>
                                New shares
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="type" value="top" checked={this.props.type == 'top'} onChange={this.props.changer}/>
                                Top shares
                            </label>
                        </div>
                    </div>


                </div>
            </div>
        )
    }
});

/* Items */
var Items = React.createClass({

    render: function () {

        var items = this.props.data.map(function (item, index) {
            return (<Item data={item.data} key={index}/>);
        });
        return (
            <ul>
            {items.map(function (item, index) {
                return <li key={index}>{item}</li>
            })}
            </ul>
        )
    }
});

/* Item */
var Item = React.createClass({
    render: function () {
        item = this.props.data;
        url = "http://reddit.com" + item.permalink;
        return (
            <article className="panel panel-default">
                <div className="panel-heading">
                    <h4>{item.title}</h4>
                </div>
                <div className="panel-body">
                    <figure>
                        <img src={item.preview.images[0].source.url}/>
                    </figure>
                </div>
                <div className="panel-footer">

                    <span className="pull-right">
                        <a className="btn btn-xs btn-primary" href={url} target="_blank">Source</a>
                    &nbsp;&nbsp;
                        <a className="btn btn-xs btn-info" href={item.url} target="_blank">Image</a>
                    </span>

                    <div className="clearfix"></div>
                </div>
            </article>
        )
    }
});

/* Render */
React.render(<Subreddit title="React Reddit Image Lister"/>, document.getElementById('content'));



