import { authConstants } from 'constants/auth';
import crypto from 'crypto';
import { identityProvider } from 'lib/identityProvider';
import { serviceProvider } from 'lib/serviceProvider';

export default async (req, res) => {
    if (req.method === 'POST') {
        const encodedSAMLBody = encodeURIComponent(JSON.stringify(req.body));
        const csrfToken = crypto.randomBytes(32).toString('hex');
        const csrfTokenHash = crypto.createHash('sha256').update(`${csrfToken}${process.env.APP_SECRET_STRING}`).digest('hex');
        const csrfTokenCookie = `${csrfToken}|${csrfTokenHash}`;

        res.setHeader(
            'set-cookie', 
            [
                `${authConstants.CSRF_TOKEN}=${encodeURIComponent(csrfTokenCookie)}; Path=/; HttpOnly; SameSite=Lax'`, 
                `${authConstants.CALLBACK_URL}=${encodeURIComponent(process.env.baseUrl)+'/admin/dashboard'}; Path=/; SameSite=Lax`
            ]
        );

        return res.send(
            `<html>
            <body>
                <form id="myform" action="/api/auth/bypass/saml" method="POST">
                    <input type="hidden" name="csrfTokenHash" value="${csrfTokenHash}"/>
                    <input type="hidden" name="csrfToken" value="${csrfToken}"/>
                    <input type="hidden" name="samlBody" value="${encodedSAMLBody}"/>
                    <input type="hidden" name="callbackUrl" id="callbackUrl" value="admin/dashboard"/>
                </form>
                <script>
                    let registToken;
                    function getCookie(cname) {
                      let name = cname + "=";
                      let decodedCookie = decodeURIComponent(document.cookie);
                      let ca = decodedCookie.split(';');
                      for(let i = 0; i <ca.length; i++) {
                        let c = ca[i];
                        while (c.charAt(0) == ' ') {
                          c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                          return c.substring(name.length, c.length);
                        }
                      }
                      return "";
                    }
                    registToken = getCookie('registrationToken')
                    if(registToken){
                        document.getElementById('callbackUrl').value = 'register?registrationToken='+getCookie('registrationToken');
                    }
                    document.forms[0].submit();
                </script>
            </body>
            </html>`
        );
    }

    const createLoginRequestUrl = (identityProvider, options = {}) =>
        new Promise((resolve, reject) => {
            serviceProvider.create_login_request_url(
                identityProvider,
                options,
                (error, loginUrl) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(loginUrl);
                }
            );
        });

    try {
        const loginUrl = await createLoginRequestUrl(identityProvider, { force_authn: true });
        return res.redirect(loginUrl);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};
