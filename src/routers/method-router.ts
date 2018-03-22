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
    ctx.body = {data: ctx.query}
  }

  @Post('/post')
  async post(ctx: IContext, next: INext) {
    // using 'koa-bodyparser' middleware
    ctx.body = {data: ctx.request.body}
  }
}

export default new MethodRouter().router