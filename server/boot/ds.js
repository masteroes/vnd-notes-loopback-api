module.exports = (app, cb) => {
  console.log('DATASOURCES: ', Object.keys(app.datasources));

  Object.keys(app.datasources).forEach((datasource) => {
    const ds = app.datasources[datasource];
    ds.connector.observe('before execute', function (ctx, next) {
      // console.log('ctx', ctx)
      console.log('Request URI ----> ', ctx.req.uri);
      // console.log('Request headers ----> ', ctx.req.headers);
      // console.log('Request params ----> ', ctx.req);
      console.log('Request method ----> ', ctx.req.method);
      console.log('Before hook - request body ----> ', JSON.stringify(ctx.req.body, null, 2));
      next();
    });
    ds.connector.observe('after execute', function (ctx, next) {
      console.log('After hook - response status ----> ', ctx.res.statusCode);
      // console.log('After hook - response body ----> ', JSON.stringify(ctx.res.body, null, 2));
      next();
    });
  });

  cb();
};
