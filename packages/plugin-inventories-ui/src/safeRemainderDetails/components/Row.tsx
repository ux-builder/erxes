import ActionButtons from "@erxes/ui/src/components/ActionButtons";
import Button from "@erxes/ui/src/components/Button";
import FormControl from "@erxes/ui/src/components/form/Control";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Tip from "@erxes/ui/src/components/Tip";
import { FinanceAmount } from "../../styles";

type Props = {
  item: any;
  updateItem: (_id: string, remainder: number, status: string) => void;
  removeItem: (item: any) => void;
  onEnter: (val?: number) => void;
};

export default function Row(props: Props) {
  const timer: any = useRef(null);
  const { item, updateItem, removeItem, onEnter } = props;
  const { product, modifiedAt, count, preCount, uom, status } = item;

  // states
  const [diff, setDiff] = useState<number>(count - preCount);
  const [remainder, setRemainder] = useState<number>(count);
  const [statusDisplay, setStatusDisplay] = useState<string>(status || "new");

  const displayNumber = (value: number) => {
    return (value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const renderDate = (date: Date) => {
    if (!date) {
      return null;
    }
    return moment(date).format("YYYY/MM/DD HH:mm:ss");
  };

  const handleCheckChange = (event: any) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const checked = event.target.checked ? "checked" : "new";

    setStatusDisplay(checked);

    timer.current = setTimeout(() => {
      updateItem(item._id, remainder, checked);
    }, 100);
  };

  const handleRemainderChange = (event: any) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const value = Number(event.target.value);

    setDiff(value - preCount);
    setRemainder(value);
    setStatusDisplay("checked");

    timer.current = setTimeout(() => {
      updateItem(item._id, value, "checked");
    }, 300);
  };

  const handleDiffChange = (event: any) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const value = Number(event.target.value);
    setDiff(value);
    setRemainder(value + preCount);
    setStatusDisplay("checked");

    timer.current = setTimeout(() => {
      updateItem(item._id, value + preCount, "checked");
    }, 300);
  };

  // Update diff when remainder updates
  useEffect(() => {
    setDiff(count - preCount);
  }, [count, preCount]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        onEnter(-1);
        return;
      }
      onEnter();
    }
  };

  return (
    <tr>
      <td>{product && `${product.code} - ${product.name}`}</td>

      <td>{renderDate(modifiedAt)}</td>
      <td>
        <FinanceAmount>{displayNumber(preCount)}</FinanceAmount>
      </td>
      <td>{uom}</td>

      <td>
        <FormControl
          checked={statusDisplay === "checked"}
          componentclass="checkbox"
          onChange={handleCheckChange}
        />
      </td>

      <td>
        <div className="canFocus">
          <FormControl
            type="number"
            value={remainder}
            onChange={handleRemainderChange}
            align={"right"}
            onKeyDown={onKeyDown}
            onFocus={(e) => (e.target as any).select()}
          />
        </div>
      </td>
      <td>
        <FormControl
          type="number"
          value={diff}
          onChange={handleDiffChange}
          align={"right"}
        />
      </td>
      <td>
        <ActionButtons>
          <Tip text="Delete" placement="top">
            <Button
              btnStyle="link"
              onClick={() => removeItem(item)}
              icon="times-circle"
            />
          </Tip>
        </ActionButtons>
      </td>
    </tr>
  );
}
