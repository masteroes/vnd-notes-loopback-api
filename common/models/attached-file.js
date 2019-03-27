'use strict';
'use strict';

const fs = require('fs');
const formidable = require('formidable');

const BUCKET = 'test';

module.exports = (Attachedfile) => {
  Attachedfile.upload = (req, res, body, cb) => {
    try {
      const { name: storageName, root: storageRoot } = Attachedfile.app.dataSources.storage.settings;

      if (storageName === 'storage') {
        const path = `${storageRoot}${BUCKET}/`;

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      }
    } catch (error) {

    }

    const Container = Attachedfile.app.models.Container;
    const form = new formidable.IncomingForm();

    const filePromise = new Promise((resolve, reject) => {
      Container.upload(req, res, {
        container: BUCKET
      }, (error, fileObj) => {
        if (error) {
          return reject(error);
        }

        const fileInfo = fileObj.files.file[0];

        resolve(fileInfo);
      });
    });

    const fieldsPromise = new Promise((resolve, reject) => {
      form.parse(req, (error, fields, files) => {
        if (error) return reject(error);

        resolve(fields);
      });
    });

    Promise.all([filePromise, fieldsPromise])
      .then(([fileInfo, fields]) => {
        const url = (fileInfo.providerResponse && fileInfo.providerResponse.location);
        Attachedfile.create(Object.assign({
          filename: fileInfo.name,
          url,
          type: fileInfo.type,
          size: fileInfo.size
        }, fields), (error, reply) => {
          if (error) return cb(error);
          cb(null, reply);
        });
      })
      .catch(error => cb(error));
  };
};
