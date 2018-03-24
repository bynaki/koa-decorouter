/**
 * Define Router
 */

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


function authentication() {
  return (ctx: IContext, next: INext) => {
    if(ctx.headers['x-access-token'] !== ctx.params.user) {
      ctx.throw(401, 'Unauthorized')
    }
    next()
  }
}

@Prefix('/auth')
class AuthRouter extends BaseRouter {
  @Before(authentication())
  @Get('/:user')
  auth(ctx: IContext, next: INext) {
    ctx.body = {data: 'Authorized!!'}
  }
}

export default new AuthRouter().router