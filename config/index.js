const config = {
  'production': {
    'PORT': 8080,
    'secret': process.env.PRODUCTION_SECRET,
    'database': process.env.MONGODB_URI,
  },
  'development': {
    'PORT': 3000,
    'secret': process.env.DEVELOPMENT_SECRET,
    'database': process.env.MONGODB_URI,
  },
  'test': {
    'PORT': 3001,
    'secret': process.env.TEST_SECRET,
    'database': 'mongodb://localhost/test',
  }
};


const get = (env) => {
  return config[env] || config.development
}

module.exports = get
