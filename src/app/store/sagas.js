export const injectSaga = store => (saga) => {
  store.custom.sagas.push(saga)
  return saga
}

export const makeStartSagas = store => () => {
  // eslint-disable-next-line no-param-reassign
  store.custom.runningTasks = []
  return store.custom.sagas.map((saga) => {
    const task = store.custom.runSaga(saga)
    store.custom.runningTasks.push(task)
    return task
  })
}

export const injectSagas = store => (sagas) => {
  if (!Array.isArray(sagas)) return injectSaga(store)(sagas)
  return sagas.map(injectSaga(store))
}
