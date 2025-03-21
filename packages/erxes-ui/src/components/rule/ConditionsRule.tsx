import { FlexPad, InlineForm } from '../step/styles';
import {
  RULE_CONDITIONS,
  VISITOR_AUDIENCE_RULES,
} from '../../constants/engage';

import Button from '../Button';
import ControlLabel from '../form/Label';
import FormControl from '../form/Control';
import FormGroup from '../form/Group';
import { IConditionsRule } from '../../types';
import ModalTrigger from '../ModalTrigger';
import React from 'react';
import RuleForm from './RuleForm';
import styled from 'styled-components';

const RuleDescription = styled.p`
  text-transform: initial;
`;

type Props = {
  rules: IConditionsRule[];
  onChange: (name: 'rules', rules: IConditionsRule[]) => void;
  description?: string;
};

type State = {
  rules: IConditionsRule[];
};

class ConditionsRule extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rules: props.rules || [],
    };
  }

  addRule = (e) => {
    const rules = this.state.rules;
    const selectedOption = e.target.options[e.target.selectedIndex];

    if (selectedOption.value) {
      rules.push({
        _id: Math.random().toString(),
        kind: selectedOption.value,
        text: selectedOption.text,
        condition: "",
        value: "",
      });

      this.setState({ rules });
    }
  };

  renderDescription(rule) {
    let description;

    switch (rule.kind) {
      case 'browserLanguage':
        description =
          'Recognizes which language is set for visitor’s browser. Insert only Language codes in value field as appointed in ISO-639, i.e “en” for English, “fr” for French, “de” for German etc.';
        break;
      case 'currentPageUrl':
        description =
          'Write your desired page URL, excluding domain name. For example: If you want to place your engagement message on https://office.erxes.io/pricing - then write /pricing';
        break;
      case 'country':
        description =
          'Locates visitor’s physical location in country  resolution. Insert only Country codes in value field as appointed in ISO-3166 standard, i.e “gb” for Great Britain, “fr” for French, “de” for German, “jp” for Japanese etc.';
        break;
      case 'city':
        description =
          'Locates visitor’s physical location in city resolution. Write a name of the City in value field. If Country’s not set, every city with same name will meet the criteria.';
        break;
      default:
        description = 'Counts individual visitor’s visitting number.';
        break;
    }

    return description;
  }

  renderRule(rule) {

    const remove = () => {
      let rules = this.state.rules;

      rules = rules.filter((r) => r._id !== rule._id);

      this.setState({ rules });
      this.props.onChange('rules', rules);
    };

    const changeProp = (name, value) => {
      const rules = this.state.rules;

      // find current editing one
      const currentRule = rules.find((r) => r._id === rule._id);

      // set new value
      if (currentRule) {
        currentRule[name] = value;
      }

      this.setState({ rules });
      this.props.onChange('rules', rules);
    };

    const onChangeValue = (e) => {
      changeProp('value', e.target.value);
    };

    const onChangeCondition = (e) => {
      changeProp('condition', e.target.value);
    };

    return (
      <FormGroup key={rule._id}>
        <ControlLabel>
          {rule.text}
          <RuleDescription>{this.renderDescription(rule)}</RuleDescription>
        </ControlLabel>
        <InlineForm>
          <FormControl
            componentclass='select'
            defaultValue={rule.condition}
            onChange={onChangeCondition}
          >
            {RULE_CONDITIONS[rule.kind].map((cond, index) => (
              <option key={index} value={cond.value}>
                {cond.text}
              </option>
            ))}
          </FormControl>

          <FormControl
            componentclass='input'
            type='text'
            value={rule.value}
            onChange={onChangeValue}
          />
          <Button
            size='small'
            onClick={remove}
            btnStyle='danger'
            icon='times'
          />
        </InlineForm>
      </FormGroup>
    );
  }

  renderAddRule = () => {
    const trigger = (
      <Button btnStyle='primary' uppercase={false} icon='plus-circle'>
        Add another rule
      </Button>
    );

    const content = (props) => <RuleForm {...props} onChange={this.addRule} />;

    return (
      <ModalTrigger title='Add rule' trigger={trigger} content={content} />
    );
  };

  render() {
    const { description } = this.props;

    return (
      <FlexPad overflow='auto' direction='column'>
        <FormGroup>
          <ControlLabel>Add rules</ControlLabel>
          <RuleDescription>
            {description ||
              'Rules are used when you wish to target the audience of the form according to custom rules. For example, you can show the form only if a visitor views the webpage more than 5 times.'}
          </RuleDescription>
          <FormControl componentclass='select' onChange={this.addRule}>
            {VISITOR_AUDIENCE_RULES.map((rule, index) => (
              <option key={index} value={rule.value}>
                {rule.text}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <FormGroup>
          {this.state.rules.map((rule) => this.renderRule(rule))}
        </FormGroup>

        <FormGroup>{this.renderAddRule()}</FormGroup>
      </FlexPad>
    );
  }
}

export default ConditionsRule;
