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
      data: {
        to: ctx.params.to,
        path: ctx.params.path,
      }
    }
  }
}

export default new ParamRouter().router