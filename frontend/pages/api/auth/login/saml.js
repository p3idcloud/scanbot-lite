export default async (req, res) => {
    res.redirect(`${process.env.backendUrl}api/auth/signin`);
};
