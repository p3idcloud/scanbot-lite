import { createTheme } from '@mui/material/styles';
import { palette } from './custom';

const MuiDataTables = {
  MUIDataTableToolbar: {
    styleOverrides: {
      root: {
        paddingLeft: 0,
        paddingRight: 0
      },
      titleText: {
        fontSize: '1em',
        fontWeight: '600'
      }
    }
  },
  MUIDataTableHeadCell: {
    styleOverrides: {
      root: {
        padding: '8px 0',
        color: '#959595',
        fontSize: '12px'
      },
      data: {
        fontSize: '12px'
      }
    }
  },
  MUIDataTableBodyCell: {
    styleOverrides: {
      root: {
        borderBottom: 'none',
        paddingLeft: 0,
        fontSize: '12px'
      },
      stackedCommon: {
        // padding: 10,
        fontSize: 12
      }
    }
  },
  MUIDataTableHead: {
    styleOverrides: {
      main: {
        borderBottom: '1px solid #e0e0e0'
      }
    }
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        background: '#FFFFFF',
        border: '1px solid #A767FC',
        color: '#A767FC',
        boxShadow: '0px 5px 8px 1px rgba(0, 0, 0, 0.07)'
      },
      arrow: {
        color: '#A767FC'
      }
    }
  }
};

const theme = createTheme({
  palette,
  typography: {
    fontFamily: `"Inter", sans-serif`
  },
  components: {
    ...MuiDataTables,
    MUIDataTableSelectCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize'
        },
        sizeLarge: {
          padding: '12px 24px',
          fontWeight: 500
        },
        sizeInput: {
          padding: '10px 24px'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8
        },
        select: {
          padding: '12px 28px 12px 12px',
          height: 'auto',
          fontSize: 14
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        adornedEnd: {
          padding: '0 !important'
        },
        adornedStart: {
          padding: '0 !important'
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          margin: 0
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          height: 'auto',
          fontSize: 14,
          transform: 'translate(12px, 14px) scale(1)'
        },
        shrink: {
          height: 'auto',
          fontSize: 14,
          transform: 'translate(14px, -9px) scale(0.9)'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 0
        },
        list: {
          padding: 0
        },
        paper: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12) !important'
        }
      }
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: 4,
          marginRight: 4
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          boxShadow: '0px 5px 8px 1px rgba(0, 0, 0, 0.07) !important'
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {}
    }
  }
});

export const customTableNoSelectTheme = createTheme({
  palette,
  typography: {
    fontFamily: `"Inter", sans-serif`
  },
  components: {
    ...MuiDataTables,
    MuiTableBody: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0'
        }
      }
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          color: '#959595',
          fontSize: '12px'
        },
        data: {
          fontSize: '12px'
        }
      }
    },
    // MUIDataTableSelectCell: {
    //   styleOverrides: {
    //     root: {
    //       display: 'none'
    //     }
    //   }
    // },
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: '12px'
        },
        stackedCommon: {
          padding: 10,
          fontSize: 10
        }
      }
    }
  }
});
export const secondaryVariantTable = createTheme({
  palette,
  typography: {
    fontFamily: `"Inter", sans-serif`
  },
  components: {
    ...MuiDataTables,
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F8FA',
          borderRadius: 10,
          overflow: 'hidden'
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          // border: '1px solid #e0e0e0'
        }
      }
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          color: '#747474',
          fontSize: 10,
          backgroundColor: '#F8F8FA',
          border: 0,
          padding: '5px 10px'
        },
        data: {
          fontSize: 10
        }
      }
    },
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: 10,
          border: 0,
          padding: 0
        },
        stackedCommon: {
          padding: 10,
          fontSize: 10
        }
      }
    },
    MUIDataTableBody: {
      styleOverrides: {
        emptyTitle: {
          fontSize: 10
        }
      }
    }
  }
});

export default theme;
