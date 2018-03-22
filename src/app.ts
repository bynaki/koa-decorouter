import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'

import methodRouter from './routers/method-router'
import paramRouter from './routers/param-router'
import beforeRouter from './routers/before-router'
import authRouter from './routers/auth-router'

const app = new Koa()

// look ma, error propagation!
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(err) {
    ctx.status = err.status || 500
    ctx.body = {
      data: null,
      error: err,
    }
    ctx.app.emit('error', err, ctx)
  }
})

// body parser
app.use(bodyParser())

// register routers
app.use(methodRouter.routes())
app.use(methodRouter.allowedMethods())
app.use(paramRouter.routes())
app.use(paramRouter.allowedMethods())
app.use(beforeRouter.routes())
app.use(beforeRouter.allowedMethods())
app.use(authRouter.routes())
app.use(authRouter.allowedMethods())

// not found
app.use(ctx => {
  ctx.throw(404, `requested ${ctx.method} ${ctx.url}`)
})

// error handler
app.on('error', err => {
  console.error(err.message)
})

export default app
