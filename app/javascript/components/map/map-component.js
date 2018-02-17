import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Loader from 'components/loader';
import NoContent from 'components/no-content';
import MapControls from 'components/map/components/map-controls';
import MiniLegend from 'components/map/components/mini-legend';

import './map-styles.scss';

class Map extends PureComponent {
  render() {
    const { loading, error, layers, mapZoomIn, mapZoomOut } = this.props;
    return (
      <div className="c-map">
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
        <div id="map" className="c-map" />
        {!loading && (
          <MapControls
            handleZoomIn={() => mapZoomIn()}
            handleZoomOut={() => mapZoomOut()}
          />
        )}
        {!loading && layers && layers.length && <MiniLegend layers={layers} />}
      </div>
    );
  }
}

Map.propTypes = {
  loading: Proptypes.bool.isRequired,
  error: Proptypes.bool.isRequired,
  layers: Proptypes.array,
  mapZoomIn: Proptypes.func,
  mapZoomOut: Proptypes.func
};

export default Map;
