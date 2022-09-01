import { FastifyInstance, RouteOptions, preValidationHookHandler } from 'fastify';

const checkAdminAuthUrl: string[] = [
  // 어드민 권한이 필요한 API Url List
  '/auth/get-users',
];
const checkLoginAuthUrl: string[] = [
  // 어드민 권한까지는 필요없지만 로그인이 필요한 API Url List
  '/auth/get',
].concat(checkAdminAuthUrl);

export default function addFastifyHook(server: FastifyInstance): FastifyInstance {
  return server.addHook('onRoute', (routeOptions: RouteOptions) => {
    const url = routeOptions.url;
    let preValidationHooker: preValidationHookHandler[] = [];

    if (checkLoginAuthUrl.some((u) => url.includes(u))) {
      preValidationHooker.push((request, reply, done) => {
        console.log('Hooking preValidation for Login Authorization...');
        done();
      });
      if (checkAdminAuthUrl.some((u) => url.includes(u))) {
        preValidationHooker.push((request, reply, done) => {
          console.log('Hooking preValidation for Admin Authorization...');
          done();
        });
      }
    }

    routeOptions.preValidation = preValidationHooker;
  });
}
