import { serviceProvider } from 'lib/serviceProvider';

export default async (req, res) => {
    const createLogoutRequestUrl = (identityProvider, options = {}) =>
        new Promise((resolve, reject) => {
            serviceProvider.create_logout_request_url(
                identityProvider,
                options,
                (error, logoutUrl) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(logoutUrl);
                }
            );
        });

    try {
        // const logoutUrl = await createLogoutRequestUrl(identityProvider);
        return res.redirect(process.env.baseUrl + 'signin');
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};
