const { OAuth2Server } = require('oauth2-mock-server');

const server = new OAuth2Server();

const mock = async () => {
    await server.issuer.keys.generateRSA();
    await server.start(8080, 'localhost');
};

const stop = () => server.stop();

export default { mock, stop };
