import {
  EditorContainer,
  TestEmailWrapper,
  VerifyCancel,
  VerifyCheck
} from "@erxes/ui-engage/src/styles";
import { IEmailFormProps, IEngageEmail } from "@erxes/ui-engage/src/types";
import { FlexItem, FlexPad } from "@erxes/ui/src/components/step/styles";

import { generateEmailTemplateParams } from "@erxes/ui-engage/src/utils";
import { FlexContent } from "@erxes/ui-log/src/activityLogs/styles";
import { IUser } from "@erxes/ui/src/auth/types";
import ErrorMsg from "@erxes/ui/src/components/ErrorMsg";
import FormControl from "@erxes/ui/src/components/form/Control";
import FormGroup from "@erxes/ui/src/components/form/Group";
import ControlLabel from "@erxes/ui/src/components/form/Label";
import HelpPopover from "@erxes/ui/src/components/HelpPopover";
import Icon from "@erxes/ui/src/components/Icon";
import Tip from "@erxes/ui/src/components/Tip";
import Uploader from "@erxes/ui/src/components/Uploader";
import { ISelectedOption } from "@erxes/ui/src/types";
import { __ } from "coreui/utils";
import React from "react";
import Select, { components } from "react-select";
import EngageTest from "../containers/EngageTest";
import RichTextEditor from "../containers/RichTextEditor";

type EmailParams = {
  content: string;
  from: string;
  to: string;
  title: string;
};

type Props = IEmailFormProps & {
  verifiedEmails: string[];
  error?: string;
};

type State = {
  fromUserId: string;
  content: string;
  email: IEngageEmail;
  testEmail?: string;
};

const getEmail = (users: IUser[], fromUserId: string): string => {
  const user = users.find(u => u._id === fromUserId);

  return user && user.email ? user.email : "";
};

class EmailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fromUserId: props.fromUserId,
      content: props.content,
      email: props.email,
      testEmail: getEmail(props.users, props.fromUserId)
    };
  }

  changeContent = (key, value) => {
    const email = { ...this.state.email } as IEngageEmail;

    email[key] = value;

    this.setState({ email });

    this.props.onChange("email", email);
  };

  changeUser = (fromUserId: string) => {
    this.setState({ fromUserId });
    this.props.onChange("fromUserId", fromUserId);
  };

  templateChange = value => {
    const email = { ...this.state.email } as IEngageEmail;

    email.templateId = value;

    this.setState({ content: this.findTemplate(value), email }, () => {
      this.props.onChange("email", this.state.email);
    });
  };

  findTemplate = id => {
    const template = this.props.templates.find(t => t._id === id);

    if (template) {
      return template.content;
    }

    return "";
  };

  onEditorChange = (content: string) => {
    this.props.onChange("content", content);
  };

  renderFrom() {
    const { error } = this.props;

    if (error) {
      return <ErrorMsg>{error}</ErrorMsg>;
    }

    const onChangeUser = (value: ISelectedOption) => {
      const userId = value ? value.value : "";

      this.changeUser(userId);
    };

    const selectOptions = () => {
      const { users, verifiedEmails } = this.props;
      const options: any[] = [];

      users.forEach(user => {
        if (!verifiedEmails.includes(user.email)) {
          return;
        }
        options.push({
          value: user._id,
          label: user.email || user.username
        });
      });

      return options;
    };

    const optionRenderer = option => (
      <FlexContent>
        {!option.disabled ? (
          <Tip placement="auto" text={__("Email verified")}>
            <VerifyCheck>
              <Icon icon="check-circle" />
            </VerifyCheck>
          </Tip>
        ) : (
          <Tip placement="auto" text={__("Email not verified")}>
            <VerifyCancel>
              <Icon icon="times-circle" />
            </VerifyCancel>
          </Tip>
        )}
        {option.label}
      </FlexContent>
    );

    const Option = props => {
      return (
        <components.Option {...props}>
          {optionRenderer(props.data)}
        </components.Option>
      );
    };

    return (
      <Select
        placeholder={__("Choose users")}
        value={selectOptions().find(
          option => option.value === this.state.fromUserId
        )}
        onChange={onChangeUser}
        components={{ Option }}
        isClearable={true}
        options={selectOptions()}
      />
    );
  }

  renderTestEmailSection() {
    const { content: propContent, email, users } = this.props;
    const { content, fromUserId } = this.state;

    return (
      <TestEmailWrapper>
        <EngageTest
          from={getEmail(users, fromUserId)}
          content={propContent || content}
          title={email && email.subject ? email.subject : ""}
        />
      </TestEmailWrapper>
    );
  }

  render() {
    const { attachments } = this.state.email;

    const onChangeSubject = e =>
      this.changeContent("subject", (e.target as HTMLInputElement).value);

    const onChangeReplyTo = e =>
      this.changeContent("replyTo", (e.target as HTMLInputElement).value);

    const onChangeSender = e =>
      this.changeContent("sender", (e.target as HTMLInputElement).value);

    const onChangeAttachment = attachmentsArr =>
      this.changeContent("attachments", attachmentsArr);

    const onChangeTemplate = e => {
      this.templateChange(e.value);
    };

    return (
      <FlexItem>
        <FlexPad direction="column" overflow="auto">
          <FormGroup>
            <ControlLabel>
              From:
              <HelpPopover title={__("The email address is not verified (x) by Amazon Ses services.")}>
                <div>
                  If you want to verify your email:
                  <ol>
                    <li>Log in to your AWS Management Console</li>
                    <li>Click on the Services menu from the dropdown menu</li>
                    <li>
                      Click on the Simple Email Services menu from the left
                      sidebar
                    </li>
                    <li>
                      Click on the Email Addresses menu from the left sidebar
                    </li>
                    <li>
                      Finally, click on the button that named "Verify a new
                      email address"
                    </li>
                  </ol>
                </div>
              </HelpPopover>
            </ControlLabel>
            {this.renderFrom()}
          </FormGroup>

          <FormGroup>
            <ControlLabel>Sender:</ControlLabel>
            <FormControl
              onChange={onChangeSender}
              defaultValue={this.state.email.sender}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Reply to:</ControlLabel>
            <HelpPopover>Emails must be space separated</HelpPopover>
            <FormControl
              onChange={onChangeReplyTo}
              defaultValue={this.state.email.replyTo}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Email subject:</ControlLabel>
            <FormControl
              onChange={onChangeSubject}
              defaultValue={this.state.email.subject}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Email template:</ControlLabel>
            <p>{__("Insert email template to content")}</p>

            <Select
              onChange={onChangeTemplate}
              value={generateEmailTemplateParams(this.props.templates).find(
                option => option.value === this.state.email.templateId
              )}
              options={generateEmailTemplateParams(this.props.templates)}
              isClearable={false}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Attachments: </ControlLabel>
            <Uploader
              defaultFileList={attachments || []}
              onChange={onChangeAttachment}
            />
          </FormGroup>

          {this.renderTestEmailSection()}
        </FlexPad>

        <FlexItem overflow="auto" count="2">
          <EditorContainer>
            <ControlLabel>Content:</ControlLabel>
            <RichTextEditor
              content={this.state.content}
              isSubmitted={this.props.isSaved}
              onChange={this.onEditorChange}
              height={500}
              name={`engage_email_${this.props.kind}_${this.props.fromUserId}`}
            />
          </EditorContainer>
        </FlexItem>
      </FlexItem>
    );
  }
}

export default EmailForm;
