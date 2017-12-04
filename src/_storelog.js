// import {
//   addTodo,
//   toggleTodo,
//   setVisibilityFilter,
//   VisibilityFilters
// } from './redux/actions';
// import { store } from './redux/store';

// Log the initial state
console.log(differStore.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = differStore.subscribe(() =>
  console.log(differStore.getState())
)

// Dispatch some actions
// differStore.dispatch(addTodo('Learn about actions'))
// differStore.dispatch(addTodo('Learn about reducers'))
// differStore.dispatch(addTodo('Learn about store'))
// differStore.dispatch(toggleTodo(0))
// differStore.dispatch(toggleTodo(1))
// differStore.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// Stop listening to state updates
unsubscribe()