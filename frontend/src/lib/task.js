export const constructTwainPayloadTask = (profileDefinitions, scannerSettings) => {
    const profileDefinitionData = mapProfileDefinitionScannerSetting(profileDefinitions, scannerSettings);
    let twainPayloadTask = {};

    profileDefinitionData.forEach((definition) => {
        const objectArr = definition.objectArr;
        let currentValue = twainPayloadTask;
        let parentValue = twainPayloadTask;

        for (let i = 0; i < objectArr.length; i++) {
            if (i >= objectArr.length - 1) {
                const dataType = mapDataType(objectArr[i - 1]);
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
                const dataType = mapDataType(objectArr[i]);
                let value = currentValue;
                if (i > 0) {
                    const parentKey = objectArr[i - 1].replace(/[[]]|[{}]/g, '');
                    const parentDataType = mapDataType(objectArr[i - 1]);
                    console.log(parentKey, parentDataType);
                    let newCurrentValueIndex = 0;
                    if (parentDataType === 'array') {
                        if (parentValue[parentKey].length <= 0 || (parentKey === 'attributes' && parentValue[parentKey].length > 0)) {
                            switch (parentKey) {
                                case 'attributes':
                                    let found = false;
                                    console.log(definition.name, parentValue[parentKey]);
                                    parentValue[parentKey].find((item, idx) => {
                                        console.log(idx, item.attribute, definition.name, item.attribute === definition.name);
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

    console.log(JSON.stringify(twainPayloadTask, null, 1));
    return twainPayloadTask;
};

export const mapProfileDefinitionScannerSetting = (profileDefinitions, scannerSettings) => {
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
                ...mapSettingDataType(scannerSettingData[definition.id]),
            });
        }
    });

    return profileDefinitionData;
};

export const mapSettingDataType = (setting) => {
    const objectArr = setting.object.split('.').filter((obj) => obj !== 'task');
    const level = objectArr.length;
    const name = setting.labelName;
    const id = objectArr[level - 1].replace(/[[]]|[{}]/g, '');
    const dataType = mapDataType(name);

    return {
        level,
        name,
        dataType,
        id,
        objectArr,
    };
};

export const mapDataType = (name) => {
    let dataType = 'primitive';
    if (name.endsWith('[]')) {
        dataType = 'array';
    }
    else if (name.endsWith('{}')) {
        dataType = 'object';
    }
    return dataType;
};