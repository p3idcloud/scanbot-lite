export default async (req, res) => {
    try {
        return res.redirect(process.env.baseUrl + 'signin');
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};
