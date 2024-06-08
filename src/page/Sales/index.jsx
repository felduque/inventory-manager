import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

export const Sales = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [dataSales, setDataSales] = useState([]);
  useEffect(() => {
    window.api.send("get-all-transactions");
    window.api.receive("get-all-transactions-response", (transactions) => {
      setDataSales(transactions);
    });
  }, []);

  const allowExpansion = (rowData) => {
    return rowData.products.length > 0;
  };

  const expandAll = () => {
    let _expandedRows = {};

    products.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const rowExpansionTemplate = (p) => {
    return (
      <div className="p-3">
        <DataTable
          value={p.products}
          className="p-datatable-sm"
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 15]}
          dataKey="_id"
        >
          <Column field="description" header="Descripcion"></Column>
          <Column field="sellingPrice" header="SellingPrice"></Column>
          <Column field="quantity" header="Cantidad"></Column>
          <Column field="barcode" header="Codigo de Barras"></Column>
        </DataTable>
      </div>
    );
  };
  return (
    <div className="w-full h-full bg-white">
      <DataTable
        className="p-datatable-sm"
        value={dataSales}
        paginator
        rows={10}
        showGridlines
        size="small"
        rowsPerPageOptions={[5, 10, 15]}
        dataKey="_id"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander={allowExpansion} style={{ width: "5rem" }} />
        <Column field="date" header="Fecha"></Column>
        <Column field="paymentType" header="Metodo de Pago"></Column>
        <Column field="clientName" header="Cliente"></Column>
        <Column field="sellerName" header="Vendedor"></Column>
        <Column
          field="amount_paid"
          header="Dinero Entregado"
          body={(rowData) => {
            return rowData.amount_paid.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            });
          }}
        ></Column>
        <Column
          field="totalSale"
          header="Total Venta"
          body={(rowData) => {
            return rowData.totalSale.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            });
          }}
        ></Column>
        <Column
          header="Cambio"
          body={(rowData) => {
            return (rowData.amount_paid - rowData.totalSale).toLocaleString(
              "es-CO",
              {
                style: "currency",
                currency: "COP",
              },
            );
          }}
        ></Column>
      </DataTable>
    </div>
  );
};
