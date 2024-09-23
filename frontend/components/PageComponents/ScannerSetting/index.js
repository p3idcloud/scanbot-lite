import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Box, FormControl, Grid, Typography } from '@mui/material';
import { fetchData } from 'lib/fetch';
import Button from 'components/Button';
import Link from 'next/link';
import Header from 'components/Header';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import Select from 'components/Select';
import { capitalize } from 'lib/helpers';
import ScannerSettingForm from './Form/';

export default function ScannerSetting() {
    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/scannersetting?limit=999999`,
        fetchData
    ).data ?? { data: [] };
    const [tab, setTab] = useState(data[0]?.labelName ?? '');

    const handleTab = (e) => {
        setTab(e.target.value);
    };

    const handleClick = () => {
        if (tab !== '')
            setTab('');
        else 
            setTab(data[0]?.labelName);
    }

    useEffect(() => {
        if (data.length === 0) {
            setTab('');
        } else {
            setTab(data[0]?.labelName ?? '');
        }
    }, [data]);

    const headerComponent = (
        <Grid 
            direction={{
                xs: "column",
                md: "row"
            }}
            container
            maxWidth="lg"
            justifyContent="space-between"
        >
            <Grid item xs={6} container>
                <Box>
                    <Typography fontWeight={500} sx={{color: '#0D0D0D'}} fontSize='20px'>
                        {tab === '' ? 'Create New Configuration' : 'Scanner Configuration'}
                    </Typography>
                    
                    {tab !== '' && (
                        <FormControl sx={{width: 400, mt: 2, mb: 1}}>
                            <Select
                                label="Select Config"
                                value={tab}
                                lists={data?.map(item => {
                                    return {
                                        label: capitalize(item?.labelName),
                                        value: item?.labelName
                                    };
                                })}
                                onChange={handleTab}
                            />
                        </FormControl>
                    )}
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box display='flex' flexDirection='column' alignItems="end">
                    <Button
                        autoWidth
                        startIcon={tab !== '' ? <AiOutlinePlus /> : <AiOutlineEdit />}
                        onClick={handleClick}
                    >
                        {tab !== '' ? 'Create New Config' : 'Update existing Config'} 
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )

    const titleHeader = (
        <>
            <Link legacyBehavior href='/dashboard'><a style={{color: "#673AB7", textDecoration: 'none'}}>Scanner</a></Link> <span style={{color: '#848484'}}>/ Scanner Configuration</span>
        </>
    )

    return (
        <Header
            titleHeader={titleHeader}
            component={headerComponent}
        >
            <Grid container justifyContent='center' py={3}>
                <Grid item xs={12}>
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
                </Grid>
            </Grid>
        </Header>
    );
}