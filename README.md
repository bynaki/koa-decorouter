# koa-decorouter

Class와 Decorator를 사용한 koa의 router이다. 기능은 koa-router와 같다. koa-decorouter는 koa-router 위에서 돌아가는 wrapper이다.


## Usage

### Method && Path && Prefix

**define router in server side:**

```ts
// filename: method-router.ts

import {
  BaseRouter,
  Get,
  Post,
  Prefix,
  IContext,
  INext,
  KoaRouter,
} from '../router'

@Prefix('/method')
class MethodRouter extends BaseRouter {
  @Get('/get')
  get(ctx: IContext, next: INext) {
    // get query
    ctx.body = ctx.query
  }

  @Post('/post')
  async post(ctx: IContext, next: INext) {
    // using 'koa-bodyparser' middleware
    ctx.body = ctx.request.body
  }
}

export default new MethodRouter().router
```

**koa app in server side:**

```ts
// filename: app.ts

import methodRouter from './method-router'
...

// register routers
app.use(methodRouter.routes())
app.use(methodRouter.allowedMethods())
```

**client side:**

```ts
import axios from 'axios'

const req = axios.create({baseURL: 'http://localhost:8110'})
const resGet = await req.get('/method/get?say=Hello%20World!!')
console.log(resGet.data)  // {say: 'Hello World!!'}
const resPost = await req.post('/method/post', {say: 'Hello World!!'})
console.log(resPost.data)  // {say: 'Hello World!!'}
```


### Params

**define router in server side:**

```ts
import {
  BaseRouter,
  Get,
  Post,
  Prefix,
  IContext,
  INext,
  KoaRouter,
} from '../router'

@Prefix('/param')
class ParamRouter extends BaseRouter {
  @Get('/:to/:path')
  toPath(ctx: IContext, next: INext) {
    ctx.body = {
      to: ctx.params.to,
      path: ctx.params.path,
    }
  }
}

export default new ParamRouter().router
```

**client side:**

```ts
import axios from 'axios'
const req = axios.create({baseURL: 'http://localhost:8110'})
const res = await req.get('/param/foo/bar')
console.log(res.data)
// {to: 'foo', path: 'bar'}
```


### @Before, @BeforeEach

@BeforeEach는 모든 method가 실행되기 전 각각 한번씩 실행 된다. @Before는 바로 밑의 method가 실행되기 전에 실행된다. 실행 순서는 @BeforeEach가 @Before보다 먼저 실행되며 해당 method에 더 가까운 Decorator가 먼저 실행된다.

**define router in server side:**

```ts
import {
  BaseRouter,
  Get,
  Post,
  Prefix,
  IContext,
  INext,
  Before,
  BeforeEach,
  BeforeEachWith,
} from '../router'

@Prefix('/before')
@BeforeEachWith(async (ctx: IContext, next: INext) => {
  ctx.order || (ctx.order = [])
  ctx.order.push(3)
  await next()
  ctx.order.push(9)
})
@BeforeEachWith(async (ctx: IContext, next: INext) => {
  ctx.order || (ctx.order = [])
  ctx.order.push(2)
  await next()
  ctx.order.push(10)
})
class BeforeRouter extends BaseRouter {
  @BeforeEach()
  async beforeEach(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(0)
    await next()
    ctx.order.push(12)
  }

  @BeforeEach()
  async beforeEach2(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(1)
    await next()
    ctx.order.push(11)
  }

  async before(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(4)
    await next()
    ctx.order.push(8)
  }

  @Before(async (ctx: IContext, next: INext) => {
    ctx.order || (ctx.order = [])
    ctx.order.push(5)
    await next()
    ctx.order.push(7)
  })
  @Before('before')
  @Get('/')
  root(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(6)
    ctx.body = {data: ctx.order}
  }
}

export default new BeforeRouter().router
```

**client side:**

```ts
import axios from 'axios'

const req = axios.create({baseURL: 'http://localhost:8110'})
const res = await req.get('/before')
const data: number[] = res.data.data
console.log(data)
// [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
```


### Authentication

**define router in server side:**

```ts
import {
  BaseRouter,
  KoaRouter,
  Get,
  Post,
  Before,
  Prefix,
  IContext,
  INext,
} from '../router'


function authentication(user: string) {
  return (ctx: IContext, next: INext) => {
    if(ctx.headers['x-access-token'] !== user) {
      ctx.throw(401, 'Unauthorized')
    }
    next()
  }
}

@Prefix('/auth')
class AuthRouter extends BaseRouter {
  @Before(authentication('naki'))
  @Get('/')
  auth(ctx: IContext, next: INext) {
    ctx.body = {data: 'Authorized!!'}
  }
}

export default new AuthRouter().router
```

**client side:**

```ts
try {
  const res = await req.get('/auth', {headers: {
    'x-access-token': 'naki'
  }})
  console.log(res.data.data)
} catch(err) {
  console.error(err.response.data.error.message)
}
// Authorized!!
```