/**
 * Generic data table.
 * columns: [{ key, header, render?(row) }]
 * data: array of row objects (needs an `id` field for the React key, falls back to index)
 * onRowClick: optional (row) => void — makes rows clickable
 * emptyState: optional node shown instead of the table body when data is empty
 */
const Table = ({ columns, data, onRowClick, emptyState }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-14 text-center">
        {emptyState ?? <p className="text-sm text-slate-400">No records found.</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-slate-200 px-5 py-3 text-left text-xs font-semibold text-slate-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-100 last:border-0 ${
                onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
