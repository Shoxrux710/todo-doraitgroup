module.exports = {
    apps: [
        {
            name: 'todoChat',
            script: 'server.js',
            env: {
                "NODE_ENV": "production"
            }
        }
    ]
}