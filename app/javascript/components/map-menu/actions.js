import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import axios from 'axios';
import compact from 'lodash/compact';
import { parseGadm36Id } from 'utils/format';
import { MAP } from 'router';
import uniqBy from 'lodash/uniqBy';

export const setLocationsData = createAction('setLocationsData');
export const setMenuLoading = createAction('setMenuLoading');

export const setMenuSettings = createThunkAction(
  'setMenuSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'menu',
        change,
        state
      })
    );
  }
);

const getSearchSQL = (string, nameString, nameStringSimple) => {
  const words = string && string.split(/,| |, /);
  if (words && words.length) {
    const mappedWords = compact(words.map(w => (w ? `%25${w}%25` : '')));
    const whereQueries = mappedWords.map(
      w =>
        `LOWER(${nameString}) LIKE '${w}' OR LOWER(${nameStringSimple}) LIKE '${
          w
        }' OR LOWER(name_1) LIKE '${w}' OR LOWER(simple_name_1) LIKE '${
          w
        }' OR LOWER(name_2) LIKE '${w}' OR LOWER(simple_name_2) LIKE '${w}'`
    );
    return whereQueries.join(' OR ');
  }
  return null;
};

export const getLocationFromSearch = createThunkAction(
  'getLocationFromSearch',
  ({ search, token, lang }) => dispatch => {
    dispatch(setMenuLoading(true));
    if (search) {
      const searchLower = search && search.toLowerCase();
      let nameString = 'name_0';
      let nameStringSimple = 'simple_name_0';
      if (lang !== 'en') nameString = `name_${lang.toLowerCase()}`;
      if (lang !== 'en') nameStringSimple = nameString;
      const whereStatement = getSearchSQL(
        searchLower,
        nameString,
        nameStringSimple
      );

      if (whereStatement) {
        axios
          .get(
            `${
              process.env.CARTO_API
            }/sql?q=SELECT gid_0, gid_1, gid_2, CASE WHEN gid_2 is not null THEN CONCAT(name_2, ', ', name_1, ', ', ${
              nameString
            }) WHEN gid_1 is not null THEN CONCAT(name_1, ', ', ${
              nameString
            }) WHEN gid_0 is not null THEN ${
              nameString
            } END AS label FROM gadm36_political_boundaries WHERE ${
              whereStatement
            } AND gid_0 != 'TWN' AND gid_0 != 'XCA' ORDER BY level, label`,
            {
              cancelToken: token
            }
          )
          .then(response => {
            if (response.data.rows && response.data.rows.length) {
              dispatch(setLocationsData(response.data.rows));
            } else {
              dispatch(setLocationsData([]));
            }
            dispatch(setMenuLoading(false));
          })
          .catch(error => {
            console.info(error);
            dispatch(setMenuLoading(false));
          });
      }
    }
  }
);

export const handleClickLocation = createThunkAction(
  'handleClickLocation',
  ({ gid_0, gid_1, gid_2 }) => (dispatch, getState) => {
    const { location } = getState();
    const query = (location && location.query) || {};
    const newLocation = parseGadm36Id(gid_2 || gid_1 || gid_0);
    const { map, menu, mainMap } = query || {};

    if (newLocation) {
      dispatch({
        type: MAP,
        payload: {
          type: 'country',
          ...newLocation
        },
        query: {
          ...query,
          map: {
            ...map,
            canBound: true
          },
          menu: {
            ...menu,
            menuSection: ''
          },
          mainMap: {
            ...mainMap,
            showAnalysis: true
          }
        }
      });
    }
  }
);

export const handleViewOnMap = createThunkAction(
  'handleViewOnMap',
  ({ analysis, menu, map, mergeQuery }) => (dispatch, getState) => {
    const { payload, query } = getState().location || {};
    const { datasets } = map || {};

    dispatch({
      type: MAP,
      payload,
      query: {
        ...(map && {
          map: {
            ...(mergeQuery && query && query.map),
            ...map,
            ...(mergeQuery &&
              query &&
              query.map &&
              query.map.datasets && {
              datasets: uniqBy(
                [...datasets, ...query.map.datasets],
                'dataset'
              )
            }),
            canBound: true
          }
        }),
        menu: {
          ...(mergeQuery && query && query.menu),
          menu,
          menuSection: ''
        },
        ...(analysis && {
          analysis: {
            ...(mergeQuery && query && query.analysis),
            analysis
          }
        })
      }
    });
  }
);

export const showAnalysis = createThunkAction(
  'showAnalysis',
  () => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
    const { menu } = query || {};
    dispatch({
      type,
      payload,
      query: {
        ...query,
        menu: {
          ...menu,
          menuSection: 'analysis'
        }
      }
    });
  }
);
