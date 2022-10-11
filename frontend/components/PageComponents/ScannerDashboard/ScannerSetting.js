import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import ScannerSettingForm from "./ScannerSettingForm";
import GridContainer from 'components/Grid/GridContainer';
import RegularButton from 'components/CustomButtons/Button';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { FormControl, MenuItem, Select } from '@mui/material';
import { fetchData } from 'lib/fetch';

export default function ScannerSetting() {
    const { data } = useSWR(
        `${process.env.backendUrl}api/scannersetting`,
        fetchData
    ).data ?? { data: [] };
    const [tab, setTab] = useState(data[0]?.labelName ?? '');

    const handleTab = (e) => {
        console.log(e.target.value);
        setTab(e.target.value);
    };

    useEffect(() => {
        if (data.length === 0) {
            setTab('');
        } else {
            setTab(data[0]?.labelName ?? '');
        }
    }, [data]);

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <GridContainer>
            <GridItem xs={12} lg={3}>
                <Card>
                    <CardHeader >
                        <h3>Scanner Configuration</h3>
                    </CardHeader>
                    <CardBody>
                        <FormControl fullWidth>
                            <Select
                                variant="standard"
                                value={tab}
                                onChange={handleTab}
                            >
                                {data?.map((item, index) => {
                                    return (
                                        <MenuItem
                                            sx={{
                                                bgcolor: tab === item?.labelName && "info",
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    color: 'info'
                                                },
                                                width: '100%'
                                            }}
                                            value={item?.labelName}
                                            key={index}
                                        >
                                            {item?.labelName}
                                        </MenuItem>
                                    );       
                                    })
                                }
                            </Select>
                        </FormControl>
                    </CardBody>
                </Card>
                
                {tab !== '' && (
                    <RegularButton
                        
                        onClick={() => setTab('')}
                    >
                        Add New
                    </RegularButton>
                )}
            </GridItem>
            <GridItem xs={12} lg={9}>
                {data?.map((item, index) => {
                if (tab === item?.labelName) {
                    return (
                    <ScannerSettingForm
                        data={data?.[index]}
                        key={item.labelName}
                        mutate={mutate}
                        tab={index}
                    />
                    );
                }
                })}
                {tab === '' && <ScannerSettingForm mutate={mutate} tab={-1} key={''} />}
            </GridItem>
        </GridContainer>
        </>
    );
}