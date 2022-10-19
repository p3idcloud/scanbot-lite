import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import ScannerSettingForm from "./Form";
import { Box, Container, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import { fetchData } from 'lib/fetch';
import Button from 'components/Button';
import Link from 'next/link';
import Header from 'components/Header';

export default function ScannerSetting() {
    const { data } = useSWR(
        `${process.env.backendUrl}api/scannersetting`,
        fetchData
    ).data ?? { data: [] };
    const [tab, setTab] = useState(data[0]?.labelName ?? '');

    const handleTab = (e) => {
        setTab(e.target.value);
    };

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
                        {tab === '' ? 'New config' : 'Select config'}
                    </Typography>
                    
                    {tab !== '' ? (
                        <FormControl sx={{width: 400}}>
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
                    ) : (
                        <Typography fontWeight={500} sx={{color: '#959595'}} fontSize='16px'>
                            Create a new global config
                        </Typography>
                    )}
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box display='flex' flexDirection='column' alignItems="end">
                    <Typography fontWeight={500} sx={{color: '#959595'}} fontSize='16px'>
                        Toggle
                    </Typography>
                    <Button
                        autoWidth
                        onClick={() => {
                            if (tab !== '')
                                setTab('');
                            else
                                setTab(data[0]?.labelName);
                        }}
                    >
                        {tab !== '' ? 'Add New Config' : 'Update Config'} 
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )

    const titleHeader = (
        <>
            <Link href='/dashboard'><a style={{color: "#673AB7", textDecoration: 'none'}}>Scanner</a></Link> <span style={{color: '#848484'}}>/ Scanner Configuration</span>
        </>
    )

    return (
        <Header
            titleHeader={titleHeader}
            component={headerComponent}
        >
            <Grid container justifyContent='center'>
                <Grid item>
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