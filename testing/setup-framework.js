// making sure we handle unhandled rejections in a way that is useful for
// finding the cause

/* globals process */
/* istanbul ignore next */
// eslint-disable-next-line no-process-env
if (!process.env.handlingUnhandledRejection) {
  /* istanbul ignore next */
  process.on('unhandledRejection', (err)=> {
    throw err;
  });
  // eslint-disable-next-line no-process-env
  process.env.handlingUnhandledRejection = true;
}
