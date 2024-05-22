import {
  Button,
  Form as CommonForm,
  ControlLabel,
  FormControl,
  FormGroup,
} from '@erxes/ui/src/components';

import { IFormProps } from '@erxes/ui/src/types';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Datetime from '@nateradebaugh/react-datetime';
import dayjs from 'dayjs';
import { I{Name}, IType } from '../types';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import RichTextEditor from '../containers/RichTextEditor';
import { __ } from 'coreui/utils';
import styled from 'styled-components';

type Props = {
  closeModal?: () => void;
  afterSave: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  {name}?: I{Name};
  {name}s?: I{Name}[];
  types?: IType[];
} & ICommonFormProps;

type State = {
  name?: string;
  content?: string;
  replacer?: string;
  subType?: string;
  code?: string;
};

type IItem = {
  order?: string;
  name: string;
  _id: string;
};

class FormComponent extends React.Component<Props & ICommonFormProps, State> {
  constructor(props: Props) {
    super(props);

    const { {name} } = this.props;

    this.state = {
      name: obj.name,
      content: obj.content,
      subType: obj.subType,
      code: obj.code,
    };
  }

  onContentChange = (content: string) => {
    this.setState({ content });
  };

  generateDoc = (values: { _id?: string; name: string; content: string }) => {
    const { {name} } = this.props;

    const finalValues = values;

    if ({name}) {
      finalValues._id = {name}._id;
    }

    return {
      ...finalValues,
      expiryDate: this.state.expiryDate
    };
  };

  onSave = () => {
    const { name, content, replacer, subType, code } = this.state;

    this.props.save({
      name,
      content,
      replacer,
      subType,
      code,
    });
  };

  renderContent = (formProps: IFormProps) => {
    const { expiryDate } = this.state;
    const { {name}, types, afterSave, closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;
    const object = {name} || ({} as I{Name});
    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Todo</ControlLabel>
          <FormControl
            {...formProps}
            name='name'
            defaultValue={object.name}
            type='text'
            required={true}
            autoFocus={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={false}>Code</ControlLabel>

          <FormControl
            name="code"
            required={false}
            autoFocus={true}
            defaultValue={obj.code}
            onChange={this.onChangeField.bind(this, 'code')}
            {...formProps}
          />
        </FormGroup>

        <FormGroup>
          <div style={{ float: 'left', width: '100%' }}>
            <RichTextEditor
              contentType={obj.contentType || contentType}
              content={obj.content}
              onChange={this.onContentChange}
              height={200}
            />
          </div>

          <div style={{ clear: 'both' }} />
        </FormGroup>

        {types && (
          <FormGroup>
            <ControlLabel required={true}>Category</ControlLabel>

          <FormControl
            componentclass="textarea"
            name="name"
            required={true}
            defaultValue={obj.replacer}
            onChange={this.onChangeField.bind(this, 'replacer')}
            {...formProps}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>Sub Type</ControlLabel>

          <FormControl
            componentclass="select"
            name="subType"
            value={subType}
            onChange={this.onChangeField.bind(this, 'subType')}
            {...formProps}
          >
            <option key="" value="" />
            {(subTypes || []).map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <ModalFooter>
          <Button btnStyle="simple" type="button" onClick={closeModal}>
            {__('Cancel')}
          </Button>

          {renderButton({
            passedName: '{name}',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal || afterSave,
            object: {name}
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default FormComponent;
