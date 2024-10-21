/*
 * Copyright (C) 2016-2024 P3iD Technologies Inc. (https://p3idtech.com)
 * license[at]p3idtech[dot]com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const mongo = require('../models');
const opentext = mongo.db.opentext;
const uuid = require('uuid');


exports.createOpentext = async (data) => {
    if (data.id) {delete data.id}
    data.id = uuid.v4();
    return opentext(data).save();
}


exports.updateOpentext = async (id, data) => {
    try {
        if (data.id) { delete data.id }

        return opentext.updateOne({ scannerHistoryId: id }, data, {upsert: true}).exec();
    } catch (e) {
        console.log(e);
    }
}


exports.findOne = async (id) => {
    try {
        return opentext.findOne({ scannerHistoryId: id }).exec()
    }catch (e) {
        console.log(e);
    }
}

exports.getApiKey = async (data) => {
    return opentext.findOne(data);
}