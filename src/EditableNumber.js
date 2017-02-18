import React, { Component } from 'react';

export default class EditableNumber extends Component {
  state = {
    hovering: false,
    changing: false,
    anchorX: 0,
    checkpoint: 0
  }

  onMouseEnter = () => this.setState({ hovering: true })
  onMouseLeave = () => this.setState({ hovering: false })
  onMouseDown = (event) => {
    var removeAllListeners = () => {
      document.body.removeEventListener('mousemove', this.onMouseMove, false);
      document.body.removeEventListener('mouseup', removeEventListener, false);
      this.setState({ changing: false });
    };

    document.body.addEventListener('mousemove', this.onMouseMove, false);
    document.body.addEventListener('mouseup', removeAllListeners, false);
    this.setState({
      changing: true,
      anchorX: event.clientX,
      checkpoint: this.props.value
    });
  }

  onMouseMove = (event) => {
    event.preventDefault();
    var { scaleFactor = 1, onChange } = this.props;
    var { checkpoint } = this.state;
    var delta = Math.floor((event.clientX - this.state.anchorX) * scaleFactor);
    onChange(checkpoint + delta);
  }

  render() {
    var { value } = this.props;
    var { hovering, changing } = this.state;
    var accentBgColor = '#FD76B3';
    var accentTextColor = '#FDF6E3';

    var style = {
      backgroundColor: hovering || changing ? accentBgColor : 'transparent',
      color: hovering || changing ? accentTextColor : 'inherit',
      cursor: 'ew-resize',
      outlineWidth: hovering || changing ? 2 : 0,
      outlineColor: accentBgColor,
      outlineStyle: 'solid'
    };

    return (
      <span
        style={style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}>
        {value}
      </span>
    );
  }
}
