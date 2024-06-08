import React, { useCallback } from "react";
import bwipjs from "bwip-js";
import { Button } from "primereact/button";
import { ImPrinter } from "react-icons/im";

export const BarcodeList = ({ barcode, quantity }) => {
  const printBarcodes = useCallback(() => {
    const windowPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0",
    );

    for (let i = 0; i < quantity; i++) {
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: barcode,
        scale: 3,
        height: 10,
        includetext: true,
        textalign: "center",
      });
      windowPrint.document.body.appendChild(canvas);
    }

    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  }, [barcode, quantity]);

  return (
    <Button
      label="Imprimir Codigos"
      icon={<ImPrinter />}
      className="p-button-primary"
      onClick={printBarcodes}
    />
  );
};

export const PrintFactureBarcode = ({ items }) => {
  const printBarcodes = useCallback(() => {
    const windowPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0",
    );

    items.forEach(item => {
      for (let i = 0; i < item.stock; i++) {
        const canvas = document.createElement("canvas");
        bwipjs.toCanvas(canvas, {
          bcid: "code128",
          text: item.barcode,
          scale: 3,
          height: 10,
          includetext: true,
          textalign: "center",
        });
        windowPrint.document.body.appendChild(canvas);
      }
    });

    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  }, [items]);

  return (
    <Button
      label="Imprimir Codigos"
      icon={<ImPrinter />}
      className="p-button-primary"
      onClick={printBarcodes}
    />
  );
};