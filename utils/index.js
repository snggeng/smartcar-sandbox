  const getToken = (headers) => {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  
  const mapAsync = function(fn) {
    return Promise.all(this.map(fn))
  }
  
  const filterAsync = function(fn) {
    return this.mapAsync(fn).then(_arr => this.filter((v, i) => !!_arr[i]))
  }
  
  const forEachAsync = function(fn) {
    return this.reduce((promise, n) => promise.then(() => fn(n)), Promise.resolve())
  }
  
  const reduceAsync = function(fn, initial) {
    return Promise.resolve(initial).then(cur => {
      return this.forEachAsync(async function(v, i) {
        cur = await fn(cur, v, i);
      }).then(() => cur);
    })
  }
  
  const setDateFields = (doc) => {
    now = new Date()
  
    doc.updated_at = now
  
    if ( !doc.created_at ) {
      doc.created_at = now;
    }
  }
  
  module.exports = {
    getToken,
    mapAsync,
    filterAsync,
    forEachAsync,
    reduceAsync,
    setDateFields
  }
  