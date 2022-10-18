import { 
    TableContainer, 
    Table as MuiTable, 
    TableFooter, 
    TablePagination, 
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    CircularProgress,
    Box
} from "@mui/material";

export default function Table({...props}) {
    const { 
        rowCount, 
        rowsPerPage, 
        pageIndex, 
        handlePageIndexChange,
        tableHead,
        tableData,
        loading
    } = props;

    return (
        <TableContainer>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        {tableHead?.map((label, index) => (
                            <TableCell 
                                key={index} 
                                sx={{
                                    fontSize: '12px', 
                                    color: '#959595',
                                    py: 0,
                                    pr: 0,
                                    pl: index !== 0 ? 2 : 0
                                }}
                            >
                                {label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={tableHead?.length ?? 1}>
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <CircularProgress size={50} color='greyCustom' />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : ( 
                        tableData?.map((rowData, index) => (
                        <TableRow key={index}>
                            {rowData.map((cellData, cellIndex) => (
                                <TableCell 
                                    key={`${index}-${cellIndex}`}
                                    sx={{
                                        fontSize: '12px', 
                                        color: '#190D29',
                                        pr: 0,
                                        pl: cellIndex !== 0 ? 2 : 0
                                    }}
                                >
                                    {cellData}
                                </TableCell>
                            ))}
                        </TableRow>
                    )))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TablePagination
                        count={rowCount}
                        page={pageIndex-1}
                        onPageChange={handlePageIndexChange}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                        showFirstButton
                        showLastButton
                    />
                    </TableRow>
                </TableFooter>
            </MuiTable>
        </TableContainer>
    )
}