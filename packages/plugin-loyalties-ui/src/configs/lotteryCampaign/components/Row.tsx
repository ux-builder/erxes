import {
  FormControl,
  Icon,
  ModalTrigger,
  TextInfo,
} from "@erxes/ui/src/components";

import Form from "../containers/Form";
import { ILotteryCampaign } from "../types";
import { Link } from "react-router-dom";
import React from "react";

type Props = {
  lotteryCampaign: ILotteryCampaign;
  isChecked: boolean;
  toggleBulk: (lotteryCampaign: ILotteryCampaign, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  modalContent = (props) => {
    const { lotteryCampaign } = this.props;

    const updatedProps = {
      ...props,
      lotteryCampaign,
    };

    return <Form {...updatedProps} />;
  };

  render() {
    const { lotteryCampaign, toggleBulk, isChecked } = this.props;

    const onChange = (e) => {
      if (toggleBulk) {
        toggleBulk(lotteryCampaign, e.target.checked);
      }
    };

    const onClick = (e) => {
      e.stopPropagation();
    };

    const { _id, title, startDate, endDate, finishDateOfUse, status } =
      lotteryCampaign;

    const trigger = (
      <tr key={_id}>
        <td onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentclass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{title}</td>
        <td>{new Date(startDate).toLocaleDateString()}</td>
        <td>{new Date(endDate).toLocaleDateString()}</td>
        <td>{new Date(finishDateOfUse).toLocaleDateString()}</td>
        <td>
          <TextInfo>{status}</TextInfo>
        </td>
        <td onClick={onClick}>
          <Link to={`/lotteries?campaignId=${_id}`}>
            <Icon icon="list-2" />
          </Link>
          <Link to={`/lotteryAward?campaignId=${_id}`}>
            <Icon icon="award" />
          </Link>
        </td>
      </tr>
    );

    return (
      <ModalTrigger
        size={"lg"}
        title="Edit lottery campaign"
        trigger={trigger}
        autoOpenKey="showProductModal"
        content={this.modalContent}
      />
    );
  }
}

export default Row;
