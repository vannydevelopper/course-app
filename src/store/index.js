import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers/appReducer";
import userReducer from "./reducers/userReducer";

const composedEnhancer = applyMiddleware(thunk)

export const store = createStore(
          combineReducers({
                    user: userReducer,
                    app: appReducer
          }),
          composedEnhancer
)