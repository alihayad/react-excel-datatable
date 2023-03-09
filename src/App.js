import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";

function App() {
  const [items, setItems] = useState([]);

  const [columns, setColumns] = useState([]);

  const readExcel = async (file) => {
    try {
      const bufferArray = await file.arrayBuffer();
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      const columns = Object.keys(data[0]);
      const formattedColumns = columns.map((column) => ({
        name: column,
        selector: (row) => row[column],
        sortable: true,
        cell: (row) =>
          column !== "Id" ? (
            <input
              type="text"
              defaultValue={row[column]}
              onChange={(e) =>
                handleTableUpdate({ ...row, [column]: e.target.value })
              }
            />
          ) : (
            row[column]
          ),
      }));
      console.log(data);
      setItems(data);
      console.log(items);
      setColumns(formattedColumns);
      console.log("called");

    } catch (error) {
      console.log(error);
    }
  };

  const handleTableUpdate = (row) => {
    setItems(prevItems => {
      const updatedRows = [...prevItems];
      const index = updatedRows.findIndex((item) => item["Id"] === row["Id"]);
      updatedRows[index] = row;
      console.log(updatedRows);
      return updatedRows;

    })
    // check if items is updated
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />

      <DataTable
        columns={columns}
        data={items}
        pagination
        selectableRows
        editable={true}

      />
    </div>
  );
}

export default App;
