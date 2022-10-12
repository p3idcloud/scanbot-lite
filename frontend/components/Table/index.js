import { 
    TableContainer, 
    Table as MuiTable, 
    TableFooter, 
    TablePagination, 
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from "@mui/material";

export default function Table({...props}) {
    const { 
        rowCount, 
        rowsPerPage, 
        pageIndex, 
        handlePageIndexChange,
        tableHead,
        tableData,
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
                    {tableData?.map((rowData, index) => (
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
                    ))}
                </TableBody>
                <TableFooter>
                    <TablePagination
                        count={rowCount}
                        page={pageIndex-1}
                        onPageChange={handlePageIndexChange}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                    />
                </TableFooter>
            </MuiTable>
        </TableContainer>
    )
}