import { put, take } from 'redux-saga/effects'

export default function* putAndWait(
  actionStartType,
  successActionType,
  failedActionType,
) {
  yield put(actionStartType)

  const actionResult = yield take([successActionType, failedActionType])

  if (actionResult.type === failedActionType.type) {
    throw actionResult.payload.error
  }

  return actionResult.payload
}
