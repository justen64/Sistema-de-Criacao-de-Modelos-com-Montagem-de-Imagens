import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export const GenericTable = ({
  data = [],
  columns = [],
  loading = false,
  rows = 10,
  first = 0,
  totalRecords = 0,
  onPage = () => {},
  globalFilterFields = [],
  filters = {},
  header = null,
  emptyMessage = "Nenhum item encontrado.",
  onRowClick = { onRowClick },
}) => {
  return (
    <DataTable
      key={JSON.stringify(filters.itensSelecionados || {})}
      value={data}
      paginator
      lazy
      rows={rows}
      first={first}
      totalRecords={totalRecords}
      onPage={onPage}
      dataKey="id"
      globalFilterFields={globalFilterFields}
      globalFilter={filters.globalFilter}
      header={header}
      emptyMessage={emptyMessage}
      responsiveLayout="scroll"
      showGridlines={false}
      scrollable
      scrollHeight="400px"
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        width: "85%",
      }}
      className="custom-datatable"
    >
      {columns.map((col, index) => (
        <Column
          key={index}
          field={col.field}
          header={col.header}
          body={col.body}
          showFilterMenu={col.showFilterMenu ?? true}
          filterField={col.filterField || col.field}
          filterElement={col.filterElement}
          style={{ minWidth: col.minWidth || "200px", ...(col.style || {}) }}
        />
      ))}
    </DataTable>
  );
};
