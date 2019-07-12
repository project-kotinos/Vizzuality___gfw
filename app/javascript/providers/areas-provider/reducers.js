import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setAreas = (state, { payload }) => ({
  ...state,
  data: payload
});

const setArea = (state, { payload }) => ({
  ...state,
  data: [...state.data, payload]
});

const setActiveArea = (state, { payload }) => ({
  ...state,
  activeArea: payload
});

const setAreasLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setAreas]: setAreas,
  [actions.setArea]: setArea,
  [actions.setActiveArea]: setActiveArea,
  [actions.setAreasLoading]: setAreasLoading
};