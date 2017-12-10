class StorageDB {
    dbVersion = 2;
    objectStoreName = 'timelogs';

    constructor () {
        this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

        var request = indexedDB.open('timeTrackerLogs', this.dbVersion);
        request.onupgradeneeded = event => {
            this.createObjectStore(request.result);
        };
        this.db = new Promise((resolve, reject) => {
            request.onerror = reject;
            request.onsuccess = event => {
                request.result.onerror = function (err) {
                    console.error('Error creating/accessing IndexedDB database', err);
                };
                resolve(request.result);
            };
        });
    }

    getAll () {
        return this.db.then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.objectStoreName], 'readonly');
                // t.oncomplete = function (event) {
                //     console.log('Transaction completed: database modification finished.');
                // };
                transaction.onerror = function (event) {
                    console.error('Transaction not opened due to error. Duplicate items not allowed.');
                    reject(event);
                };

                const objStore = transaction.objectStore(this.objectStoreName);

                const results = [];
                // FIXME sorting by date, not by insertion order
                const request = objStore.openCursor(null, 'prev');
                request.onerror = reject;
                request.onsuccess = evt => {
                    const cursor = evt.target.result;
                    if (cursor) {
                        results.push(Object.assign(cursor.value, { id: cursor.key }));
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };
            });
        });
    }

    add (item) {
        return this.db.then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.objectStoreName], 'readwrite');
                transaction.onerror = function (event) {
                    console.error('Transaction not opened due to error. Duplicate items not allowed.');
                    reject(event);
                };

                const objStore = transaction.objectStore(this.objectStoreName);
                const request = objStore.add(item);
                request.onerror = reject;
                request.onsuccess = evt => {
                    resolve(evt.target.result);
                };
            });
        });
    }

    createObjectStore (db) {
        console.log('creating objectStore');
        db.createObjectStore(this.objectStoreName, { autoIncrement : true });
    }
}


document.body.className += ' js';

const st = new StorageDB();

class RootComponent extends React.Component {
    state = { list: [] };

    componentDidMount () {
        this._fetch();
    }

    render () {
        const { list } = this.state;

        return (
            <div>
                <div>
                    <h1>Log:</h1>
                    <form onSubmit={this._handleSubmit} method="POST">
                        <input name="comment" placeholder="comment" />
                        <input type="submit" value="add activity" />
                    </form>
                    <ListOfLatest list={list} />
                </div>
                <div>
                    <h1>Total for each comment:</h1>
                    <ListOfGrouped list={list} />
                </div>
            </div>
        );
    }

    _fetch = () => {
        return st.getAll().then(
            list => { this.setState({ list }); },
            err => { console.error('error', err); }
        );
    }

    _handleSubmit = evt => {
        evt.preventDefault();
        return st.add({
            time: new Date,
            comment: evt.target.elements.comment.value
        }).then(this._fetch);
    }
}

const ListOfLatest = ({list}) => {
    let prevDate = null;

    return (
        <ul>
            {list.map((item) => {
                const timeDiff = prevDate
                    ? moment.duration(prevDate.diff(item.time)).humanize()
                    : null;
                prevDate = moment(item.time);
                return <li key={item.id}>{timeDiff ? '(' + timeDiff + ') ' : ''}{item.comment}</li>;
            })}
        </ul>
    );
};

const ListOfGrouped = ({list}) => {
    let prevDate = null;

    const groupedByComment = list.reduce((map, item) => {
        const comment = item.comment.trim().toLocaleLowerCase();

        if (!map.has(comment)) {
            map.set(comment, moment.duration(0, 'hours'));
        }

        const duration = map.get(comment);
        if (prevDate) {
            duration.add(
                moment(prevDate).diff(item.time)
            );
        }

        prevDate = item.time;

        return map;
    }, new Map);
    const aggregate = [];
    groupedByComment.forEach((duration, comment) => {
        aggregate.push(<li key={comment}>{comment + ' — ' + duration.humanize()}</li>);
    });

    return <ul>{aggregate}</ul>;
};

ReactDOM.render(<RootComponent />, document.getElementById('react-root'));
