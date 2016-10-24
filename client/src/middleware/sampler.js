export default function({ dispatch, getState }) {
  return next => action => {
    // console.log('From Sampler middleware: ', action, dispatch, getState);
    if (!action.payload || !action.payload.then) {
      return next(action); // do nothing and pass the action along to the next middleware 
    }
    action.payload.then(function(response) {
      const newAction = {...action, payload: response };
      dispatch(newAction);
    });
    next(action);
  }
}