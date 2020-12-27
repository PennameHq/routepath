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
console.log(url)
// prints: /article/abc123?position=middle&ref=twitter
```
