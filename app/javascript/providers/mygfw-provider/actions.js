import axios from 'axios';
import { createAction, createThunkAction } from 'redux-tools';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const getMyGFW = createThunkAction(
  'getMyGFW',
  () => (dispatch, state) => {
    if (!state().myGfw.loading) {
      dispatch(setMyGFWLoading({ loading: true, error: false }));
      axios
        .get(`${process.env.GFW_API}/user`, { withCredentials: true })
        .then(response => {
          if (response.status < 400) {
            dispatch(setMyGFW(response.data.data.attributes));
          }
        })
        .catch(() => {
          dispatch(setMyGFWLoading({ loading: false, error: true }));
        });
    }
  }
);