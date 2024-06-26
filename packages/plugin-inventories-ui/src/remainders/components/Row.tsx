// erxes
import FormControl from "@erxes/ui/src/components/form/Control";
// local
import { IRemainderProduct } from "../types";
import React from "react";

type Props = {
  product: IRemainderProduct;
  isChecked: boolean;
  toggleBulk: (product: IRemainderProduct, isChecked?: boolean) => void;
};

export default function Row(props: Props) {
  const {
    product = {} as IRemainderProduct,
    isChecked = false,
    toggleBulk,
  } = props;

  const { code, name, category, unitPrice, remainder, uom, soonIn, soonOut } =
    product;

  const handleChange = () => {
    if (toggleBulk) toggleBulk(product, !isChecked);
  };

  return (
    <tr>
      <td>
        <FormControl
          componentclass="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
      </td>
      <td>{code}</td>
      <td>{name}</td>
      <td>{category ? category.name : ""}</td>
      <td>{(unitPrice || 0).toLocaleString()}</td>
      <td>{(remainder || 0).toLocaleString()}</td>
      <td>{(soonIn || 0).toLocaleString()}</td>
      <td>{(soonOut || 0).toLocaleString()}</td>
      <td>{uom || ""}</td>
    </tr>
  );
}
