import { FlexItem, LeftItem } from "@erxes/ui/src/components/step/styles";

import ControlLabel from "@erxes/ui/src/components/form/Label";
import { FlexRow } from "@erxes/ui-inbox/src/settings/integrations/styles";
import FormControl from "@erxes/ui/src/components/form/Control";
import FormGroup from "@erxes/ui/src/components/form/Group";
import React from "react";
import { __ } from "coreui/utils";

type Props = {
  onChange: (
    name: "title" | "location" | "duration" | "cancellationPolicy",
    value: string | number
  ) => void;
  title?: string;
  location?: string;
  duration?: number;
  cancellationPolicy?: string;
};

type State = {
  title?: string;
  location?: string;
  duration?: number;
  cancellationPolicy?: string;
};

class Event extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { duration } = props;

    this.state = {
      title: "",
      location: "",
      duration: duration || 45,
    };
  }

  onChangeInput = (
    name: "title" | "location" | "duration" | "cancellationPolicy",
    e: React.FormEvent
  ) => {
    const val = (e.target as HTMLInputElement).value;
    const value = name === "duration" ? parseInt(val, 10) : val;

    this.setState({ [name]: value }, () => this.props.onChange(name, value));
  };

  render() {
    const { title, location, duration, cancellationPolicy } = this.props;

    return (
      <FlexItem>
        <LeftItem>
          <FormGroup>
            <ControlLabel>Event title</ControlLabel>

            <FormControl
              placeholder={__("Write here Event title") + "."}
              rows={3}
              value={title}
              onChange={this.onChangeInput.bind(null, "title")}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Event location</ControlLabel>

            <FormControl
              placeholder={__("Write here Event location") + "."}
              rows={3}
              value={location}
              onChange={this.onChangeInput.bind(null, "location")}
            />
          </FormGroup>

          <FlexRow>
            <div className="flex-item">
              <FormGroup>
                <ControlLabel>Duration</ControlLabel>
                <FormControl
                  value={duration}
                  name="duration"
                  onChange={this.onChangeInput.bind(null, "duration")}
                  componentclass="select"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                  <option value={75}>75</option>
                  <option value={90}>90</option>
                </FormControl>
              </FormGroup>
            </div>
            <div className="flex-item" />
            <div className="flex-item" />
          </FlexRow>

          <FormGroup>
            <ControlLabel>Cancellation Policy</ControlLabel>

            <FormControl
              componentclass="textarea"
              rows={3}
              value={cancellationPolicy}
              onChange={this.onChangeInput.bind(null, "cancellationPolicy")}
            />
          </FormGroup>
        </LeftItem>
      </FlexItem>
    );
  }
}

export default Event;
