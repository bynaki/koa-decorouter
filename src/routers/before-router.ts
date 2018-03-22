import {
  BaseRouter,
  KoaRouter,
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