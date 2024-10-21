exports.generateOpentextURL = (domain) => {
    let opentextDomain;
    let opentextCSSDomain;

    if ((domain ?? '').startsWith('http')) {
        opentextDomain = domain;
        opentextCSSDomain = `https://css.${new URL(domain).hostname}`; // Extracts hostname from the URL
    } else {
        opentextDomain = `https://${domain}`;
        opentextCSSDomain = `https://css.${domain}`;
    }

    return {
        opentextDomain,
        opentextCSSDomain
    };
};