import React, { ReactNode } from 'react';

import BasicVariable from './BasicVariable';

import { ReactComponent as ExpandedMoreIcon } from '@/assets/icons/expand_more.svg';
import {
  ConfigVar,
  ConfigVarState,
  CustomVar,
  CustomVarState,
} from '@/store/types/config';

interface Props {
  name: string;
  state: CustomVarState;
  onChange: (state: CustomVarState) => void;
  onSave: (variable: CustomVar) => void;
}

interface State {
  expanded: boolean;
}

class CustomVariable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  renderHelper(name: string, children: ReactNode) {
    return (
      <tr>
        <td>
          <div
            className="option-header cursor-pointer py-1"
            onClick={this.toggleVisibility}
          >
            <div
              className={`flex-center mr-2 h-7 w-7 transform rounded-full border border-gray-200 bg-gray-100 transition
                          hover:border-gray-400 hover:bg-gray-200 ${
                            this.state.expanded ? `` : '-rotate-90'
                          }`}
            >
              <ExpandedMoreIcon className="h-6 w-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="select-none text-lg">{name}</h3>
            </div>
          </div>
          {this.state.expanded && (
            <table>
              <tbody>{children}</tbody>
            </table>
          )}
        </td>
      </tr>
    );
  }

  render() {
    const { name, state } = this.props;

    const value = state.__value;
    if (value === null) {
      return this.renderHelper(
        name,
        <tr>
          <td>null</td>
        </tr>,
      );
    }

    const sortedKeys = Object.keys(value);
    sortedKeys.sort();

    const children = sortedKeys.map((key) => {
      const onChange = (newState: ConfigVarState) => {
        this.props.onChange({
          __type: 'custom',
          __value: sortedKeys.reduce(
            (acc, key2) => ({
              ...acc,
              [key2]: key === key2 ? newState : value[key2],
            }),
            {},
          ),
        });
      };

      const onSave = (variable: ConfigVar) => {
        this.props.onSave({
          __type: 'custom',
          __value: {
            [key]: variable,
          },
        });
      };

      const child = value[key];
      if (child.__type === 'custom') {
        return (
          <CustomVariable
            key={key}
            name={key}
            state={child}
            onChange={onChange}
            onSave={onSave}
          />
        );
      }

      return (
        <BasicVariable
          key={key}
          name={key}
          state={child}
          onChange={onChange}
          onSave={onSave}
        />
      );
    });

    return this.renderHelper(name, children);
  }
}

export default CustomVariable;
