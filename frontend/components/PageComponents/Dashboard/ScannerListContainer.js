import { Box, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from "next/image";
import Card from "components/Card";
import { useState } from "react";
import {
    MenuHeader,
    ButtonWrapper,
    RemoveButtonWrapper
} from './style';
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { fetchData } from "lib/fetch";
import { useRouter } from "next/router";
import EditDetailScannerForm from "components/AppModals/EditDetailScannerForm";

const DeleteConfirmation = dynamic(() => import("components/AppModals/DeleteConfirmation"));

export default function ScannerListContaner({...props}) {
    const { id, name, model, description, rowsPerPage, pageIndex, setPageIndex } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [removeScannerOpen, setRemoveScanner] = useState(false);
    const [editScannerData, setEditScanner] = useState(null);
    const router = useRouter();
  
    const open = Boolean(anchorEl);
    const handleClick = event => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        if (e.stopPropagation)
            e.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (e) => {
        if (e.stopPropagation)
            e.stopPropagation();
        setEditScanner({
            id, name, model, description
        });
        setAnchorEl(null);
    }

    const handleRemoveButton = (e) => {
        handleClose(e);
        setRemoveScanner(true);
    }

    const handleRemoveScanner = () => {
        setLoadingRemove(true);
        fetchData(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/scanners/${id}`, 
            {
                method: "DELETE"
            }
        )
        .then(res => {
            setPageIndex(1);
            mutate(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`)
                .then(() => {
                    setLoadingRemove(false);
                    toast.success('Successfully deleted scanner');
                    setRemoveScanner(false);
                }, () => {
                    setLoadingRemove(false);
                    toast.error('Failed to delete scanner');
                    setRemoveScanner(false);
                });
        })
        .catch(err => {
            toast.error('Failed to delete scanner');
            setLoadingRemove(false);
        })
    }

    const handleScannerDetailClick = (e) => {
        e.stopPropagation();
        router.push(`/scanners/${id}`);
    }

    return (
        <>
            <Card 
                withpadding 
                onClick={handleScannerDetailClick} 
                hover
            >
                <Grid container spacing={2}>
                <Grid item xs={12} display='flex' justifyContent="space-between">
                    <Stack direction='row' width={0.8} spacing={1}>
                    <Box display='flex' alignItems='center'>
                        <Image alt={"Scanner"} src="/Vectorscanner.png" layout="fixed" width={43} height={32} />
                    </Box>
                    <Box maxWidth={1}>
                        <Typography noWrap sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '24px', color: '#190D29' }}>
                            {name}
                        </Typography>
                        <Typography noWrap sx={{ fontWeight: 400, fontSize: '16px', lineHeight: '19px', color: '#747474' }}>
                        Model: {model}
                        </Typography>
                    </Box>
                    </Stack>

                    <IconButton sx={{float: 'right'}} onClick={handleClick}>
                        <MoreVertIcon sx={{color: "#747474"}}/>
                    </IconButton>
                    <MenuHeader
                        id="header-menu"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button'
                        }}
                    >
                        <ButtonWrapper onClick={handleEdit}>Edit</ButtonWrapper>
                        <Divider />
                        <RemoveButtonWrapper onClick={handleRemoveButton}>Remove</RemoveButtonWrapper>
                    </MenuHeader>
                </Grid>
                <Grid item xs={12}>
                    <Typography noWrap sx={{ fontWeight: 400, fontSize: '16px', lineHeight: '19px', color: '#747474' }}>
                        {description}
                    </Typography>
                </Grid>
                </Grid>
            </Card>
            <EditDetailScannerForm
                open={Boolean(editScannerData)}
                close={()=>setEditScanner(null)}
                {...props}
            />
            <DeleteConfirmation
                open={removeScannerOpen}
                title="Remove Scanner"
                subTitle={`Do you really want to remove ${model}? This process cannot be undone`}
                loading={loadingRemove}
                onDelete={handleRemoveScanner}
                onClose={()=>setRemoveScanner(false)}
            />
        </>
    );
}