module.exports = {
    apps: [
      {
        name: 'AT-File Server',
        script: 'index.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production'
        },
        log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS'
      }
    ]
  };