import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { addToDate, formatDatePretty } from 'utils/dates';

import Icon from 'components/ui/icon';
import Slider from 'components/ui/slider';

import PlayIcon from 'assets/icons/play.svg';
import PauseIcon from 'assets/icons/pause.svg';

import './styles.scss';

class Timeline extends Component {
  formatDate = value => {
    const { minDate, dateFormat } = this.props;
    return formatDatePretty(addToDate(minDate, value), dateFormat);
  };

  render() {
    const {
      className,
      isPlaying,
      handleTogglePlay,
      min,
      max,
      start,
      end,
      trim,
      handleOnChange,
      handleOnAfterChange,
      startDate,
      endDate,
      trimEndDate,
      color,
      marks,
      customColor,
      trackStyle,
      ...props
    } = this.props;

    return (
      <div className={`c-timeline ${className}`}>
        <button className="control-btn" onClick={handleTogglePlay}>
          <Icon
            className={isPlaying ? 'pause' : 'play'}
            icon={isPlaying ? PauseIcon : PlayIcon}
          />
        </button>
        <Slider
          className="range"
          marks={marks}
          disabled={isPlaying}
          min={min}
          max={max}
          value={[start, end, trim]}
          trackColors={[customColor, chroma(customColor).darken(1.3)]}
          {...props}
          onChange={handleOnChange}
          onAfterChange={handleOnAfterChange}
          formatValue={this.formatDate}
          showTooltip={index => isPlaying && index === 1}
          range
        />
      </div>
    );
  }
}

Timeline.defaultProps = {
  dateFormat: 'YYYY-MM-DD',
  interval: 'years',
  intervalStep: 1,
  speed: 200,
  count: 2,
  pushable: true
};

Timeline.propTypes = {
  className: PropTypes.string,
  isPlaying: PropTypes.bool,
  handleTogglePlay: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  trim: PropTypes.number,
  handleOnChange: PropTypes.func,
  handleOnAfterChange: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  trimEndDate: PropTypes.string,
  color: PropTypes.string,
  formatDate: PropTypes.string,
  marks: PropTypes.object,
  value: PropTypes.number,
  minDate: PropTypes.string,
  dragging: PropTypes.bool,
  dateFormat: PropTypes.string,
  index: PropTypes.number,
  customColor: PropTypes.string,
  trackStyle: PropTypes.array
};

export default Timeline;