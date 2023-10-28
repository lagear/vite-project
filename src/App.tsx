import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';
import { Button, Modal, TextField } from '@mui/material';


interface RowData {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [rows, setRows] = useState<RowData[]>([]);


// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'MUI X', col2: 'is awesome' },
//   { id: 3, col1: 'Material UI', col2: 'is amazing' },
//   { id: 4, col1: 'MUI', col2: '' },
//   { id: 5, col1: 'Joy UI', col2: 'is awesome' },
//   { id: 6, col1: 'MUI Base', col2: 'is amazing' },
// ];

// const columns: GridColDef[] = [
//   { field: 'id', hide: true },
//   { field: 'col1', headerName: 'Column 1', width: 150 },
//   { field: 'col2', headerName: 'Column 2', width: 150 },
// ];

const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<RowData | null>(null);

  const handleRowSelection = (selectedRows: RowData[]) => {
    setSelectedRow(selectedRows.length > 0 ? selectedRows[0] : null);
  };

  const handleDelete = () => {
    if (selectedRow) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
    setEditedRow(selectedRow);
  };
  const handleSave = () => {
    if (editedRow) {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === editedRow.id ? editedRow : row))
      );
      setSelectedRow(editedRow);
      setIsModalOpen(false);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedRow) {
      setEditedRow((prevRow) => ({
        ...prevRow,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditedRow(null);
  };

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <button onClick={() => {
        setSelectedRow(params.row)
        handleModalOpen()
      }}>Edit</button>
    ),
  },
];

useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) =>
      setRows(
        data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }))
      )
    );
}, []);

  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ height: 300, width: '100%' }}>
      <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={5}
          //onSelectionModelChange={handleRowSelection}
          components={{
            Toolbar: GridToolbar,
          }} />
          {selectedRow && (
        <div>
          <h2>Edit Row</h2>
          <p>Selected row: {selectedRow.name}</p>
          <button onClick={handleModalOpen}>Edit</button>
        </div>
      )}
          <Modal open={isModalOpen} onClose={handleModalClose}>
        <div>
          <h2>Edit Row</h2>
          <TextField
            label="Name"
            name="name"
            value={editedRow?.name || ''}
            onChange={handleFieldChange}
          />
          <TextField
            label="Email"
            name="email"
            value={editedRow?.email || ''}
            onChange={handleFieldChange}
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" onClick={handleModalClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
    </>
  )
}

export default App
