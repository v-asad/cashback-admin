import { DataGrid } from '@mui/x-data-grid'

const ClientsTable = ({ clients }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 350 },
    {
      field: 'date',
      headerName: 'Subscription Date',
      width: 250,
      renderCell: params => {
        // convert date here
        const updatedValue = params.row.date

        // when completed, return the column data
        return updatedValue
      }
    }
  ]

  return (
    <>
      <DataGrid rows={clients} columns={columns} pageSize={20} rowsPerPageOptions={[10]} autoHeight />
    </>
  )
}

export default ClientsTable
