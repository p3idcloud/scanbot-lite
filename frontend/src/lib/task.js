export const constructTwainPayloadTask = (configData) => {
    function recurse(currentJson, value, currentPath, attribute) {
        if (currentPath.length === 0) {
            return;
        }
        const [_key, ...rest] = currentPath;
        const { dataType: keyType, name } = mapDataType(_key);
        switch(keyType) {
            case 'primitive':
                // Leaf json or task
                if (currentPath.length === 1)
                    currentJson[name] = value;
                else {
                    const childJson = recurse(currentJson[name] ?? {}, value, [...rest], attribute); 
                    currentJson[name] = childJson;
                }
                break;
            case 'array':
                // Will have a child json
                if (name === 'values') {
                    const childJson = recurse({}, value, [...rest], attribute);
                    if (currentJson.hasOwnProperty(name)) {
                        // Add to array
                        currentJson[name].push(childJson);
                    } else {
                        // Create new array
                        currentJson[name] = [childJson];
                    }
                } else if (rest?.[0] === 'values[]') {
                    var indexAttr = -1; 
                    currentJson[name]?.forEach((attr, index) => {
                        if (attr.attribute === attribute) {
                            indexAttr = index;
                        }
                    })
                    const childJson = recurse(currentJson[name][indexAttr] ?? {}, value, [...rest], attribute);
                    currentJson[name][indexAttr] = childJson;
                } else {
                    const childJson = recurse(currentJson[name][0] ?? {}, value, [...rest], attribute);
                    currentJson[name][0] = childJson;
                }
                break;
        }
        return currentJson;
    }
    
    const twainPayloadTask = {
        task: {
            actions: [{
                action: 'configure',
                streams: [{
                    sources: [{
                        pixelFormats: [{
                            attributes: []
                        }]
                    }]
                }]
            }]
        }
    };
    
    Object.keys(configData).forEach(attribute => {
        if (configData[attribute].object.includes('attributes')) {
            twainPayloadTask.task.actions[0].streams[0].sources[0].pixelFormats[0].attributes.push({
                attribute: attribute
            })
        }
        const objectPath = configData[attribute].object.split('.');
        switch(configData[attribute].type) {
            case 'select':
                delete configData[attribute].inputValue;
                break;
            case 'select/integer':
                configData[attribute].inputValue = parseInt(configData[attribute].inputValue);
                break;
            case 'integer':
                delete configData[attribute].selectValue;
                configData[attribute].inputValue = parseInt(configData[attribute].inputValue);
                break;
        };
        if (configData[attribute].inputValue)
            recurse(twainPayloadTask, configData[attribute].inputValue, objectPath, attribute);
        if (configData[attribute].selectValue)
            recurse(twainPayloadTask, configData[attribute].selectValue, objectPath, attribute);
    });

    return twainPayloadTask.task;
};

export const mapDataType = (name) => {
    let dataType = 'primitive';
    if (name.endsWith('[]')) {
        dataType = 'array';
        name = name.substring(0, name.length - 2);
    }
    return { dataType, name };
};

export const findTypeOfValue = (value, list) => {
    try {
        for (let i = 0; i < list.length; i++) {
            if (list?.[i]?.value === value) {
                return list?.[i]?.type;
            }
        }
    } catch {
        return 'select';
    }
    return 'select';
}