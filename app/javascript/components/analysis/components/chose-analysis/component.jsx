import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import cx from 'classnames';
import { SCREEN_M } from 'utils/constants';
import MediaQuery from 'react-responsive';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import infoIcon from 'assets/icons/info.svg';
import squarePointIcon from 'assets/icons/square-point.svg';
import polygonIcon from 'assets/icons/polygon.svg';

import './styles.scss';

class ChoseAnalysis extends PureComponent {
  renderLayerOption = () => {
    const {
      boundaries,
      activeBoundary,
      selectBoundaries,
      setMenuSettings
    } = this.props;
    const selectedBoundaries = activeBoundary || (boundaries && boundaries[0]);

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className="layer-menu">
            <div className="layer-title">
              {isDesktop
                ? 'One click analysis on shape or:'
                : 'Analysis on shape or:'}
            </div>
            <Dropdown
              className="boundary-selector analysis-boundary-menu"
              options={boundaries}
              value={selectedBoundaries && selectedBoundaries.value}
              onChange={selectBoundaries}
              native
            />
            <div className="layer-description">
              {isDesktop ? 'One-click analysis ' : 'Analysis '}
              is also available by default for most data layers under the{' '}
              <button
                onClick={() =>
                  setMenuSettings({
                    menuSection: 'datasets',
                    datasetCategory: 'landUse'
                  })
                }
              >
                land use
              </button>{' '}
              and{' '}
              <button
                onClick={() =>
                  setMenuSettings({
                    menuSection: 'datasets',
                    datasetCategory: 'biodiversity'
                  })
                }
              >
                biodiversity
              </button>{' '}
              tabs.
            </div>
          </div>
        )}
      </MediaQuery>
    );
  };

  renderPolygonOption = () => {
    const {
      drawing,
      setMapSettings,
      setMenuSettings,
      setModalSources,
      errorMessage,
      error,
      onDrop,
      uploadConfig
    } = this.props;
    return (
      <div className="draw-menu">
        <div className="draw-menu-title">
          Draw in the map the area you want to analyze or subscribe to
        </div>
        <Button
          className="draw-menu-button"
          theme={drawing ? 'theme-button-light wide' : 'wide'}
          onClick={() => {
            setMapSettings({ drawing: !drawing });
            if (!drawing) {
              setMenuSettings({ menuSection: '' });
            }
            track(drawing ? 'analysisDrawCancel' : 'analysisDrawStart');
          }}
        >
          {drawing ? 'CANCEL' : 'START DRAWING'}
        </Button>
        <div className="draw-menu-separator">or</div>
        <Tooltip
          theme="tip"
          hideOnClick
          html={<Tip text={errorMessage} />}
          position="top"
          followCursor
          animateFill={false}
          disabled={!error || !errorMessage}
        >
          <Dropzone
            className={cx(
              'draw-menu-input',
              { error },
              { 'error-message': errorMessage }
            )}
            onDrop={onDrop}
            accept={uploadConfig.types}
            multiple={false}
          >
            <p>{error || 'Pick a file or drop one here'}</p>
            <Button
              className="info-button"
              theme="theme-button-tiny square"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setModalSources({ open: true, source: 'uploads' });
              }}
            >
              <Icon icon={infoIcon} className="info-icon" />
            </Button>
          </Dropzone>
        </Tooltip>
        <p className="terms">
          By uploading data you agree to the{' '}
          <a href="/terms" target="_blank" rel="noopenner nofollower">
            GFW Terms of Service
          </a>
        </p>
      </div>
    );
  };

  render() {
    const {
      showDraw,
      setMapSettings,
      setAnalysisSettings,
      clearAnalysisError
    } = this.props;
    return (
      <div className="c-chose-analysis">
        <div className="title">ANALYZE AND TRACK FOREST CHANGE</div>
        <div className="options">
          <button
            className={cx({ selected: !showDraw })}
            onClick={() => {
              setAnalysisSettings({ showDraw: false });
              setMapSettings({ drawing: false });
              clearAnalysisError();
            }}
          >
            <div className="button-wrapper">
              <Icon icon={squarePointIcon} className="icon-square-point" />
              <div className="label">CLICK A LAYER ON THE MAP</div>
            </div>
          </button>
          <button
            className={cx('draw-upload-tab', { selected: showDraw })}
            onClick={() => setAnalysisSettings({ showDraw: true })}
          >
            <div className="button-wrapper">
              <Icon icon={polygonIcon} className="icon-polygon" />
              <div className="label">DRAW OR UPLOAD SHAPE</div>
            </div>
          </button>
        </div>
        {showDraw ? this.renderPolygonOption() : this.renderLayerOption()}
      </div>
    );
  }
}

ChoseAnalysis.propTypes = {
  showDraw: PropTypes.bool,
  setAnalysisSettings: PropTypes.func,
  onDrop: PropTypes.func,
  clearAnalysisError: PropTypes.func,
  boundaries: PropTypes.array,
  activeBoundary: PropTypes.object,
  selectBoundaries: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setModalSources: PropTypes.func,
  error: PropTypes.string,
  errorMessage: PropTypes.string,
  uploadConfig: PropTypes.object,
  drawing: PropTypes.bool,
  setMapSettings: PropTypes.func
};

export default ChoseAnalysis;
