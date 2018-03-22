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