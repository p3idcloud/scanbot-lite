import { FilledInput, MenuItem } from "@mui/core";
import { FormGroup, Select } from "@mui/material";
import RegularButton from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useScanner } from "lib/contexts/scannerContext";
import ProfileScanner from "./ProfileScanner";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";


export default function ScannerConfig() {
    const { 
        listProfileScanner,
        profileSelect,
        setProfileSelect,
        setListScannerSettings,
        formSetting,
        setFormSetting,
        setSaveProfile,
        isChange,
        setIsChange,
        listScannerSettings,
    } = useScanner();

    const handleChange = (type, item) => {
        if (type === "profileSelect") {
          setListScannerSettings(null);
          setFormSetting({
            id: item.id,
            name: "",
            scannerSettings: item.listScannerSettings,
          });
          dispatch(getAllScannerSettings());
          return setProfileSelect(item);
        }
    };
    const handleDelete = (i, idx) => {
        let scannerSettings = [...listScannerSettings];
        if (profileSelect) {
          let profileScannerSelect = profileSelect;
          let profileScannerSettings =
            profileScannerSelect?.scannerSettings?.filter(
              (setting) =>
                setting.value !== scannerSettings[idx].currentValue[i].id
            );
          profileScannerSelect.scannerSettings = profileScannerSettings;
          setProfileSelect({ ...profileScannerSelect });
        }
    
        scannerSettings[idx].currentValue = scannerSettings[
          idx
        ].currentValue.filter((_, index) => index !== i);
        scannerSettings[idx].multiple = true;
        setListScannerSettings([...scannerSettings]);
    };
    const setConfigValue = (value, idx) => {
        let scannerSettings = [...listScannerSettings];
        scannerSettings[idx].currentValue = value
        setListScannerSettings([...scannerSettings]);
        setIsChange(true);
        setFormSetting({
          ...formSetting,
          scannerSettings: scannerSettings.map((item) => ({
            id: item.id,
            value: item.currentValue,
          })),
        });
    
        if (profileSelect) {
          profileSelect?.scannerSettings?.forEach((setting, i) => {
            if (setting.id === scannerSettings[idx].id) {
              profileSelect.scannerSettings[i].value = value;
            }
          });
          setProfileSelect({ ...profileSelect });
        }
    };
    const handleAddition = (tag, idx) => {
        let scannerSettings = [...listScannerSettings];
        scannerSettings[idx].currentValue = [
          ...scannerSettings[idx].currentValue,
          tag,
        ];
        setListScannerSettings([...scannerSettings]);
    
        if (profileSelect) {
          profileSelect.scannerSettings.push({
            id: scannerSettings[idx].id,
            value: tag.text,
          });
          setProfileSelect({ ...profileSelect });
        }
    };
    const handleDrag = (tag, currPos, newPos, idx) => {
        let scannerSettings = [...listScannerSettings];
        const tags = [...scannerSettings[idx].currentValue];
        const newTags = tags.slice();
    
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
    
        scannerSettings[idx].currentValue = newTags;
        setListScannerSettings([...scannerSettings]);
    
        if (profileSelect) {
          let profileScannerSettings = profileSelect.scannerSettings.filter(
            (setting) => setting.id !== scannerSettings[idx].id
          );
    
          newTags.forEach((t) => {
            profileScannerSettings.push({
              id: scannerSettings[idx].id,
              value: t.text,
            });
          });
    
          profileSelect.scannerSettings = profileScannerSettings;
          setProfileSelect({ ...profileSelect });
        }
    };
    const setTagValue = (value, idx) => {
        let scannerSettings = [...listScannerSettings];
        const possibleValues = scannerSettings[idx].possibleValues.map(
          (pv) => pv.value
        );
        const dynamicValueType = ["any", "integer"];
        const idxPossibleValue = possibleValues.indexOf(value);
        scannerSettings[idx].currentValue = {
          ...scannerSettings[idx].currentValue,
          tagValue: value,
          tag:
            idxPossibleValue !== -1 && dynamicValueType.indexOf(value) === -1
              ? "select"
              : "input",
        };
        setListScannerSettings([...scannerSettings]);
        setIsChange(true);
        setFormSetting({
          ...formSetting,
          scannerSettings: scannerSettings.map((item) => ({
            id: item.id,
            value: item.currentValue.text,
          })),
        });
    
        if (dynamicValueType.indexOf(value) >= 0) {
          setConfigValue(0, idx);
        } else {
          setConfigValue(value, idx);
        }
    };
    const handleChangeTag = (value, idx) => {
        setTagValue(value, idx);
        setFormSetting({
          ...formSetting,
          name: "",
        });
    };
    const getConfigValues = () => {
        if (listScannerSettings) {
          let configFields = [...listScannerSettings];
          profileSelect?.scannerSettings?.forEach((profile) => {
            configFields.forEach((config) => {
              if (config.id === profile.id) {
                let tag = "input";
                const possibleValues = config.possibleValues.map((pv) => pv.value);
                let tagValue = possibleValues[0];
                const idxPossibleValue = possibleValues.indexOf(profile.value);
                if (idxPossibleValue >= 0) {
                  tag = "select";
                  tagValue = possibleValues[idxPossibleValue];
                }
                if (config.currentValue && config.currentValue.length > 0) {
                  const find = config.currentValue.filter(
                    (x) => x.id === profile.value
                  );
                  if (find.length <= 0) {
                    config.currentValue.push({
                      id: profile.value,
                      text: profile.value,
                      tagValue,
                      tag,
                    });
                  }
                } else {
                  config.currentValue = [
                    {
                      id: profile.value,
                      text: profile.value,
                      tagValue,
                      tag,
                    },
                  ];
                }
              }
            });
          });
          return configFields;
        }
        return [];
    };
    
    return (
        <GridContainer>
            <GridItem xs={12} sm={6}>
            <div className="flex justify-between items-end space-x-2">
                <div className=" flex flex-col w-full">
                {/* <Listbox
                    list={listProfileScanner}
                    selected={profileSelect}
                    setSelected={setProfileSelect}
                    itemTitle="name"
                    onChange={(item) => handleChange("profileSelect", item)}
                /> */}
                </div>
            </div>
            </GridItem>
            <GridItem xs={12} sm={6}>
            {profileSelect?.id && (
                <RegularButton
                    onClick={handleDeleteProfile}
                    color='info'
                >
                Delete
                </RegularButton>
            )}
            {isChange && (
                <RegularButton
                    disabled={true}
                    onClick={() => setSaveProfile(true)}
                    color='info'
                >
                Save as New Profile
                </RegularButton>
            )}
            </GridItem>
            {getConfigValues().map((data, i) => (
            <GridItem xs={12} sm={6} className="mt-3" key={i}>
                {data?.currentValue ? (
                <Card>
                    <CardHeader>
                        <p>{data.labelName}</p>
                    </CardHeader>
                    <span className="block truncate">
                        {/* {data.currentValue.length > 1 || data.multiple ? (
                        <ReactTags
                            tags={data.currentValue}
                            handleDelete={(index) => handleDelete(index, i)}
                            handleAddition={(tag) => handleAddition(tag, i)}
                            handleDrag={(tag, currPos, newPos) =>
                            handleDrag(tag, currPos, newPos, i)
                            }
                            delimiters={delimiters}
                            placeholder={`Add new ${data.labelName}`}
                        />
                        ) : ( */}
                        {(<span>
                            {
                            <>
                                <FormGroup>
                                    <Select
                                        onChange={(e) =>
                                        handleChangeTag(e.target.value, i)
                                        }
                                        value={data.possibleValues[0].value}
                                    >
                                        {data.possibleValues.map((pv) => (
                                        <MenuItem value={pv.value}>
                                            {pv.value}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <FilledInput
                                    fullWidth
                                    value={data?.currentValue}
                                    onChange={(e) =>
                                        setConfigValue(e.target.value, i)
                                }
                                />
                            </>
                            }
                        </span>
                        )}
                    </span>
                </Card>
                ) : null}
            </GridItem>
            ))}
            {(profileSelect?.name !== "default" ||
            isChange ||
            profileSelect?.id) && (
            <GridItem xs={12} sm={12}>
                <ProfileScanner />
            </GridItem>
            )}
        </GridContainer>
    )
}