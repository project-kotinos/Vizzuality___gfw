import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';

import MapComponent from './component';
import { getMapProps } from './selectors';

import * as popupActions from './components/popup/actions';
import { setRecentImagerySettings } from './components/recent-imagery/recent-imagery-actions';
import * as ownActions from './actions';

const actions = {
  setRecentImagerySettings,
  ...popupActions,
  ...ownActions
};

class MapContainer extends PureComponent {
  static propTypes = {
    basemap: PropTypes.object,
    mapOptions: PropTypes.object,
    setLandsatBasemap: PropTypes.func
  };

  state = {
    showTooltip: false,
    tooltipData: {},
    bbox: null
  };

  componentDidUpdate(prevProps) {
    const {
      basemap,
      mapOptions: { zoom },
      canBound,
      bbox,
      geostoreBbox,
      setMapSettings,
      layerBbox
    } = this.props;

    // update landsat basemap when changing zoom
    if (basemap.id === 'landsat' && zoom !== prevProps.zoom) {
      this.props.setLandsatBasemap({
        year: basemap.year,
        defaultUrl: basemap.defaultUrl
      });
    }

    // only set bounding box if action allows it
    if (canBound && bbox !== prevProps.bbox) {
      this.setBbox(bbox);
    }

    // if a new layer contains a bbox
    if (layerBbox && layerBbox !== prevProps.layerBbox) {
      setMapSettings({ bbox: layerBbox });
    }

    // if geostore changes
    if (geostoreBbox && geostoreBbox !== prevProps.geostoreBbox) {
      setMapSettings({ bbox: geostoreBbox });
    }
  }

  handleShowTooltip = (show, data) => {
    this.setState({ showTooltip: show, tooltipData: data });
  };

  setBbox = bbox => {
    this.setState({ bbox });
  };

  handleMapMove = (e, map) => {
    const { setMapSettings } = this.props;
    setMapSettings({
      zoom: map.getZoom(),
      center: map.getCenter(),
      canBound: false,
      bbox: null
    });
    this.setBbox(null);
  };

  handleRecentImageryTooltip = e => {
    const data = e.layer.feature.properties;
    const { cloudScore, instrument, dateTime } = data;
    this.handleShowTooltip(true, {
      instrument: startCase(instrument),
      date: moment(dateTime)
        .format('DD MMM YYYY, HH:mm')
        .toUpperCase(),
      cloudCoverage: `${format('.0f')(cloudScore)}%`
    });
  };

  handleMapInteraction = ({ e, article, output, layer }) => {
    const {
      setAnalysisView,
      setInteraction,
      oneClickAnalysisActive,
      draw
    } = this.props;
    const { data } = e || {};

    if (data && layer && oneClickAnalysisActive) {
      setAnalysisView({ data, layer });
    } else if (!draw) {
      setInteraction({
        ...e,
        label: layer.name,
        article,
        isBoundary: layer.isBoundary,
        id: layer.id,
        value: layer.id,
        config: output
      });
    }
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleShowTooltip: this.handleShowTooltip,
      handleRecentImageryTooltip: this.handleRecentImageryTooltip,
      handleMapInteraction: this.handleMapInteraction,
      handleMapMove: this.handleMapMove,
      setBbox: this.setBbox
    });
  }
}

MapContainer.propTypes = {
  canBound: PropTypes.bool,
  bbox: PropTypes.array,
  geostoreBbox: PropTypes.array,
  setMapSettings: PropTypes.func,
  layerBbox: PropTypes.array,
  oneClickAnalysisActive: PropTypes.bool,
  draw: PropTypes.bool,
  setAnalysisView: PropTypes.func,
  setInteraction: PropTypes.func
};

export default connect(getMapProps, actions)(MapContainer);