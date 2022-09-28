'use strict';

exports.constructTwainPayloadTask = (profileDefinitions, scannerSettings) => {
    const profileDefinitionData = this.mapProfileDefinitionScannerSetting(profileDefinitions, scannerSettings);
    let twainPayloadTask = {};

    profileDefinitionData.forEach((definition) => {
        const objectArr = definition.objectArr;
        let currentValue = twainPayloadTask;
        let parentValue = twainPayloadTask;

        for (let i = 0; i < objectArr.length; i++) {
            if (i >= objectArr.length - 1) {
                const dataType = this.mapDataType(objectArr[i - 1]);
                let value = currentValue;
                switch (dataType) {
                    case 'object':
                        value = {
                            [objectArr[i]]: definition.value,
                        };
                        break;

                    case 'array':
                        value.push({
                            [objectArr[i]]: definition.value,
                        });
                        break;
                }
            }
            else {
                const key = objectArr[i].replace(/[[]]|[{}]/g, '');
                const dataType = this.mapDataType(objectArr[i]);
                let value = currentValue;
                if (i > 0) {
                    const parentKey = objectArr[i - 1].replace(/[[]]|[{}]/g, '');
                    const parentDataType = this.mapDataType(objectArr[i - 1]);
                    let newCurrentValueIndex = 0;
                    if (parentDataType === 'array') {
                        if (parentValue[parentKey].length <= 0 || (parentKey === 'attributes' && parentValue[parentKey].length > 0)) {
                            switch (parentKey) {
                                case 'attributes':
                                    let found = false;
                                    parentValue[parentKey].find((item, idx) => {
                                        if (item.attribute === definition.name) {
                                            found = true;
                                            newCurrentValueIndex = idx;
                                            return true;
                                        }
                                        return false;
                                    });
                                    if (!found) {
                                        parentValue[parentKey].push({attribute: definition.name});
                                        newCurrentValueIndex = parentValue[parentKey].length - 1;
                                    }
                                    break;

                                case 'actions':
                                    parentValue[parentKey].push({action: 'configure'});
                                    newCurrentValueIndex = parentValue[parentKey].length - 1;
                                    break;

                                default:
                                    parentValue[parentKey].push({});
                                    newCurrentValueIndex = parentValue[parentKey].length - 1;
                                    break;
                            }
                        }

                        currentValue = parentValue[parentKey][newCurrentValueIndex];
                        value = currentValue;
                    }
                }

                let newValue = currentValue[key] ? currentValue[key] : {};
                switch (dataType) {
                    case 'array':
                        newValue = currentValue[key] ? currentValue[key] : [];
                        break;
                }

                value[key] = newValue;
                parentValue = currentValue;
                currentValue = value[key];
            }
        }
    });

    return twainPayloadTask;
};

exports.mapProfileDefinitionScannerSetting = (profileDefinitions, scannerSettings) => {
    let profileDefinitionData = [];
    let scannerSettingData = {};
    scannerSettings.forEach((setting) => {
        if (!scannerSettingData[setting.id]) {
            scannerSettingData[setting.id] = setting;
        }
    });

    profileDefinitions.forEach((definition) => {
        if (scannerSettingData[definition.id]) {
            profileDefinitionData.push({
                value: definition.value,
                ...this.mapSettingDataType(scannerSettingData[definition.id]),
            });
        }
    });

    return profileDefinitionData;
};

exports.mapSettingDataType = (setting) => {
    const objectArr = setting.object.split('.').filter((obj) => obj !== 'task');
    const level = objectArr.length;
    const name = setting.labelName;
    const id = objectArr[level - 1].replace(/[[]]|[{}]/g, '');
    const dataType = this.mapDataType(name);

    return {
        level,
        name,
        dataType,
        id,
        objectArr,
    };
};

exports.mapDataType = (name) => {
    let dataType = 'primitive';
    if (name.endsWith('[]')) {
        dataType = 'array';
    }
    else if (name.endsWith('{}')) {
        dataType = 'object';
    }
    return dataType;
};