# y-websocket :tophat:

> WebSocket Provider for Yjs

The Websocket Provider implements a classical client server model. Clients
connect to a single endpoint over Websocket. The server distributes awareness
information and document updates among clients.

This repository contains a simple in-memory backend that can persist to
databases, but it can't be scaled easily. The
[y-redis](https://github.com/yjs/y-redis/) repository contains an alternative
backend that is scalable, provides auth*, and can persist to different backends.

The Websocket Provider is a solid choice if you want a central source that
handles authentication and authorization. Websockets also send header
information and cookies, so you can use existing authentication mechanisms with
this server.

* Supports cross-tab communication. When you open the same document in the same
browser, changes on the document are exchanged via cross-tab communication
([Broadcast
Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
and
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
as fallback).
* Supports exchange of awareness information (e.g. cursors).

## Websocket Server

Start a y-websocket server:

```sh
HOST=localhost PORT=1234 npx y-websocket
```

Since npm symlinks the `y-websocket` executable from your local `./node_modules/.bin` folder, you can simply run npx. The `PORT` environment variable already defaults to 1234, and `HOST` defaults to `localhost`.

### Websocket Server with Persistence

Persist document updates in a LevelDB database.

See [LevelDB Persistence](https://github.com/yjs/y-leveldb) for more info.

```sh
HOST=localhost PORT=1234 YPERSISTENCE=./dbDir node ./node_modules/y-websocket/bin/server.js
```

### Websocket Server with HTTP callback

Send a debounced callback to an HTTP server (`POST`) on document update. Note that this implementation doesn't implement a retry logic in case the `CALLBACK_URL` does not work.

Can take the following ENV variables:

* `CALLBACK_URL` : Callback server URL
* `CALLBACK_DEBOUNCE_WAIT` : Debounce time between callbacks (in ms). Defaults to 2000 ms
* `CALLBACK_DEBOUNCE_MAXWAIT` : Maximum time to wait before callback. Defaults to 10 seconds
* `CALLBACK_TIMEOUT` : Timeout for the HTTP call. Defaults to 5 seconds
* `CALLBACK_OBJECTS` : JSON of shared objects to get data (`'{"SHARED_OBJECT_NAME":"SHARED_OBJECT_TYPE}'`)

```sh
CALLBACK_URL=http://localhost:3000/ CALLBACK_OBJECTS='{"prosemirror":"XmlFragment"}' npm start
```

This sends a debounced callback to `localhost:3000` 2 seconds after receiving an update (default `DEBOUNCE_WAIT`) with the data of an XmlFragment named `"prosemirror"` in the body.

## License

[The MIT License](./LICENSE) © Kevin Jahns
