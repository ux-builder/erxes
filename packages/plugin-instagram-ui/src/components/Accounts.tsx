import {
  AccountBox,
  AccountItem,
  AccountTitle,
  FacebookButton
} from "@erxes/ui-inbox/src/settings/integrations/styles";
import {
  IAccount,
  IntegrationTypesInstagram
} from "@erxes/ui-inbox/src/settings/integrations/types";
import { __, confirm } from "coreui/utils";

import Button from "@erxes/ui/src/components/Button";
import { CenterText } from "@erxes/ui-log/src/activityLogs/styles";
import EmptyState from "@erxes/ui/src/components/EmptyState";
import { IFormProps } from "@erxes/ui/src/types";
import Icon from "@erxes/ui/src/components/Icon";
import React from "react";

type Props = {
  onSelect: (accountId?: string, account?: IAccount) => void;
  accounts: IAccount[];
  formProps?: IFormProps;
  onAdd: () => void;
  kind: IntegrationTypesInstagram;
  renderForm?: () => JSX.Element;
  removeAccount: (accountId: string) => void;
  selectedAccountId?: string;
};

class Accounts extends React.Component<Props, { accountId?: string }> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const accounts = this.props.accounts;

    if (accounts && accounts.length > 0) {
      this.onSelectAccount(accounts[0]._id, accounts[0]);
    }

    if (this.props?.selectedAccountId) {
      const account = (accounts || []).find(
        (account) => account._id === this.props.selectedAccountId
      );
      this.onSelectAccount(this.props.selectedAccountId, account);
    }
  };

  onSelectAccount = (accountId: string, account?: IAccount) => {
    this.props.onSelect(accountId, account);

    this.setState({ accountId: accountId || "" });
  };

  onRemove(accountId: string) {
    const { removeAccount } = this.props;

    confirm().then(() => {
      removeAccount(accountId);
      this.setState({ accountId: "" });
    });
  }

  renderButton() {
    const { onAdd, kind } = this.props;

    if (kind === "instagram") {
      return (
        <FacebookButton onClick={onAdd}>
          <Icon icon='facebook-official' />
          {__("Continue with Facebook")}
        </FacebookButton>
      );
    }

    return (
      <Button
        btnStyle='primary'
        icon='plus-circle'
        onClick={onAdd}>
        Add Account
      </Button>
    );
  }

  renderAccountAction() {
    const { accountId } = this.state;
    const { renderForm } = this.props;

    if (!accountId && renderForm) {
      return renderForm();
    }

    return this.renderButton();
  }

  renderAccounts() {
    const { accounts } = this.props;

    if (accounts.length === 0) {
      return (
        <EmptyState
          icon='user-6'
          text={__("There is no linked accounts")}
        />
      );
    }

    return accounts.map((account) => (
      <AccountItem key={account._id}>
        <span>{account.name}</span>

        <div>
          <Button
            onClick={this.onSelectAccount.bind(this, account._id, account)}
            btnStyle={
              this.state.accountId === account._id ? "primary" : "simple"
            }>
            {this.state.accountId === account._id
              ? __("Selected")
              : __("Select This Account")}
          </Button>

          <Button
            onClick={this.onRemove.bind(this, account._id)}
            btnStyle='danger'>
            {__("Remove")}
          </Button>
        </div>
      </AccountItem>
    ));
  }
  render() {
    return (
      <>
        <AccountBox>
          <AccountTitle>{__("Linked Accounts")}</AccountTitle>
          {this.renderAccounts()}
        </AccountBox>
        <CenterText>{__("OR")}</CenterText>
        <CenterText>{this.renderAccountAction()}</CenterText>
      </>
    );
  }
}

export default Accounts;
