module.exports = (app, params) => {
  Object.keys(params).forEach(model =>
    params[model]
      .forEach(methodToDisable =>
        app.models[model].disableRemoteMethodByName(methodToDisable, true)
      )
  );
};
