type AiDataTableProps = {
  columns: string[];
  rows: string[][];
  title?: string;
};

export function AiDataTable({ columns, rows, title }: AiDataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      {title ? (
        <p className="border-b border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
          {title}
        </p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-elevated/80">
              {columns.map((column) => (
                <th
                  className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
                  key={column}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className="border-b border-border/70 last:border-0" key={`${rowIndex}-${row[0] ?? ""}`}>
                {columns.map((column, columnIndex) => (
                  <td className="px-4 py-3 text-foreground" key={`${column}-${columnIndex}`}>
                    {row[columnIndex] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
