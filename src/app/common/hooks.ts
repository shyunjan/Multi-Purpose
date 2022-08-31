import { FastifyInstance, RouteOptions, preValidationHookHandler } from 'fastify';

export default function addFastifyHook(server: FastifyInstance): FastifyInstance {
  return server.addHook('onRoute', (routeOptions: RouteOptions) => {
    const url = routeOptions.url;
    let preValidationHooker: preValidationHookHandler[] = [];

    if (url.includes('/auth/get')) {
      preValidationHooker.push((request, reply, done) => {
        console.log('Hooking preValidation-1...');
        done();
      });
      preValidationHooker.push((request, reply, done) => {
        console.log('Hooking preValidation-2...');
        done();
      });
    }

    routeOptions.preValidation = preValidationHooker;
  });

  // return server.addHook('preValidation', (request, reply, done) => {

  //   console.log('Hooking preValidation...');
  //   done(); // express middleware의 next();와 동일
  // });
}
