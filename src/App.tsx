import { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { StyledInput, StyledSelect } from "./styles";
import rowData from "./data.json";

import "./App.css";

type Row = {
  id: number;
  first_name: string;
  last_name: string;
  ip_address: string;
  balance: number;
};

function App() {
  const [search, setSearch] = useState<string>("");
  const [selectedRowID, setSelectedRowID] = useState<number | null>(null);
  
  // filtering should happen from the values in rowData, use the option to filter the desired column based on the user search.
  // colDefs should be dynamic, same work you do to the options can be done to it.
  // to style the input, you can just pass a prop similar

  // Changed header with headerName instead of field 
  const columnDefs = [
    { headerName: "ID",
      field: "id",
      minWidth: 75,
      maxWidth: 75,},
    { headerName: "First Name",
      field: "first_name",
     },
    { headerName: "Last Name",
      field: "last_name",
      
      onCellClicked: (e) => console.log("here", e) },
    {
      headerName: "IP Address",
      field: "ip_address",
    
      cellRenderer: (params) => {
        const currentNodeId = params.node.id;
        
        if (selectedRowID === currentNodeId) {
          // in here you will check if you want to render the ip address or not.
          return params.value;
        }
        return "";
      },
      onCellClicked: (params) => {
        const currentNodeId = params.node.id;
        console.log("current cell clicked", currentNodeId);
        if (params.column.colId === "ip_address") {
          setSelectedRowID(selectedRowID === currentNodeId ? null : currentNodeId);
        }  
      },
    },
    { 
      headerName: "Balance",
      field: "balance",
    
      // Formats balance from 42517 to $42,517.00
      // Adds two decimal places and replaces every thousand with a comma using regular expression
      valueFormatter: (p) => "$" + p.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}, // in here you will finish formatting the balance,
  ] as const;

  const [selectedOption, setSelectedOption] =
    useState<(typeof columnDefs)[number]["field"]>("id");

  const options = () => {
    const opt: {
      label: string;
      value: string;
    }[] = [];

    rowData.map((row: Row) => {
      return Object.entries(row).map((e) => {
        const [label] = e;

        // filter the options to not have duplicate values
          if (!opt.some(option => option.value === label)) {
          opt.push({
            label,
            value: label,
          });
        }
      });
    });
    return opt;
  };

  const defaultColDef = {
    flex: 1,
  };

  // Searches and filters the data by iterating through the selected row, 
  // which was chosen through the drop down menu, and looks for the search string
  const filteredRowData = rowData.filter((row) => {
    if (!search) 
      return true;

    // Converts cells to lowercase for comparing
    const value = row[selectedOption]?.toString().toLowerCase();

    // Check if it matches with search
    return value.includes(search.toLowerCase());
  });
  
  const gridOptions= {
    pagination: true,
    rowSelection: 'multiple',
    suppressDragLeaveHidesColumns: true,
    enableCharts: true,
    defaultColDef: defaultColDef,
    rowData: filteredRowData,
    columnDefs: columnDefs,
  }

  return (
    <div
      style={{
        height: 500,
      }}
      className={"ag-theme-quartz-dark"}
    >
      <div className="header">
        <picture>
          <source srcSet="/ga-fav-icon.png" media="(max-width: 625px)" />
          <source srcSet="/ga-logo-light.png" media="(max-width: 2560px)" />
          <img src="/ga-logo-light.png" className="logo" alt="Logo" />
        </picture>

        <h1>KPI Dashboard</h1>
      </div>

      <div className="navbar-container"> 
        <StyledSelect
          options={options()}
          value={selectedOption}
          onChange={(e) =>
            setSelectedOption(e as (typeof columnDefs)[number]["field"])
          }
        />
        <StyledInput
          $yourProp={false}
          value={search}
          placeholder="Search..."
          onChange={(e) => {
            console.log("Searching: ", e.target.value);
            setSearch(e.target.value)}
          }
        />
      </div>

      <AgGridReact
        gridOptions={gridOptions}
      />
    </div>
  
  );
}

export default App;