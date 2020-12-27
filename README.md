`npm install --save @penname/routepath`

# routepath

Convenient API route interface.

```javascript
const RoutePath = require('@penname/routepath')
const route = RoutePath.instance({ path: '/article/:id', baseUrl: 'example.com' })

const url = route.buildUrl({
	params: { id: 'abc123' },
	query: { position: 'middle', ref: 'twitter' },
})
console.log(url)
// prints: example.com/article/abc123?position=middle&ref=twitter

const path = route.buildPath({
	params: { id: 'abc123' },
	query: { position: 'middle', ref: 'twitter' },
})
console.log(path)
// prints: /article/abc123?position=middle&ref=twitter
```

# Methods

## `#instance()`

Create a route path instance with a minimum of `baseUrl`, `path`:

```javascript
const route = RoutePath.instance({ path: '/article/:id', baseUrl: 'https://example.com' })
```

## `#buildUrl()`

Builds the url from the route path with the provided `params` and `query`

```javascript
const route = RoutePath.instance({ path: '/article/:id', baseUrl: 'localhost:3000/api/' })

const url = route.buildUrl({
	params: { id: 'abc123' },
	query: { position: 'middle', ref: 'twitter' },
})

console.log(url)
// prints: localhost:3000/api/article/abc123?position=middle&ref=twitter
```

## `#buildPath()`

Builds the url path, no host, from the route path with the provided `params` and `query`

```javascript
const route = RoutePath.instance({
	path: '/user/:userId/article/:articleId',
	baseUrl: 'http://www.example.com',
})

const path = route.buildPath({
	params: { userId: 'u1cba', articleId: 'abc123' },
	query: { position: 'middle', date: 1609036608349 },
})

console.log(path)
// prints: /user/u1cba/article/abc123?position=middle&date=1609036608349
```

# `#fromSerialized()`

```javascript
const routeFromJsonString = RoutePath.fromSerialized(
	`{path: "/user/:id/articles", "baseUrl": 'example.com/api/' }`,
)

const url = route.buildUrl({
	params: { id: 'u1cba' },
	query: { from: 'abc456', limit: 15 },
})

console.log(url)
// prints: example.com/api/user/u1cba/articles?from=abc456&limit=15
```
