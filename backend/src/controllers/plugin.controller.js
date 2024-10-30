'use strict';
// Service
const pluginService = require('../services/plugin');

exports.getPluginFromName = async ( req, res ) => {
    const name = req.params.name;
    const accountID = req.twain.principalId;
    const plugin = await pluginService.getPluginFromName(name, accountID);

    if (!plugin) {
        return res.status(400).send(`Couldn't find plugin`);
    } else {
        return res.status(200).send(plugin);
    }
}

exports.getPluginFromQuery = async (req, res) => {
    let query = {};
    const plugin = await pluginService.getPluginFromId(req.query.id);

    if (req.query.id) {
        query.id = { '$eq': req.query.id };
    }

    if (req.query.name) {
        query.name = { '$eq': req.query.name };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt';

    const qValues = await pluginService.getPluginFromQuery(query, page, limit, sort)
    let result = {
        data: qValues.retValue,
        dataCount: qValues.count,
        currentPage: page,
        pages: Math.ceil(qValues.count/limit),
        query: query
    }

    return res.send(result);
}

exports.createPlugin = async (req, res) => {
    let plugin = await pluginService.createPlugin({
        id: req.body.id,
        name: req.body.name,
        data: req.body.data,
        accountID: req.twain.principalId
    });
    if (plugin) {
        return res.status(200).send(plugin);
    } else {
        return res.status(500).send('Failed to create plugin.');
    }

}

exports.updatePlugin = async (req, res) => {
    if (req.body.name === "") {
        return res.status(400).json({
            "errors": "body name is required",
        })
    }
    var plugin = await pluginService.getPluginFromName(req.body.name)
    if (!plugin) {
        plugin = await pluginService.createPlugin(
            {
                name: req.body.name,
                data: req.body.data,
                accountID: req.twain.principalId
            }
        )
    } else {
        plugin = await pluginService.updatePlugin(req.body.name, req.twain.principalId, req.body);
    }

    return res.status(200).send(plugin);
}
